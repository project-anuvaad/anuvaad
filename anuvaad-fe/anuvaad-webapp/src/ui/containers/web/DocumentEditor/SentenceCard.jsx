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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import MenuItems from "./PopUp";
import SENTENCE_ACTION from './SentenceActions'
import Dictionary from "./Dictionary"

import { highlightBlock, clearHighlighBlock } from '../../../../flux/actions/users/translator_actions';
import InteractiveTranslateAPI from "../../../../flux/actions/apis/document_translate/intractive_translate";
import DictionaryAPI from '../../../../flux/actions/apis/document_translate/word_dictionary';
import AddToGlossaryModal from './AddToGlossaryModal';
import Modal from '@material-ui/core/Modal';
import CreateGlossary from '../../../../flux/actions/apis/document_translate/create_glossary';
import { Grid } from '@material-ui/core';
import ViewGlossary from '../../../../flux/actions/apis/user_glossary/fetch_user_glossary';
import APITransport from "../../../../flux/actions/apitransport/apitransport";


const TELEMETRY = require('../../../../utils/TelemetryManager')
const BLEUCALCULATOR = require('../../../../utils/BleuScoreCalculator')
const TMX_HIGHLIGHT = require('../../../../utils/TmxHighlight');

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
            score: "",
            openModal: false,
            eventArray: []

        };
        this.textInput = React.createRef();
        this.handleUserInputText = this.handleUserInputText.bind(this);

        this.processSaveButtonClicked = this.processSaveButtonClicked.bind(this);
        this.processMergeButtonClicked = this.processMergeButtonClicked.bind(this);
        this.processMergeNowButtonClicked = this.processMergeNowButtonClicked.bind(this);
        this.processMergeCancelButtonClicked = this.processMergeCancelButtonClicked.bind(this);
    }

    componentDidMount() {
        if (this.props.sentence && this.props.sentence.hasOwnProperty("rating_score") && this.props.sentence.rating_score) {
            this.setState({ score: this.props.sentence.rating_score })
        }
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
        let userRole = localStorage.getItem("roles")
        let orgId = JSON.parse(localStorage.getItem("userProfile")).orgID
        let eventArray = this.handleTimeCalc("onSave", "", (this.state.value.length < 1 || this.state.value === '') ? this.props.sentence.s0_tgt : this.state.value)
        this.setState({ eventArray })
        if (!this.state.score && userRole === "ANNOTATOR" && orgId !== "NONMT") {
            alert('Please rate the sentence and then save. ')
        }
        else if (this.state.value.length < 1 || this.state.value === '') {
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

            if (this.props.onAction) {
                let sentence = { ...this.props.sentence };
                sentence.save = true;
                sentence.tgt = this.props.sentence.s0_tgt;
                delete sentence.block_identifier;
                let timeCalc = sentence.hasOwnProperty("time_spent_ms") ? sentence.time_spent_ms + this.timeSpent() : this.timeSpent();
                sentence.time_spent_ms = timeCalc;
                sentence.bleu_score = (sentence.s0_tgt && sentence.tgt) ? BLEUCALCULATOR.scoreSystem((sentence.s0_tgt).trim(), (sentence.tgt).trim()) : 0;

                if (userRole === "ANNOTATOR" && this.state.score) {
                    sentence.rating_score = this.state.score
                }
                // TELEMETRY.sentenceChanged(sentence.s0_tgt, sentence.tgt, sentence.s_id, "translation", sentence.s0_src, sentence.bleu_score, sentence.time_spent_ms, userRole === "ANNOTATOR" ? this.state.score : '', eventArray)
                this.props.onAction(SENTENCE_ACTION.SENTENCE_SAVED, this.props.pageNumber, [sentence], "", "", userRole === "ANNOTATOR" ? this.state.score : '', eventArray)
                this.setState({ eventArray: [] })
                return;
            }
        } else {
            // textfield has value present
            if (!this.state.userEnteredText && this.props.sentence.rating_score === this.state.score) {
                // value is present, however user hasn't edit it.
                // no point saving
                alert('Please edit your sentence and then save. ')
                return;
            }
            if (this.props.onAction) {
                this.setState({ userEnteredText: false })
                let sentence = { ...this.props.sentence };
                sentence.save = true;
                sentence.tgt = this.state.value;
                delete sentence.block_identifier;
                sentence.bleu_score = (sentence.s0_tgt && sentence.tgt) ? BLEUCALCULATOR.scoreSystem((sentence.s0_tgt).trim(), (sentence.tgt).trim()) : 0;
                let timeCalc = sentence.hasOwnProperty("time_spent_ms") ? sentence.time_spent_ms + this.timeSpent() : this.timeSpent();
                sentence.time_spent_ms = timeCalc;

                if (userRole === "ANNOTATOR" && this.state.score) {
                    sentence.rating_score = this.state.score
                }


                this.props.onAction(SENTENCE_ACTION.SENTENCE_SAVED, this.props.pageNumber, [sentence], "", "", userRole === "ANNOTATOR" ? this.state.score : '', eventArray)
                // TELEMETRY.sentenceChanged(sentence.s0_tgt, sentence.tgt, sentence.s_id, "translation", sentence.s0_src, sentence.bleu_score, sentence.time_spent_ms, userRole === "ANNOTATOR" ? this.state.score : '', eventArray)
                this.setState({ eventArray: [] })
            }
        }
    }

    processMergeNowButtonClicked() {

        if (this.props.onAction) {
            this.setState({ value: '' })
            this.props.onAction(SENTENCE_ACTION.SENTENCE_MERGED, this.props.pageNumber, null, this.props.sentence)
        }
    }

    processSplitButtonClicked(start_index, end_index) {
        if (this.props.onAction) {
            let eventArray = this.handleTimeCalc(this.state.selectedSentence, "split", this.state.value)
            this.setState({ value: '', eventArray })
            this.props.onAction(SENTENCE_ACTION.SENTENCE_SPLITTED, this.props.pageNumber, [this.props.sentence], start_index, end_index)
        }
    }

    /**
     * Merge mode user action handlers
     */
    processMergeButtonClicked() {
        this.props.onAction(SENTENCE_ACTION.START_MODE_MERGE, this.props.pageNumber, [this.props.sentence])
    }

    processMergeCancelButtonClicked() {
        this.props.onAction(SENTENCE_ACTION.END_MODE_MERGE, this.props.pageNumber, [this.props.sentence])
        this.setState({ cardChecked: false })
    }

    processMergeSelectionToggle = () => {
        this.setState({
            cardChecked: !this.state.cardChecked
        })
        if (!this.state.cardChecked)
            this.props.onAction(SENTENCE_ACTION.ADD_SENTENCE_FOR_MERGE, this.props.pageNumber, [this.props.sentence])
        else
            this.props.onAction(SENTENCE_ACTION.REMOVE_SENTENCE_FOR_MERGE, this.props.pageNumber, [this.props.sentence])
    }

    moveText() {
        if (!this.props.sentence.s0_tgt) {
            alert("Sorry, Machine translated text is not available...")
        } else {
            if (this.state.value === this.props.sentence.s0_tgt) {
                this.setState({
                    value: this.props.sentence.s0_tgt,
                })
            } else {
                this.setState({
                    value: this.props.sentence.s0_tgt,
                    userEnteredText: true
                })
            }
        }
    }

    getSelectionText = (event) => {
        this.setState({ selectedSentence: '' })
        let selectedSentence = window.getSelection().toString();
        // let endIndex = window.getSelection().focusOffset;
        // let startIndex = window.getSelection().anchorOffset;
        let startIndex = TMX_HIGHLIGHT.getSelectionOffsetFrom(event.target)
        let endIndex = startIndex + selectedSentence.length
        let sentenceSource = event.target.textContent;
        if (selectedSentence && sentenceSource.includes(selectedSentence) && this.state.cardInFocus) {
            this.setState({
                selectedSentence, sentenceSource, positionX: event.clientX, startIndex, endIndex, positionY: event.clientY, isopenMenuItems: true,
                dictionaryX: event.clientX, dictionaryY: event.clientY, hideSplit: selectedSentence === sentenceSource ? true : false
            })
        }
    }

    renderSourceSentence = () => {
        if (this.cardCompare() && this.props.sentence.tmx_replacement && this.props.sentence.tmx_replacement.length > 0) {
            const { src, tmx_replacement } = this.props.sentence
            const modified_src = TMX_HIGHLIGHT.showSrcTmxIndicator(src, tmx_replacement)
            return (
                <div>
                    <Typography variant="subtitle1" gutterBottom onMouseUp={(event) => { this.getSelectionText(event) }}>
                        {modified_src}
                    </Typography>
                </div>
            )
        }
        return (
            <div >
                <Typography variant="subtitle1" gutterBottom onMouseUp={(event) => { this.getSelectionText(event) }}>
                    {this.props.sentence.src}
                </Typography>
            </div>
        )
    }

    renderMTTargetSentence = () => {
        if (this.state.cardInFocus && this.props.sentence.tmx_replacement && this.props.sentence.tmx_replacement.length > 0) {
            const tmx_replacement = this.props.sentence.tmx_replacement
            const tgt = this.props.sentence.s0_tgt
            const modified_tgt = TMX_HIGHLIGHT.showTgtTmxIndicator(tgt, tmx_replacement)
            return (
                <div>
                    <Typography variant="subtitle1" gutterBottom>
                        {modified_tgt}
                    </Typography>
                </div >
            )
        }
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

    renderSavedTargetSentence = () => {
        return (
            <div>
                <Divider />
                <Typography variant="subtitle1" gutterBottom>
                    {this.props.sentence.tgt}
                    <br />
                </Typography>

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
                {this.state.parallel_words.map((words, index) => <Typography key={index} variant="subtitle1" gutterBottom>{words}</Typography>)}
                <br />

                <Divider />
            </div>
        )
    }

    /**
    * api calls
    */
    async makeAPICallInteractiveTranslation(caret) {
        let val = this.state.value.slice(0, caret)
        if (val && this.props.model.interactive_translation) {
            this.setState({ isCardBusy: true })
            let apiObj = new InteractiveTranslateAPI(this.props.sentence.src, val, this.props.model, true, '', this.props.sentence, this.props.recordId);
            const apiReq = fetch(apiObj.apiEndPoint(), {
                method: 'post',
                body: JSON.stringify(apiObj.getBody()),
                headers: apiObj.getHeaders().headers
            }).then(async response => {
                const rsp_data = await response.json();
                if (!response.ok) {
                    this.setState({ isCardBusy: false })
                    return Promise.reject('');
                } else {
                    this.setState({
                        suggestions: [{ name: rsp_data.output.predictions[0].tgt[0] }],
                        isCardBusy: false
                    })
                }
            }).catch((error) => {
                this.setState({
                    suggestions: [],
                    isCardBusy: false
                })
            });
        } else {
            this.setState({
                suggestions: [{ name: this.props.sentence.s0_tgt }],
                isCardBusy: false
            })
        }
    }

    handleKeyDown = (event) => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        let eventArray = this.handleTimeCalc(event.key, event.keyCode, event.target.value)
        let org = JSON.parse(localStorage.getItem('userProfile')).orgID
        this.setState({ eventArray })


        if (charCode === 'enter' || event.keyCode == '13') {
            event.preventDefault();
            return false
        }

        /**
         * left arrow and right arrow
         */
        if (event.keyCode == '37' || event.keyCode == '39') {
            if (this.state.showSuggestions) {
                this.setState({
                    showSuggestions: false,
                    highlight: false,
                    suggestions: []
                });
            }
        }
        /**
         * Ctrl+s to copy and save
         */
        if ((event.ctrlKey || event.metaKey) && charCode === 's') {
            this.processSaveButtonClicked()
            event.preventDefault();
            return false
        }

        /**
        * Ctrl+m to copy
        */
        if (org !== 'NONMT') {
            if ((event.ctrlKey || event.metaKey) && charCode === 'm' && this.props.model.status === "ACTIVE" && this.props.model.interactive_translation) {
                this.moveText()
                event.preventDefault();
                return false
            }
        }
        /**
         * user requesting for suggestions
         */
        var TABKEY = 9;
        if (org !== 'NONMT') {
            if (event.keyCode === TABKEY && this.props.model.status === "ACTIVE" && this.props.model.interactive_translation) {
                var elem = document.getElementById(this.props.sentence.s_id)
                if (!this.props.sentence.s0_tgt && !this.state.value) {
                    alert("Sorry, Machine translated text is not available...")
                } else {
                    if (!this.state.showSuggestions) {
                        this.setState({ showSuggestions: true, highlight: false })
                        this.makeAPICallInteractiveTranslation(elem.selectionStart, this.props.sentence)
                    } else {
                        if (this.state.suggestions[0]) {
                            let suggestionArray = this.state.suggestions[0].name.split(' ')
                            let textFieldArray = this.state.value.toString().replace(/\s{2,}/, ' ').trim().slice(0, elem.selectionEnd).split(' ')
                            let remainingTextFieldArray = this.state.value.toString().replace(/\s{2,}/, ' ').trim().slice(elem.selectionEnd).split(' ')
                            let remainingSuggestion = this.state.suggestions[0].name.toString().replace(/\s{2,}/, ' ').trim().slice(elem.selectionEnd).split(' ')
                            let lenTextField = [...textFieldArray].length
                            let lenSuggestion = [...suggestionArray].length
                            let nextSuggestion = remainingSuggestion.shift()
                            let nextTextField = remainingTextFieldArray.shift()
                            if (lenSuggestion !== lenTextField) {
                                if (remainingTextFieldArray.length === 0 && nextSuggestion !== undefined) {
                                    if (remainingSuggestion.length >= 1) {
                                        if (nextSuggestion !== nextTextField) {
                                            this.setState({ highlight: true, value: this.state.value + nextSuggestion + " ", userEnteredText: true }, () => {
                                                elem.focus()
                                                elem.setSelectionRange([...this.state.value].length, [...this.state.value].length)
                                            })
                                        } else {
                                            this.setState({ highlight: true, value: this.state.value + nextSuggestion + " ", userEnteredText: true }, () => {
                                                elem.focus()
                                                elem.setSelectionRange([...this.state.value].length, [...this.state.value].length)
                                            })
                                        }
                                    }
                                    else {
                                        this.setState({ highlight: true, value: this.state.value + nextSuggestion, userEnteredText: true }, () => {
                                            elem.focus()
                                            elem.setSelectionRange([...this.state.value].length + 1, [...this.state.value].length + 1)
                                        })
                                    }
                                } else if (nextSuggestion !== nextTextField) {
                                    if (nextSuggestion !== "") {
                                        this.setState({ highlight: true, showSuggestions: true, value: this.state.value.substr(0, elem.selectionEnd).trim() + " " + nextSuggestion + " " + this.state.value.substr(elem.selectionEnd), userEnteredText: true }, () => {
                                            elem.focus()
                                            elem.setSelectionRange([...textFieldArray.join(' ')].length + [...nextSuggestion].length + 1, [...textFieldArray.join(' ')].length + [...nextSuggestion].length + 1)
                                        })
                                    }
                                }
                                else {
                                    if (nextSuggestion.length !== 0) {
                                        this.setState({ highlight: true, showSuggestions: true, userEnteredText: true }, () => {
                                            elem.focus()
                                            elem.setSelectionRange(elem.selectionEnd + [...nextTextField].length + 1, elem.selectionEnd + [...nextTextField].length + 1)
                                        })
                                    } else {
                                        this.setState({ showSuggestions: true, userEnteredText: true }, () => {
                                            elem.focus()
                                            elem.setSelectionRange(elem.selectionEnd + [...nextTextField].length + 1, elem.selectionEnd + [...nextTextField].length + 1)
                                        })
                                    }
                                }
                            }
                            else {
                                if (nextSuggestion !== nextTextField && remainingSuggestion.length === 0) {
                                    this.setState({
                                        showSuggestions: true, value: this.state.value.substr(0, elem.selectionEnd) + nextSuggestion + this.state.value.substr(elem.selectionEnd).trim()
                                        , userEnteredText: true,
                                        highlight: true
                                    }, () => {
                                        elem.focus()
                                        elem.setSelectionRange([...textFieldArray.join(' ')].length + [...nextSuggestion].length + 1, [...textFieldArray.join(' ')].length + [...nextSuggestion].length + 1)
                                    })
                                } else {
                                    this.setState({ highlight: true, showSuggestions: true, userEnteredText: true }, () => {
                                        elem.focus()
                                        elem.setSelectionRange(elem.selectionEnd + [...nextTextField].length + 1, elem.selectionEnd + [...nextTextField].length + 1)
                                    })
                                }
                            }
                        }
                    }
                }
                event.preventDefault();
                return false
            }
        }
    }

    handleClick = () => {
        this.setState({ showSuggestions: false, highlight: false })
    }
    renderAutoCompleteText(option, caretStr) {
        if (!this.state.highlight) {
            var elem = document.getElementById(this.props.sentence.s_id)
            let data = this.state.value ? this.state.value.slice(0, elem.selectionStart) : ""
            let trimedText = data.trim()
            var selectedText = this.state.value.slice(0, trimedText.length) + " "
            let value = option.slice(trimedText.length, option.length)
            return (<div><span style={{ color: "blue" }}>{selectedText}</span><span>{value}</span></div>)
        } else {
            var elem = document.getElementById(this.props.sentence.s_id)
            let data = this.state.value ? this.state.value.trim().slice(0, elem.selectionEnd) : ""
            let value = option.slice([...data].length, [...option].length).trim().split(' ')
            let arrayData = value.shift().trim()
            return (<div><span style={{ color: "blue" }}>{data + " " + arrayData + " "}</span><span>{value.join(' ')}</span></div>)
        }
    }

    handleTimeCalc = (value, key, text) => {
        let eventArray = this.state.eventArray;
        let currentObj = {}
        currentObj["timeStamp"] = new Date();
        currentObj["value"] = value;
        currentObj["key"] = key;
        currentObj["timeTaken"] = eventArray.length > 0 ? currentObj["timeStamp"] - eventArray[eventArray.length - 1].timeStamp : 0;
        currentObj["previousText"] = text;
        eventArray.push(currentObj)
        return eventArray;
    }

    timeSpent = () => {
        let totalTimeSpent = 0
        this.state.eventArray.map((value, index) => {
            totalTimeSpent = totalTimeSpent + (value.timeTaken < 300000 ? value.timeTaken : this.sentenceTime())
        })
        return totalTimeSpent;
    }

    sentenceTime = () => {
        let sentenceTime = 0;
        if (this.props.sentence) {
            let srcLength = (this.props.sentence.src.split(" ").length);
            let tgtLength = (this.props.sentence.hasOwnProperty("s0_tgt") && this.props.sentence.s0_tgt.split(" ").length)
            sentenceTime = (srcLength + tgtLength) * 2000;
        }
        return sentenceTime;
    }

    handleUserInputText(event) {
        if (this.state.showSuggestions) {
            this.setState({
                showSuggestions: false,
                suggestions: []

            });
        }

        this.setState({
            value: event.target.value,
            userEnteredText: true,
        });
    }

    renderUserInputArea = () => {
        let orgID = JSON.parse(localStorage.getItem('userProfile')).orgID
        return (
            <form >
                <div>
                    <Autocomplete
                        filterOptions={filterOptions}
                        id={this.props.sentence.s_id}
                        getOptionLabel={option => option.name ? option.name : ""}
                        getOptionSelected={(option, value) => option.name === value.name}
                        renderOption={(option, index) => {
                            return this.renderAutoCompleteText(option.name, this.state.value)
                        }}
                        options={this.state.suggestions}
                        disableClearable
                        inputValue={this.state.value}
                        fullWidth
                        open={this.state.showSuggestions}
                        loading={true}
                        freeSolo={true}
                        loadingText={this.state.isCardBusy ? 'Loading ...' : 'No suggestions found'}
                        onChange={(event, newValue) => {
                            let option = newValue.name ? newValue.name : newValue
                            var elem = document.getElementById(this.props.sentence.s_id)

                            let value = this.state.value ? this.state.value.slice(0, elem.selectionStart) : ""
                            let trimedText = value.trim()

                            var selectedText = option.slice(0, trimedText.length)
                            let caretValue = option.slice(trimedText.length, option.length)
                            this.setState({
                                value: (selectedText ? selectedText.trim() : selectedText) + " " + (caretValue ? caretValue.trim() + " " : caretValue),
                                showSuggestions: false,
                                userEnteredText: true,

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
                                helperText={this.props.model.status === "ACTIVE" && this.props.model.interactive_translation && orgID !== 'NONMT' ? "Ctrl+m to move text, TAB key to move suggested words, Ctrl+s to save" : "Ctrl+s to save"}
                                type="text"
                                name={this.props.sentence.s_id}
                                value={this.state.value}
                                onChange={this.handleUserInputText}
                                fullWidth
                                multiline
                                disabled={this.state.isCardBusy}
                                variant="outlined"
                                onKeyDown={this.handleKeyDown}
                                onClick={this.handleClick}
                                inputRef={this.textInput}
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
    handleSpentTime = () => {
        let sec = this.props.sentence.time_spent_ms / 1000;
        var date = new Date(0);

        date.setSeconds(sec); // specify value for SECONDS here
        let spentTime = date.toISOString().substr(11, 8);
        return <span style={{ width: "70%", margin: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "#233466" }}><Typography>Spent time:&nbsp;{spentTime}</Typography></span>

    }


    retranslateSentence = () => {
        if (this.props.onAction) {
            let eventArray = this.handleTimeCalc("Retranslate", "", (this.state.value.length < 1 || this.state.value === '') ? this.props.sentence.s0_tgt : this.state.value)
            this.setState({ eventArray })
            this.setState({ value: '' })
            this.props.onAction(SENTENCE_ACTION.RETRANSLATE_SENTENCE, this.props.pageNumber, [this.props.sentence])
        }
    }

    renderNormaModeButtons = () => {
        let orgID = JSON.parse(localStorage.getItem('userProfile')).orgID
        let role = localStorage.getItem("roles")
        return (
            <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
                <span style={{ textAlign: 'left', width: "30%" }}>
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="outlined" color="primary" style={{ marginRight: '10px', border: '1px solid #1C9AB7', color: "#1C9AB7" }} onClick={this.processSaveButtonClicked} >
                                SAVE
                            </Button>
                        </Grid>
                        {orgID !== 'NONMT' &&
                            <>{
                                role !== 'ANNOTATOR' &&
                                < Grid item xs={6}>
                                    <Button variant="outlined" color="primary" style={{ marginRight: '10px', border: '1px solid #1C9AB7', color: "#1C9AB7" }}
                                        onClick={this.retranslateSentence}
                                    >
                                        RETRANSLATE
                            </Button>
                                </Grid>

                            }</>
                        }
                    </Grid>
                </span>
                { this.props.sentence && this.props.sentence.hasOwnProperty("bleu_score") && <span style={{ width: "70%", margin: "auto", display: "flex", flexDirection: "row", justifyContent: "flex-end", color: "#233466" }}><Typography>Bleu Score:&nbsp;{parseFloat(this.props.sentence.bleu_score).toFixed(2)}</Typography></span>}
                { this.props.sentence && this.props.sentence.hasOwnProperty("time_spent_ms") && this.handleSpentTime()}
            </div >
        )
    }


    async makeAPICallDictionary() {
        let eventArray = this.handleTimeCalc(this.state.selectedSentence, "dictionary", this.state.value)
        this.setState({ showProgressStatus: true, message: "Fetching meanings", eventArray })

        let apiObj = new DictionaryAPI(this.state.selectedSentence, this.props.model.source_language_code, this.props.model.target_language_code)
        const apiReq = await fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then((response) => {
            this.setState({ showProgressStatus: false, message: null })

            if (!response.ok) {
                return Promise.reject('');
            }
            response.text().then((data) => {
                let val = JSON.parse(data)
                return val.data;
            }).then((result) => {
                let parallel_words = []
                result && result.parallel_words.map((words) => {
                    if (this.props.model.target_language_code === words.locale)
                        parallel_words.push(words.name)
                })
                this.setState({
                    parallel_words: parallel_words,
                    isOpenDictionary: true
                })
            })
        }).catch((error) => {
            this.setState({ snackBarMessage: "Failed to fetch meaning...!", showStatus: true, snackBarVariant: "error" })
        });
    }

    renderProgressInformation = () => {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={this.state.showProgressStatus}
                message={this.state.message}

            >
                <Alert elevation={6} variant="filled" severity="info">{this.state.message}</Alert>
            </Snackbar>
        )
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
        let eventArray = this.handleTimeCalc(this.state.selectedSentence, "copy", this.state.value)
        this.setState({ eventArray })
        this.handleClose()
    }

    handleAddToGlossary = () => {
        let eventArray = this.handleTimeCalc("", "glossary", this.state.value)
        this.setState({ openModal: true, eventArray })
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

    renderMenuItems = () => {
        return (
            <MenuItems
                splitValue={this.state.selectedSentence}
                positionX={this.state.positionX}
                positionY={this.state.positionY}
                handleClose={this.handleClose.bind(this)}
                hideSplit={this.state.hideSplit}
                isopenMenuItems={this.state.isopenMenuItems}
                handleOperation={this.handleOperation.bind(this)}
            />)
    }


    handelDictionaryClose = () => {
        this.setState({
            isOpenDictionary: false, dictionaryX: null, dictionaryY: null
        })
    }

    renderDictionary = () => {
        return (
            <Dictionary
                isOpenDictionaryOnly={this.state.isOpenDictionaryOnly}
                dictionaryY={this.state.dictionaryY}
                dictionaryX={this.state.dictionaryX}
                handelDictionaryClose={this.handelDictionaryClose.bind(this)}
                selectedSentence={this.state.selectedSentence}
                parallel_words={this.state.parallel_words}
                handleMeaningCopy={this.handleMeaningCopy.bind(this)}
            />
        )
    }

    handleMeaningCopy = (text) => {
        copy(text);
        this.setState({ dictionaryX: null, dictionaryY: null, isOpenDictionary: false })
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
        if (this.props.document_editor_mode.mode === 'EDITOR_MODE_MERGE') {
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

    handleChange = (event) => {
        let eventArray = this.handleTimeCalc(Number(event.target.value), "Rating", this.state.value)
        this.setState({
            score: Number(event.target.value), eventArray
        })
    }

    renderRating = () => {
        let styles = {
            dividerStyle: {
                border: 0,
                height: 0,
                borderTop: "1px solid rgba(0, 0, 0, 0.1)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
            },
            buttonStyle: {
                color: 'rgb(28, 154, 183)'
            },
            label: {
                fontSize: "5px"
            }
        }
        return (
            <div style={{ padding: "2% 0%" }}>
                <hr style={styles.dividerStyle} />
                <FormControl component="fieldset">
                    <FormLabel component="legend" color="primary" style={{ color: '#000000' }}>Rate machine translation</FormLabel>
                    <RadioGroup color="primary" name="gender1" value={this.state.score} onChange={this.handleChange} style={{ display: "flex", flexDirection: "row" }}>
                        <FormControlLabel value={1} control={<Radio style={styles.buttonStyle} />} label="1" labelPlacement="bottom" style={styles.label} />
                        <FormControlLabel value={2} control={<Radio style={styles.buttonStyle} />} label="2" labelPlacement="bottom" />
                        <FormControlLabel value={3} control={<Radio style={styles.buttonStyle} />} label="3" labelPlacement="bottom" />
                        <FormControlLabel value={4} control={<Radio style={styles.buttonStyle} />} label="4" labelPlacement="bottom" />
                        <FormControlLabel value={5} control={<Radio style={styles.buttonStyle} />} label="5" labelPlacement="bottom" />


                    </RadioGroup>
                </FormControl>
                <hr style={styles.dividerStyle} />

            </div>
        )
    }

    renderSentenceCard = () => {
        let userRole = localStorage.getItem("roles")
        let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID
        return (
            <div key={12} style={{ padding: "1%" }}>
                <MuiThemeProvider theme={theme}>
                    <Card style={this.cardBlockCompare() || (this.cardCompare()) ? styles.card_open : this.isSentenceSaved() ? styles.card_saved : styles.card_inactive}>
                        <CardContent style={{ display: "flex", flexDirection: "row", padding: "10px" }}>
                            <div style={{ width: "90%" }}>
                                {this.renderSourceSentence()}
                            </div>
                            {this.renderCardIcon()}
                            {this.renderCardSelectedForMerge()}

                        </CardContent>

                        {(this.isSentenceSaved() && !this.cardCompare()) && <CardContent style={{ display: "flex", flexDirection: "row" }}>
                            <div style={{ width: "90%" }}>
                                {this.renderSavedTargetSentence()}
                            </div>


                        </CardContent>}

                        <Collapse in={this.cardCompare()} timeout="auto" unmountOnExit>
                            <CardContent style={{ padding: "10px" }}>
                                {this.renderMTTargetSentence()}
                                <br />
                                {userRole === "ANNOTATOR" && orgID !== "NONMT" && this.renderRating()}
                                {this.renderUserInputArea()}
                            </CardContent>
                            <CardActions style={{ padding: "10px" }}>
                                {this.renderNormaModeButtons()}
                            </CardActions>
                        </Collapse>
                    </Card>
                </MuiThemeProvider>
            </div>
        )
    }


    handleCardExpandClick = () => {
        if (this.cardCompare()) {
            this.setState({ cardInFocus: false, eventArray: [] })
            this.props.clearHighlighBlock()
            TELEMETRY.endSentenceTranslation(this.props.model.source_language_name, this.props.model.target_language_name, this.props.jobId, this.props.sentence.s_id)
        } else {
            if (this.props.block_highlight && this.props.block_highlight.current_sid) {
                TELEMETRY.endSentenceTranslation(this.props.model.source_language_name, this.props.model.target_language_name, this.props.jobId, this.props.block_highlight.current_sid)
            }
            this.setState({ cardInFocus: true })
            this.props.highlightBlock(this.props.sentence, this.props.pageNumber)
            this.handleTimeCalc("cardOpen", "", this.state.value)
            /**
             * For highlighting textarea on card expand
             */
            this.textInput && this.textInput.current && this.textInput.current.focus();
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
    renderGlossaryModal = () => {
        return (
            <Modal
                open={this.state.openModal}
                onClose={this.handleGlossaryModalClose}
            >
                <AddToGlossaryModal
                    handleClose={this.handleGlossaryModalClose}
                    selectedWords={this.state.selectedSentence}
                    makeCreateGlossaryAPICall={(tgt) => this.makeCreateGlossaryAPICall(tgt)}
                    loading={this.state.loading}
                />
            </Modal>
        )
    }

    makeCreateGlossaryAPICall = (tgt) => {
        let locale = `${this.props.model.source_language_code}|${this.props.model.target_language_code}`
        this.setState({ loading: true })
        let userProfile = JSON.parse(localStorage.getItem('userProfile'))
        let apiObj = new CreateGlossary(userProfile.userID, this.state.selectedSentence, tgt, locale, 'JUDICIARY')
        fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        })
            .then(async res => {
                if (res.ok) {
                    let apiObj = new ViewGlossary(userProfile.userID);
                    let { APITransport } = this.props
                    APITransport(apiObj)
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
                {this.state.isopenMenuItems && this.state.cardInFocus && this.renderMenuItems()}
                {this.state.isOpenDictionary && this.renderDictionary()}
                {this.state.showProgressStatus && this.renderProgressInformation()}
                {this.state.showStatus && this.snackBarMessage()}
                {this.renderGlossaryModal()}
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
        clearHighlighBlock,
        APITransport
    },
    dispatch
);

export default connect(mapStateToProps, mapDispatchToProps)(SentenceCard);
