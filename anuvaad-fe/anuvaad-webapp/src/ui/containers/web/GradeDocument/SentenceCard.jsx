import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardActions from '@material-ui/core/CardActions';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import copy from 'copy-to-clipboard';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { highlightBlock, clearHighlighBlock } from '../../../../flux/actions/users/translator_actions';
import InteractiveTranslateAPI from "../../../../flux/actions/apis/document_translate/intractive_translate";
import DictionaryAPI from '../../../../flux/actions/apis/document_translate/word_dictionary';

import Modal from '@material-ui/core/Modal';
import CreateGlossary from '../../../../flux/actions/apis/document_translate/create_glossary';


const TELEMETRY = require('../../../../utils/TelemetryManager')
const BLEUCALCULATOR = require('../../../../utils/BleuScoreCalculator')
var time = 0;
const styles = {
    card_active: {
        background: 'rgb(211,211,211)',
        borderRadius: 10,
        border: 0,
        color: 'green',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    card_inactive: {
        color: 'grey',
    },
    card_saved: {
        color: 'green',
        background: "rgb(199, 228, 219)"

    },
    expand: {
        transform: 'rotate(0deg)',
    },
    expandOpen: {
        transform: 'rotate(180deg)',

    },
    card_open: {
        background: "rgb(206, 231, 236)"
    },

}

const theme = createMuiTheme({
    overrides: {
        MuiCardContent: {
            root: {
                padding: '0px',
                paddingLeft: '10px',
                "&:first-child": {
                    paddingTop: '10px',
                },
                "&:last-child": {
                    paddingBottom: 0,
                },

            },
        },
        MuiDivider: {
            root: {
                marginTop: '-10px',
                marginBottom: '10px'
            }
        }
    },
});

const filterOptions = (options, { inputValue }) => options;

class SentenceCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: (this.props.sentence.save ? this.props.sentence.tgt : ''),
            showSuggestions: false,
            suggestions: [],
            cardInFocus: false,
            cardChecked: false,
            isCardBusy: false,
            sentenceSaved: false,
            userEnteredText: false,
            selectedSentence: '',
            positionX: 0,
            positionY: 0,
            sentenceSource: '',
            isopenMenuItems: false,
            parallel_words: null,
            dictionaryWord: '',
            startIndex: null,
            endIndex: null,
            isOpenDictionaryOnly: false,
            showProgressStatus: false,
            message: null,
            showStatus: false,
            snackBarMessage: null,
            highlight: false,
            hideSplit: false,
            openModal: false

        };
        this.textInput = React.createRef();
        
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextProps.document_editor_mode.mode !== this.props.document_editor_mode.mode) {
            if (this.state.cardChecked)
                this.setState({ cardChecked: false })
        }
    }

    shouldComponentUpdate(prevProps, nextState) {

        if (prevProps.sentence) {
            if (prevProps.document_editor_mode.page_nos.indexOf(this.props.pageNumber) !== -1) {
                return true
            }

            if ((prevProps.sentence.s_id === prevProps.block_highlight.current_sid) ||
                (prevProps.sentence.s_id === prevProps.block_highlight.prev_sid)) {
                return true
            }

            if (prevProps.sentence_highlight && (prevProps.sentence.block_identifier === prevProps.sentence_highlight.block_identifier)) {
                return true;
            }
            return false
        }
        return true;
    }

    /**
     * utility function
     */
    isCurrentSentenceInProps = () => {
        let found = false
        this.props.sentence_action_operation.sentences.forEach(sentence => {
            if (sentence.s_id === this.props.sentence.s_id) {

                found = true;
            }
        })
        return found;
    }



    /**
     * user actions handlers
     */
    processSaveButtonClicked() {
        if (this.state.value.length < 1 || this.state.value === '') {
            // textfield has no value present.
            // - check availability of s0_tgt
            //  - if s0_tgt is not available, alert user
            //  - if s0_tgt is available, then move s0_tgt to textfield
            if (this.props.sentence.s0_tgt === '' || !this.props.sentence.s0_tgt) {
                alert('Please translate the sentence and then save. ')
                return;
            }
            if (this.props.sentence.save) {
                alert('Your will lose saved sentence, please translate the sentence and then save. ')
                return;
            }

            this.setState({
                value: this.props.sentence.s0_tgt
            })
            
        } else {
            // textfield has value present
            if (!this.state.userEnteredText) {
                // value is present, however user hasn't edit it.
                // no point saving
                alert('Please edit your sentence and then save. ')
                return;
            }
            
        }
    }

    

    handleClick = () => {
        this.setState({ showSuggestions: false, highlight: false })
    }
    
    snackBarMessage = () => {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={this.state.showStatus}
                onClose={(e, r) => {
                    this.setState({ showStatus: false, snackBarMessage: null })
                }}
            >
                <Alert elevation={6} variant="filled" severity={this.state.snackBarVariant}>{this.state.snackBarMessage}</Alert>
            </Snackbar>
        );
    };

    handleClose = () => {
        this.setState({
            // selectedSentence: '', 
            positionX: 0, positionY: 0, isopenMenuItems: false, endIndex: null, startIndex: null
        })
    }

    handleCopy = () => {
        copy(this.state.selectedSentence)
        this.handleClose()
    }

    handleAddToGlossary = () => {
        this.setState({ openModal: true })
    }

    handleOperation = (action) => {
        switch (action) {
            case 0: {
                this.makeAPICallDictionary();
                this.handleClose();
                return;
            }

            case 1: {
                this.processSplitButtonClicked(this.state.startIndex, this.state.endIndex);
                this.handleClose();
                return;
            }
            case 2: {

                this.handleCopy()
                return;
            }
            case 3: {
                this.handleAddToGlossary(this.state.startIndex, this.state.endIndex)
                this.handleClose();
                return;
            }
        }
    }

    renderCardIcon = () => {
        return (
            <div style={{ width: "10%", textAlign: "right" }}>
                <IconButton aria-label="settings"
                    style={this.cardCompare() ? styles.expandOpen : styles.expand}
                    onClick={this.handleCardExpandClick}>
                    <ExpandMoreIcon />
                </IconButton>
            </div>
        )
    }


    renderSourceSentence = () => {
        return (
            <div >
                <Typography variant="subtitle1" gutterBottom onMouseUp={(event) => { this.getSelectionText(event) }}>
                    {this.props.sentence.src}
                </Typography>
            </div>
        )
    }

    renderMTTargetSentence = () => {
        return (
            <div>
                <Divider />
                <Typography variant="subtitle1" gutterBottom>
                    {this.props.sentence.s0_tgt}
                    <br />
                </Typography>

            </div>
        )
    }

   

    renderSentenceCard = () => {
        return (
            <div key={12} style={{ padding: "1%" }}>
                <MuiThemeProvider theme={theme}>
                    <Card style={this.cardBlockCompare() || (this.cardCompare()) ? styles.card_open : this.isSentenceSaved() ? styles.card_saved : styles.card_inactive}>
                        <CardContent style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ width: "90%" }}>
                                {this.renderSourceSentence()}
                            </div>
                           
                           

                        </CardContent>
                        <CardContent>
                                {this.renderMTTargetSentence()}
                                <br />
                               
                            </CardContent>

                        

                        {/* <Collapse in={this.cardCompare()} timeout="auto" unmountOnExit>
                            <CardContent>
                                {this.renderMTTargetSentence()}
                                <br />
                               
                            </CardContent>
                            <CardActions>
                                {this.renderNormaModeButtons()}
                            </CardActions>
                        </Collapse> */}
                    </Card>
                </MuiThemeProvider>
            </div>
        )
    }


    handleCardExpandClick = () => {
        if (this.cardCompare()) {
            this.setState({ cardInFocus: false })
            this.props.clearHighlighBlock()
            time = 0
            TELEMETRY.endSentenceTranslation(this.props.model.source_language_name, this.props.model.target_language_name, this.props.jobId, this.props.sentence.s_id)
        } else {
            if (this.props.block_highlight && this.props.block_highlight.current_sid) {
                time = 0
                TELEMETRY.endSentenceTranslation(this.props.model.source_language_name, this.props.model.target_language_name, this.props.jobId, this.props.block_highlight.current_sid)
            }
            this.setState({ cardInFocus: true })
            this.props.highlightBlock(this.props.sentence, this.props.pageNumber)
            /**
             * For highlighting textarea on card expand
             */
            this.textInput && this.textInput.current && this.textInput.current.focus();
            time = new Date()
            TELEMETRY.startSentenceTranslation(this.props.model.source_language_name, this.props.model.target_language_name, this.props.jobId, this.props.sentence.s_id)
        }

    }

    cardBlockCompare = () => {
        if (this.props.sentence_highlight && this.props.sentence_highlight.sentence_id === this.props.sentence.s_id) {
            return true;
        }
        return false;
    }

    cardCompare = () => {
        if (this.props.block_highlight.current_sid === this.props.sentence.s_id) {
            return true;
        }
        return false;
    }

    /**
     * utility functions
     */
    isSentenceSaved = () => {
        if (this.props.sentence.save) {
            return true;
        }
        return false;
    }
    

    makeCreateGlossaryAPICall = (tgt) => {
        let locale = `${this.props.model.source_language_code}|${this.props.model.target_language_code}`
        this.setState({ loading: true })
        let userProfile = JSON.parse(localStorage.getItem('userProfile'))
        let apiObj = new CreateGlossary(userProfile.orgID, this.state.selectedSentence, tgt, locale, 'JUDICIARY')
        fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        })
            .then(async res => {
                if (res.ok) {
                    await this.processResponse(res, 'success')
                } else {
                    await this.processResponse(res, 'error')
                }
            })
    }

    handleGlossaryModalClose = () => {
        this.setState({ openModal: false })
    }

    processResponse = async (res, variant) => {
        let message
        let response = await res.json().then(obj => {
            message = obj.message
        })
        this.setState({ loading: false, showStatus: true, snackBarMessage: message, snackBarVariant: variant, openModal: false }, () => {
            setTimeout(() => {
                this.setState({ showStatus: false, snackBarMessage: null, snackBarVariant: '' })
            }, 3000)
        })
    }

    render() {
        return (
            <div >
                {this.renderSentenceCard()}
               
            </div>

        )
    }
}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    sentence_highlight: state.sentence_highlight.sentence,
    block_highlight: state.block_highlight,
    document_editor_mode: state.document_editor_mode,
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        highlightBlock,
        clearHighlighBlock
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(SentenceCard);
