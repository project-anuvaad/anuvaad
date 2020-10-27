import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/BlockStyles";
import Paper from "@material-ui/core/Paper";
import Merge from "@material-ui/icons/CallMerge";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";
import Save from "@material-ui/icons/CheckCircleOutline";
import Split from "@material-ui/icons/CallSplit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import ValidationIcon from "@material-ui/icons/SettingsEthernet";
import AutoComplete from "../../../components/web/common/AutoComplete1";
import IntractiveApi from "../../../../flux/actions/apis/intractive_translate";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import CancelIcon from '@material-ui/icons/Cancel';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withRouter } from "react-router-dom";

//var getCaretCoordinates = require("textarea-caret");

let arr = [];
var tex = ""
class Block extends Component {
  constructor() {
    super();
    this.state = {
      showSuggestions: false,
      enteredData: false,
      highlightDivider: false,
      caret: "",
      caretLength: 0,
      caretData: ""
    };
  }

  componentDidMount() {
    this.setState({
      sentence: this.props.sentence,
      editedText: this.props.sentence && this.props.sentence.hasOwnProperty("tgt") && this.props.sentence.tgt
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      //let sentence = this.state.sentence;
      // sentence.tagged_tgt = this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_tgt,
      this.setState({
        autoCompleteText:
          this.props.intractiveTrans &&
          this.props.intractiveTrans.tgt,
        autoCompleteTextTaggetTgt:
          this.props.intractiveTrans &&
          this.props.intractiveTrans.tagged_tgt,
      });
    }

    if (prevProps.buttonStatus !== this.props.buttonStatus) {
      if (this.props.buttonStatus === "mergeSaved" && arr.length > 0) {
        let operation = "Merge sentence";
        this.props.handleDialogMessage("", arr, "", operation);
        arr = [];
      } else if (this.props.buttonStatus === "") {
        arr = [];
        this.setState({ selectedValueArray: [] });
      }
    }

    if (prevProps.sentence !== this.props.sentence) {
      this.setState({
        editedText: this.props.sentence && this.props.sentence.hasOwnProperty("tgt") && this.props.sentence.tgt
      })
    }

    if (prevProps.saveCancelled !== this.props.saveCancelled && this.props.saveCancelled) {
      this.setState({ editedText: this.props.sentence && this.props.sentence.hasOwnProperty("tgt") && this.props.sentence.tgt })
    }
  }


  handleChangeEvent = (event) => {
    this.setState({ editedText: event.target.value, enteredData: true })

    // this.props.updateSentence(event.target.value)
    if (this.props.buttonStatus === "typing") {
      tex = event.target.value
    }
    if (this.props.buttonStatus === "selected") {

      this.props.handleClick("typing")
    }


  };

  fetchSuggestions(srcText, targetTxt, tokenObject) {
    if (targetTxt) {
      let targetVal = targetTxt;

      this.setState({
        showSuggestions: true,
        autoCompleteText: null,
        caret: targetTxt,
        caretData: targetTxt
      });
      const apiObj = new IntractiveApi(
        srcText,
        targetVal,
        { model_id: this.props.modelId },
        true,
        true,
        this.props.sentence.s_id
      );
      this.props.APITransport(apiObj);
    } else {
      this.setState({ autoCompleteText: null, caretData: "" })
    }

  }

  handleSuggestionClick(suggestion, value, src, tokenObject) {
    let editedSentence = this.state.editedText + suggestion
    // this.props.updateSentence(this.state.caret + suggestion)
    let data = this.state.caret

    let editedData = this.state.caret + suggestion + this.state.editedText.slice(this.state.caret.length)
    tex = editedData;
    this.setState({
      editedText: editedData,
      showSuggestions: false,
      caret: this.state.caret + suggestion,
      caretData: this.state.caret + suggestion
    });

    this.setState({ autoCompleteText: null, tokenObject, caretLength: (this.state.caret + suggestion).length });
    let targetVal = this.state.caret + suggestion;
    setTimeout(() => {
      this.setState({ showSuggestions: true });
    }, 50);

    const apiObj = new IntractiveApi(
      src,
      targetVal,
      { model_id: this.props.modelId },
      true,
      true,
      this.props.sentence.s_id
    );
    this.props.APITransport(apiObj);
  }

  handleEditorClick(id) {
    this.props.handleClick("typing")
    this.setState({ highlightDivider: true, highlightId: id });
  }

  handleShowTarget(id) {
    if (this.props.selectedBlock && this.props.selectedBlock.s_id === id) {

      this.setState({
        editedText: this.props.sentence && this.props.sentence.hasOwnProperty("s0_tgt") && this.props.sentence.s0_tgt,
        enteredData: true,
        // dontShowDialog: true
      });




      this.props.handleClick("copy")
      this.props.showTargetData(id)
      this.props.handleEditorClick(id)
    } else {
      this.props.handleSentenceClick(this.props.sentence)
    }

  }

  getSelectionText(event, text) {

    const sentenceStartId = text.s_id;
    const split_index = window.getSelection().focusOffset;
    const selectedText = window.getSelection().toString();

    let targetDict = false;
    let opeartion = "Split sentence";
    // eslint-disable-next-line
    let actual_text = text.src;
    actual_text = actual_text.replace(/\s{2,}/g, " ");
    actual_text = actual_text.trim();

    if (this.props.selectedBlock && this.props.selectedBlock.src.includes(selectedText)) {
      this.props.popUp(this.props.block_id,
        sentenceStartId,
        split_index,
        event,
        opeartion, selectedText)
    }

  }

  handleBlurCard = (event, id) => {
    if (this.state.editedText !== this.props.selectedBlock.tgt && this.state.editedText && this.state.enteredData) {
      let operation = "Save";
      let isEdited = false;

      if ((!event.relatedTarget || event.relatedTarget && event.relatedTarget.type !== "button") && !this.state.dontShowDialog) {
        if (this.props.selectedBlock && !this.props.selectedBlock.hasOwnProperty("save") && !this.props.selectedBlock.save) {
          isEdited = true
        }

        this.props.getUpdatedBlock(this.props.selectedBlock, operation, this.state.editedText, isEdited)

        // this.props.handleDialogMessage(this.props.selectedBlock, "", "", operation, message, this.state.editedText)
      }


      // this.handleSave(this.props.selectedBlock.s_id) 
    }

  }

  handleChange = (name) => (event) => {
    if (arr.includes(name)) {
      arr = arr.filter((item) => item !== name);
    } else {
      arr.push(name);
    }
    this.setState({ selectedValueArray: arr });
  };

  handleSave(id) {
    if (this.props.selectedBlock && this.props.selectedBlock.s_id === id) {
      let block = this.props.sen
      let isEdited = false
      this.setState({ enteredData: false, dontShowDialog: true })

      block && block.tokenized_sentences && Array.isArray(block.tokenized_sentences) && block.tokenized_sentences.length > 0 && block.tokenized_sentences.map((tokenObj, i) => {
        if (this.state.sentence && this.state.sentence.s_id === tokenObj.s_id) {
          let sentence = this.state.sentence

          if (sentence && !sentence.hasOwnProperty("save") && !sentence.save) {
            isEdited = true
          }

          sentence.save = true
          tokenObj = this.state.sentence

          // this.setState({sentence})
        }
        return null;
      })
      this.props.handleClick("")
      this.props.saveUpdatedSentence(block, this.state.sentence, this.props.blockIdentifier, this.state.editedText, isEdited)
    } else {
      this.props.handleSentenceClick(this.props.sentence)
    }
  }

  handleClick(id) {
    this.setState({ auto: true })
    this.props.handleEditorClick(id)
  }

  handleSplit() {
    this.props.handleSentenceClick(this.props.sentence)
    this.props.handleClick("split");
  }

  showSuggestions(value) {
    this.setState({ dontShowDialog: value, caretData: "" })
  }

  handleDictionary = (event) => {
    let selectedWord = window.getSelection().toString()
    let word_locale = this.props.match.params.locale
    let tgt_locale = this.props.match.params.tgt_locale

    if (this.props.selectedBlock && this.props.selectedBlock.src.includes(selectedWord)) {
      this.props.handleDictionary(selectedWord, word_locale, tgt_locale)
    }
    else if (this.props.selectedBlock && this.props.selectedBlock.tgt.includes(selectedWord)) {
      this.props.handleDictionary(selectedWord, tgt_locale, word_locale)
    }


  }

  handleCardClick(sentence, editedText) {

    if (this.props.buttonStatus === "typing" && tex) {
      this.props.saveUpdatedSentence("", this.props.selectedBlock, "", tex, true)
      // this.handleBlurSave(this.props.selectedBlock, tex)
      // this.handleSave(sentence.s_id);
    }
    else if (this.props.buttonStatus === "copy") {
      this.props.saveUpdatedSentence("", this.props.selectedBlock, "", this.props.selectedBlock.s0_tgt, true)
      // this.handleBlurSave(this.props.selectedBlock, this.props.selectedBlock.s0_tgt)
    }
    let saveData = false
    let block = this.props.sen

    this.props.handleSentenceClick(this.props.sentence, saveData, block, this.props.blockIdentifier)
  }

  render() {
    const { classes, sentence, selectedBlock } = this.props;
    return (
      <Paper
        variant="outlined"
        id={this.props.block_id + "##" + sentence.s_id}
        style={{
          margin: "10px",
          minHeight: "120px",
          padding: "1%",
          background: sentence.hasOwnProperty("save") && sentence.save && "#ecf5f2",
          border:
            (selectedBlock &&
              sentence &&
              sentence.s_id === selectedBlock.s_id) ||
              arr.includes(sentence.s_id) || (sentence && this.props.SentenceOperationId === sentence.s_id && this.props.buttonStatus === "apiCalled")
              ? "2px solid #1C9AB7"
              : "2px solid #D6D6D6",
        }}
      >
        <Grid container spacing={2} style={{ padding: "7px 7px 0px 7px" }}>
          <Grid item xs={12} sm={12} lg={12} xl={12} style={{ paddingBottom: "0px" }}>
            <div style={{ display: "flex", flexDirection: "row" }}
            >
              <div
                style={{ width: "100%", paddingLeft: "10px" }}
                onMouseDown={() => selectedBlock &&
                  sentence &&
                  sentence.s_id !== selectedBlock.s_id && this.props.buttonStatus !== "split" && this.handleCardClick(this.props.sentence)}
                onDoubleClick={(event) => event.preventDefault()}

                onMouseUp={(event) => { this.getSelectionText(event, sentence) }}
                onKeyUp={(event) => { this.getSelectionText(event, sentence) }}


              >

                <div
                  style={{ minHeight: "45px", padding: "5px", fontSize: "16px" }}
                // onClick={() => this.props.handleSentenceClick(sentence)}
                >
                  {sentence.src}
                </div>
                <hr style={{ border: (selectedBlock && sentence && sentence.hasOwnProperty("s_id") && sentence.s_id === selectedBlock.s_id && (this.props.buttonStatus === "copy" || this.props.buttonStatus === "typing")) ? "1px dashed #1C9AB7" : "1px dashed #00000014" }} />
                {((selectedBlock && sentence && sentence.hasOwnProperty("s_id") && selectedBlock.hasOwnProperty("s_id") && sentence.s_id === selectedBlock.s_id) || (this.state.sentence && this.state.sentence.hasOwnProperty("save") && this.state.sentence.save)) ?
                  <AutoComplete
                    aId={sentence.s_id}
                    refId={sentence.s_id}
                    block_identifier_with_page={sentence.block_identifier + "_" + this.props.pageNo}
                    style={{
                      width: "100%",
                      resize: "none",
                      zIndex: 1111,
                      borderRadius: "4px",
                      //border: '0px dotted white',
                      minHeight: "45px",
                      fontSize: "16px",
                      border: 'none',
                      outline: "none",
                      background: sentence.hasOwnProperty("save") && sentence.save && "#ecf5f2",
                      fontFamily: "Source Sans Pro,Regular,Arial,sans-serif"
                    }}
                    tokenIndex={this.props.tokenIndex}
                    // value={(this.props.selectedTargetId === this.state.sentence.s_id || this.state.enteredData) ? this.state.sentence.tgt : ""}
                    value={(this.state.sentence && this.state.sentence.hasOwnProperty("s_id") && (this.props.selectedTargetId === this.state.sentence.s_id) || this.state.enteredData || (this.state.sentence && this.state.sentence.hasOwnProperty("save") && this.state.sentence.save)) ? this.state.editedText : ""}
                    sentence={this.state.sentence}
                    sourceText={sentence.src}
                    page_no={this.props.page_no}
                    handleSuggestion={this.props.handleSuggestion}
                    heightToBeIncreased={sentence.font_size}
                    // handleBlur={this.props.handleBlur}
                    showSuggestions={this.props.showSuggestions}
                    handleSuggestionClose={this.props.handleSuggestionClose}
                    tokenObject={sentence}
                    showTargetLang={this.props.selectedTargetId === sentence.hasOwnProperty("s_id") && sentence.s_id && true}
                    modelId={this.props.modelId}
                    autoCompleteText={this.state.autoCompleteText}
                    autoCompleteTextTaggetTgt={this.state.autoCompleteTextTaggetTgt}
                    handleChangeEvent={this.handleChangeEvent.bind(this)}
                    fetchSuggestions={this.fetchSuggestions.bind(this)}
                    handleSuggestionClick={this.handleSuggestionClick.bind(this)}
                    handleEditorClick={this.handleEditorClick.bind(this)}
                    autoFocus={ this.state.sentence.hasOwnProperty("save")}
                    showSuggestions={this.showSuggestions.bind(this)}
                    caretLength={this.state.caretLength}
                    caretData={this.state.caretData}
                  />
                  : <div style={{ minHeight: "50px" }}></div>
                }
              </div>
              {this.props.buttonStatus === "merge" ? (
                <Checkbox
                  size="small"
                  color="primary"
                  onChange={this.handleChange(sentence.s_id)}
                />
              ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {this.props.buttonStatus !== "split" && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          paddingLeft: "4%",
                        }}
                      >
                        <Tooltip title="Copy machine translated sentence">
                          <IconButton
                            aria-label="validation mode"
                            onClick={() => {
                              this.handleShowTarget(sentence.s_id);
                            }}
                            style={selectedBlock &&
                              sentence &&
                              sentence.s_id === selectedBlock.s_id && (this.props.buttonStatus === "typing" || this.props.buttonStatus === "copy") ? { color: "#1C9AB7" } : {}}
                          >
                            <ArrowBackIcon
                              fontSize="default"
                              className={classes.Icons}
                            />
                          </IconButton>
                        </Tooltip>
                        < Tooltip title="Save">
                          <IconButton aria-label="save">
                            <Save style={selectedBlock &&
                              sentence &&
                              sentence.s_id === selectedBlock.s_id && (this.props.buttonStatus === "typing" || this.props.buttonStatus === "copy") ? { color: "#1C9AB7" } : {}} onClick={(event) => {
                                this.handleSave(sentence.s_id);
                              }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingLeft: "4%",
                      }}
                    >
                      {this.props.buttonStatus !== "split" && (
                        <Tooltip title="Merge Sentence">
                          <IconButton aria-label="merge">
                            <Merge
                              fontSize="default"
                              onClick={(event) => {
                                this.props.handleClick("merge");
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </Grid>
        </Grid>


      </Paper >
    );
  }
}
const mapStateToProps = (state) => ({
  apistatus: state.apistatus,
  intractiveTrans: state.intractiveTrans,
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );
export default withRouter(
  withStyles(Styles)(connect(mapStateToProps, mapDispatchToProps)(Block))
);