import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { highlightBlock, startMergeSentence, inProgressMergeSentence, finishMergeSentence, cancelMergeSentence, clearHighlighBlock } from '../../../../flux/actions/apis/translator_actions';

import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";

import SENTENCE_ACTION from './SentenceActions'

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
    },
    expand: {
        transform: 'rotate(0deg)',
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
}

function sleep(delay = 0) {
    return new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
}

const filterOptions = (options, { inputValue }) => options;

class SentenceCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            showSuggestions: false,
            suggestions: [],
            cardInFocus: false,
            cardChecked: false,
            isModeMerge: false,
            isCardBusy: false,
            sentence_saved: false
        };
        this.textInput                          = React.createRef();
        this.handleUserInputText                = this.handleUserInputText.bind(this);
        
        this.processSaveButtonClicked           = this.processSaveButtonClicked.bind(this);
        this.processMergeButtonClicked          = this.processMergeButtonClicked.bind(this);
        this.processMergeNowButtonClicked       = this.processMergeNowButtonClicked.bind(this);
        this.processMergeCancelButtonClicked    = this.processMergeCancelButtonClicked.bind(this);
    }

    componentDidUpdate(prevProps) {
        if ((prevProps.sentence_action_operation.finished !== this.props.sentence_action_operation.finished) ) {
            this.setState({
                cardChecked: false
            })
        }
        if ((prevProps.sentence_action_operation.api_status !== this.props.sentence_action_operation.api_status) ) {
            this.setState({
                isCardBusy: (this.isCurrentSentenceInProps() ? this.props.sentence_action_operation.api_status : false)
            })
        }
    }

    /**
     * utility function
     */
    isCurrentSentenceInProps = () => {
        let found = false
        this.props.sentence_action_operation.sentences.forEach(sentence => {
            if (sentence.s_id === this.props.sentence.s_id) {
                console.log('matched, showing busy')
                found = true;
            }
        })
        return found;
    }

    /**
     * api calls
     */
    async makeAPICallInteractiveTranslation() {
        const response  = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
        await sleep(1e3);
        const countries = await response.json();
        this.setState({
            suggestions: Object.keys(countries).map((key) => countries[key].item[0])
        })
    }

    /**
     * user actions handlers
     */
    processSaveButtonClicked() {
        if (this.state.value === '' && this.props.sentence.s0_tgt !== '') {
            this.setState({
                value: this.props.sentence.s0_tgt
            })
            if (this.props.onAction) {
                let sentence    = {...this.props.sentence};
                sentence.save   = true;
                sentence.tgt    = this.state.value;
                delete sentence.block_identifier;

                this.props.onAction(SENTENCE_ACTION.SENTENCE_SAVED, [sentence])
            }
        } else {
            alert('Please enter translated sentence before saving')
        }
    }

    processMergeNowButtonClicked() {
        this.setState({
            isModeMerge: false,
        })
        this.props.finishMergeSentence()
        if (this.props.onAction) {
            this.props.onAction(SENTENCE_ACTION.SENTENCE_MERGED, this.props.sentence_action_operation.sentences, this.props.sentence)
        }
    }

    processSplitButtonClicked() {
        let start_index = 0;
        let end_index   = 0;
        if (this.props.onAction) {
            this.props.onAction(SENTENCE_ACTION.SENTENCE_SPLITTED, [this.props.sentence], start_index, end_index)
        }
    }

    /**
     * Merge mode user action handlers
     */
    processMergeButtonClicked() {
        this.setState({
            isModeMerge: true
        })
        this.props.startMergeSentence()
    }

    processMergeCancelButtonClicked() {
        this.setState({
            isModeMerge: false,
        })
        this.props.cancelMergeSentence()
    }

    processMergeSelectionToggle = () => {
        this.props.inProgressMergeSentence(this.props.sentence)
        this.setState({
            cardChecked: !this.state.cardChecked
        })
    }

    handleUserInputText(event) {
        this.setState({ value: event.target.value });
    }

    handleKeyDown = (event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        /**
         * Ctrl+s
         */
        if ((event.ctrlKey || event.metaKey) && charCode === 's') {
            console.log('Ctrl+S pressed, saving user data')
            this.processSaveButtonClicked()
            event.preventDefault();
            return false
        }

        /**
         * user requesting for suggestions
         */
        var TABKEY = 9;
        if (event.keyCode === TABKEY) {
            this.setState({ showSuggestions: true })
            this.makeAPICallInteractiveTranslation()
            event.preventDefault();
            return false
        }
    }

    handleClickAway = () => {
        /**
         * Unroll the card only in normal operation
         * - in merge mode do not collapse the current card.
         */
        if (!this.state.isModeMerge) {
            this.setState({
                cardInFocus: false
            })
        }
    };

    renderSourceSentence = () => {
        return (
            <div>
                <Typography color="textSecondary" gutterBottom>
                    Source sentence
                    <br />
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    {this.props.sentence.s0_src}
                    <br />
                </Typography>
            </div>
        )
    }

    renderMTTargetSentence = () => {
        return (
            <div>
                <Divider />
                <Typography color="textSecondary" gutterBottom>
                    Matchine translated
                    <br />
                </Typography>

                <Typography variant="subtitle1" gutterBottom>
                    {this.props.sentence.s0_tgt}
                    <br />
                </Typography>
                <Divider />
            </div>
        )
    }

    renderUserInputArea = () => {
        return (
            <form name={this.props.sentence.s_id}>
                <div>
                    <Autocomplete
                        filterOptions={filterOptions}
                        getOptionLabel={(option) => {
                            return option.name
                        }}
                        renderOption={(option, index) => {
                            return (<Typography noWrap>{option.name}</Typography>)
                        }}
                        options={this.state.suggestions}

                        inputValue={this.state.value}
                        fullWidth
                        open={this.state.showSuggestions}
                        loading={true}
                        loadingText={'Loading ...'}
                        onChange={(event, newValue) => {
                            console.log('onChange of autocomplete is fired: ', newValue)
                            this.setState({
                                value: this.state.value + ' ' + newValue.name,
                                showSuggestions: false
                            });
                        }}
                        onClose={(event, newValue) => {
                            this.setState({
                                showSuggestions: false
                            });
                        }}
                        renderInput={params => (
                            <TextField {...params} label="Enter translated sentence"
                                helperText="Ctrl+s to save, TAB key to get suggestions of your choice"
                                type="text"
                                name={this.props.sentence.s_id}
                                value={this.state.value}
                                onChange={this.handleUserInputText}
                                fullWidth
                                multiline
                                disabled={this.state.isCardBusy}
                                variant="outlined"
                                onKeyDown={this.handleKeyDown}
                                inputRef={this.textInput}
                                onFocus={event => {
                                    this.props.highlightBlock(this.props.sentence)
                                }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <React.Fragment>
                                        {this.state.isCardBusy ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                      </React.Fragment>
                                    ),
                                  }}
                            />
                        )} />
                </div>
                <br />
            </form>
        )
    }

    renderNormaModeButtons = () => {
        return (
            <div>
                <Button onClick={this.processSaveButtonClicked} variant="outlined" color="primary">
                    SAVE
                </Button>
                <Button onClick={this.processMergeButtonClicked} variant="outlined" color="primary">
                    MERGE
                </Button>
            </div>
        )
    }

    renderMergeModeButtons = () => {
        return (
            <div>
                <Button onClick={this.processMergeNowButtonClicked} variant="outlined" color="primary">
                    MERGE NOW
                </Button>
                <Button onClick={this.processMergeCancelButtonClicked} variant="outlined" color="primary">
                    CANCEL MERGE
                </Button>
            </div>
        )
    }

    renderSentenceSaveStatus = () => {
        if (this.props.sentence.save) {
            return (
                <Chip size="medium" label={"sentence saved"} style={{ 'margin': 4 }} color="primary" />
            )
        }
        return (
            <Chip size="medium" label={"sentence saved"} style={{ 'margin': 4 }} color="primary" />
        )
    }

    renderCardSelectedForMerge = () => {
        if (this.props.sentence_action_operation.progress) {
            return (
                <Checkbox
                    checked={this.state.cardChecked}
                    onChange={this.processMergeSelectionToggle}
                    style={{color: 'green'}}
                />
            )
        }
        return(<div></div>)
    }

    handleCardExpandClick = () => {
        this.setState({ cardInFocus: !this.state.cardInFocus })
        
        this.textInput && this.textInput.current && this.textInput.current.focus();
    }

    /**
     * utility functions
     */
    isSentenceSaved = () => {
        if (this.props.sentence.save) {
            return true;
        }
        return this.state.sentence_saved;
    }

    render() {

        return (
            <ClickAwayListener mouseEvent="onMouseDown" onClickAway={this.handleClickAway}>
                <div key={12} style={{ padding: "1%" }}>
                    <Card style={this.isSentenceSaved() ? styles.card_saved : styles.card_inactive}>
                        <CardContent style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ width: "90%" }}>
                                {this.renderSourceSentence()}
                            </div>
                            <div style={{ width: "10%", textAlign: "right" }}>
                                <IconButton aria-label="settings"
                                    style={this.state.cardInFocus ? styles.expandOpen : styles.expand}
                                     onClick={this.handleCardExpandClick}>
                                    <ExpandMoreIcon />
                                </IconButton>
                            </div>
                            {this.renderCardSelectedForMerge()}

                        </CardContent>

                        <Collapse in={this.state.cardInFocus} timeout="auto" unmountOnExit>
                            <CardContent>
                                {this.renderMTTargetSentence()}
                                <br />
                                {this.renderUserInputArea()}
                                <br />
                                {this.state.isModeMerge ? this.renderMergeModeButtons() : this.renderNormaModeButtons()}
                                <br />
                            </CardContent>
                        </Collapse>
                    </Card>
                </div>
            </ClickAwayListener>
        )
    }
}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    sentence_action_operation: state.sentence_action_operation,
    sentence_highlight: state.sentence_highlight
});
  
const mapDispatchToProps = dispatch =>bindActionCreators(
    {
        highlightBlock, 
        startMergeSentence, 
        inProgressMergeSentence, 
        finishMergeSentence,
        cancelMergeSentence,
        clearHighlighBlock
    },
    dispatch
);
  
export default connect(mapStateToProps, mapDispatchToProps)(SentenceCard);
