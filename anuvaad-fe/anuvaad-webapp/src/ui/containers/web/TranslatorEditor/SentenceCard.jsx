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
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DictionaryAPI from '../../../../flux/actions/apis/word_dictionary';
import { highlightBlock, startMergeSentence, inProgressMergeSentence, finishMergeSentence, cancelMergeSentence, clearHighlighBlock } from '../../../../flux/actions/apis/translator_actions';
import MenuItems from "./PopUp";
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import InteractiveTranslateAPI from "../../../../flux/actions/apis/intractive_translate";

import copy from 'copy-to-clipboard';
import SENTENCE_ACTION from './SentenceActions'
import { value } from 'jsonpath';

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
        background: "#ecf5f2"

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
            sentenceSaved: false,
            userEnteredText: false,
            selectedSentence: '',
            positionX:0,
            positionY:0,
            sentenceSource:'',
            isopenMenuItems:false,
            parallel_words:null,
            dictionaryWord:''

        };
        this.textInput = React.createRef();
        this.handleUserInputText = this.handleUserInputText.bind(this);

        this.processSaveButtonClicked = this.processSaveButtonClicked.bind(this);
        this.processMergeButtonClicked = this.processMergeButtonClicked.bind(this);
        this.processMergeNowButtonClicked = this.processMergeNowButtonClicked.bind(this);
        this.processMergeCancelButtonClicked = this.processMergeCancelButtonClicked.bind(this);
    }

    componentDidMount() {
        if (this.isSentenceSaved()) {
            this.setState({value: this.props.sentence.tgt})
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((prevProps.sentence_action_operation.finished !== this.props.sentence_action_operation.finished) ) {
            this.setState({
                cardChecked: false
            })
        }
        if ((prevProps.sentence_action_operation.api_status !== this.props.sentence_action_operation.api_status)) {
            this.setState({
                isCardBusy: (this.isCurrentSentenceInProps() ? this.props.sentence_action_operation.api_status : false)
            })
        }

        if(this.state.selectedSentence!== prevState.selectedSentence){
            this.setState({dictionaryWord: prevState.selectedSentence})
        }

        if (prevProps.sentence_highlight !== this.props.sentence_highlight && this.props.sentence_highlight && this.props.sentence_highlight.sentence_id) {
            this.handleSourceScroll(this.props.sentence_highlight.sentence_id)
            // this.setState({
            //     cardInFocus: true
            // })
        }
    }

    handleSourceScroll(id) {
        this.refs[id] && this.refs[id].scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
       
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
        /**
         * left dead code to test
         */
        // const response  = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
        // await sleep(1e3);
        // const countries = await response.json();
        // this.setState({
        //     suggestions: Object.keys(countries).map((key) => countries[key].item[0])
        // })
        // console.log(this.state.suggestions)

        let apiObj = new InteractiveTranslateAPI(this.props.sentence.src, this.state.value, {model_id: this.props.modelId}, true, '', this.props.sentence.s_id);
        const apiReq    = fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then(async response => {
            const rsp_data = await response.json();
            if (!response.ok) {
                return Promise.reject('');
            } else {
                console.log(rsp_data.output.predictions)
                this.setState({
                    suggestions: rsp_data.output.predictions
                })
            }
        }).catch((error) => {
            this.setState({
                suggestions: []
            })
        });
    }

    /**
     * user actions handlers
     */
    processSaveButtonClicked() {

        if (!this.state.userEnteredText) {
            // user has not entered anything, check availability  of s0_tgt
            if (this.state.value === '' && this.props.sentence.s0_tgt === '') {
                alert('Please translate the source sentence and then save .. ')
                return;
            }
            /**
             * textfield is empty but MT sentence exists, then transfer the MT
             * sentence to text field.
             */
            if (this.state.value === '' && this.props.sentence.s0_tgt !== '') {
                if (this.props.onAction) {
                    this.setState({
                        value: this.props.sentence.s0_tgt
                    })

                    let sentence = { ...this.props.sentence };
                    sentence.save = true;
                    sentence.tgt = this.props.sentence.s0_tgt;
                    delete sentence.block_identifier;

                    this.props.onAction(SENTENCE_ACTION.SENTENCE_SAVED, this.props.pageNumber, [sentence])
                }
            }

            /**
             * textfield has data but user has not entered anything
             */
            if (this.state.value.length > 0) {
                return;
            }
        }

        this.setState({
            userEnteredText: false
        })

        if (this.props.onAction) {

            let sentence = { ...this.props.sentence };
            sentence.save = true;
            sentence.tgt = this.state.value;
            delete sentence.block_identifier;

            this.props.onAction(SENTENCE_ACTION.SENTENCE_SAVED, this.props.pageNumber, [sentence])
        }
    }

    processMergeNowButtonClicked() {
        this.setState({
            isModeMerge: false,
        })
        this.props.finishMergeSentence()
        if (this.props.onAction) {
            this.props.onAction(SENTENCE_ACTION.SENTENCE_MERGED, this.props.pageNumber, this.props.sentence_action_operation.sentences, this.props.sentence)
        }
    }

    processSplitButtonClicked() {
        let start_index = 0;
        let end_index = 0;
        if (this.props.onAction) {
            this.props.onAction(SENTENCE_ACTION.SENTENCE_SPLITTED, this.props.pageNumber, [this.props.sentence], start_index, end_index)
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
        this.setState({
            value: event.target.value,
            userEnteredText: true
        });
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
            this.makeAPICallInteractiveTranslation(this.props.sentence)
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
                cardInFocus: false,
                parallel_words:null
            })
        }
    };

    getSelectionText = (event) =>{
        let selectedSentence    = window.getSelection().toString();
        let sentenceSource      = event.target.innerHTML;
        if(selectedSentence && sentenceSource.includes(selectedSentence)){
            this.setState({selectedSentence, sentenceSource, positionX: event.clientX , positionY:event.clientY, isopenMenuItems : true})
        }
        
    }

    renderSourceSentence = () => {
        return (
            <div >
                <Typography color="textSecondary" gutterBottom>
                    Source sentence
                    <br />
                </Typography>

                <Typography variant="subtitle1" gutterBottom onMouseUp={(event)=>{this.getSelectionText(event)}}>
                    {this.props.sentence.src}
                    <br />
                </Typography>
            </div>
        )
    }

    renderMTTargetSentence = () => {
        return (
            <div>
                <Divider />
                <Typography color = "textSecondary" gutterBottom>
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

    renderDictionarySentence = () => {
        return (
            <div>
                <Divider />
                <Typography color="textSecondary" gutterBottom>
                    Meaning of {this.state.dictionaryWord}
                    <br />
                </Typography>
                {this.state.parallel_words.map((words) => <Typography variant="subtitle1" gutterBottom>{words}</Typography>)}
                    <br />
                
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
                            return option.tgt
                        }}
                        renderOption={(option, index) => {
                            return (<Typography noWrap>{option.tgt}</Typography>)
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
                                value: newValue.tgt, //this.state.value + ' ' + newValue.name,
                                showSuggestions: false,
                                userEnteredText: true
                            });
                        }}
                        onClose={(event, newValue) => {
                            this.setState({
                                showSuggestions: false,
                                suggestions: []
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
                                // onFocus={event => {
                                //     this.props.highlightBlock(this.props.sentence)
                                // }}
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


    async makeAPICallDictionary() {
        let apiObj      = new DictionaryAPI(this.state.selectedSentence,this.props.word_locale, this.props.tgt_locale )
        const apiReq    = await fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then ( (response)=> {
                    if (response.status >= 400 && response.status < 600) {
                        console.log('api failed because of server or network')
                        this.props.sentenceActionApiStopped()
                    }
                    response.text().then( (data)=> {
                        let val = JSON.parse(data)
                        return val.data;
                    }).then((result)=>{
                        let parallel_words = []
                        result.parallel_words.map((words) =>{
                            if(this.props.tgt_locale === words.locale)
                                parallel_words.push(words.name)
                        } )
                        
                        this.setState({
                            parallel_words: parallel_words
                    })
                })
                })
             
              

            
            
       
      }

    handleClose = () => {
        this.setState({selectedSentence: '',  positionX:0, positionY:0,isopenMenuItems : false})
    }

    handleCopy = () => {
        copy(this.state.selectedSentence)
        this.handleClose()
    
      }
      
    handleOperation = (action) =>{
        switch(action) {
            case "Dictionary": {
              this.makeAPICallDictionary();
              this.handleClose();
              return;
            }
    
            case "Split sentence": {
              this.processSplitButtonClicked()
              return;
            }
            case "Copy": {
    
                this.handleCopy()
              return;
            }
          }
    }

    renderMenuItems = () =>{

        return (
        <MenuItems
            splitValue={this.state.selectedSentence}
            positionX={this.state.positionX}
            positionY = {this.state.positionY}
            handleClose={this.handleClose.bind(this)}
            isopenMenuItems = {this.state.isopenMenuItems}
            handleOperation={this.handleOperation.bind(this)}
          />)
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
                    style={{ color: 'green' }}
                />
            )
        }
        return (<div></div>)
    }

    handleCardExpandClick = () => {
        if (this.state.cardInFocus) {
            this.props.clearHighlighBlock()
        } else {
            this.props.highlightBlock(this.props.sentence)
        }

        this.setState({ cardInFocus: !this.state.cardInFocus })

        /**
        * For highlighting textarea on card expand
        */
        this.textInput && this.textInput.current && this.textInput.current.focus();
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

    render() {

        return (
            <div ref={this.props.sentence.s_id}>
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

                        {this.state.parallel_words && <CardContent style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ width: "90%" }}>
                                {this.renderDictionarySentence()}
                            </div>
                           

                        </CardContent>}

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
            {this.state.isopenMenuItems && this.renderMenuItems()}
            </div>

        )
    }
}

const mapStateToProps = state => ({
    document_contents: state.document_contents,
    sentence_action_operation: state.sentence_action_operation,
    sentence_highlight: state.sentence_highlight
});

const mapDispatchToProps = dispatch => bindActionCreators(
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
