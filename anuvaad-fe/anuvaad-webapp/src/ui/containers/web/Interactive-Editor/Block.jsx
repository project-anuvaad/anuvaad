import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/BlockStyles";
import Paper from "@material-ui/core/Paper";
import ChevronLeftIcon from "@material-ui/icons/DoubleArrow";
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

var getCaretCoordinates = require("textarea-caret");

let arr = [];
class Block extends Component {
  constructor() {
    super();
    this.state = {
      showSuggestions: false,
      enteredData: false,
      highlightDivider: false,
    };
  }

  componentDidMount() {
    this.setState({
      sentence: this.props.sentence,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      let sentence = this.state.sentence;
      // sentence.tagged_tgt = this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_tgt,
      this.setState({
        autoCompleteText:
          this.props.intractiveTrans &&
          this.props.intractiveTrans.length > 0 &&
          this.props.intractiveTrans[0].tgt,
        autoCompleteTextTaggetTgt:
          this.props.intractiveTrans &&
          this.props.intractiveTrans.length > 0 &&
          this.props.intractiveTrans[0].tagged_tgt,
      });
    }

    if (prevProps.buttonStatus !== this.props.buttonStatus) {
      if (this.props.buttonStatus == "mergeSaved" && arr.length > 0) {
        let message= "Do you want to merge the sentences";
        let operation = "Merge sentence";
        this.props.handleDialogMessage("",arr,"", operation, message);
        arr = [];
      } else if (this.props.buttonStatus == "") {
        arr = [];
        this.setState({ selectedValueArray: [] });
      }
    }
  }

  handleSplitSentence(event, text) {
    const sentenceStartId = text.s_id;
    const split_index = window.getSelection().focusOffset;
    let opeartion = "Split sentence";
    let actual_text = text.src;
    actual_text = actual_text.replace(/\s{2,}/g, " ");
    actual_text = actual_text.trim();
    this.props.handleDialogMessage(
      this.props.block_id,
      sentenceStartId,
      split_index,
      // actual_text.substring(0, split_index),
      opeartion,
      "Do you want to split the sentence"
    );
  }

  handleChangeEvent = (event) => {
    let sentence = this.state.sentence;

    sentence.tagged_tgt = event.target.value;
    sentence.tgt = event.target.value;
    this.setState({
      sentence: sentence,
      enteredData: true,
    });
  };

  fetchSuggestions(srcText, targetTxt, tokenObject) {
    let targetVal = targetTxt;

    this.setState({ showSuggestions: true, autoCompleteText: null });
    const apiObj = new IntractiveApi(
      srcText,
      targetVal,
      { model_id: this.props.modelId },
      true,
      true
    );
    this.props.APITransport(apiObj);
  }

  handleSuggestionClick(suggestion, value, src, tokenObject) {
    let sentence = this.state.sentence;
    sentence.tagged_tgt = value.trim() + suggestion;
    sentence.tgt = value.trim() + suggestion;
    // console.log(sentence)
    this.setState({ showSuggestions: false });
    // this.props.handleSuggestion(suggestion, value)

    this.setState({ autoCompleteText: null, tokenObject, sentence: sentence });

    let targetVal = value.trim() + suggestion;
    setTimeout(() => {
      this.setState({ showSuggestions: true });
    }, 50);

    const apiObj = new IntractiveApi(
      src,
      targetVal,
      { model_id: this.props.modelId },
      true,
      true
    );
    this.props.APITransport(apiObj);
  }

  handleEditorClick(id) {
    this.setState({ highlightDivider: true, highlightId: id });
  }

  handleShowTarget(id) {
    this.props.showTargetData(id);
    this.props.handleEditorClick(id);
  }

  handleChange = (name) => (event) => {
    if (arr.includes(name)) {
      arr = arr.filter((item) => item !== name);
    } else {
      arr.push(name);
    }
    this.setState({ selectedValueArray: arr });
  };

  handleSave() {
    let block = this.props.block
    this.setState({ enteredData: false })
    block && block.tokenized_sentences && Array.isArray(block.tokenized_sentences) && block.tokenized_sentences.length > 0 && block.tokenized_sentences.map((tokenObj, i) => {
      if (this.state.sentence && this.state.sentence.s_id === tokenObj.s_id) {
        tokenObj = this.state.sentence
      }
    })

    this.props.handleSave(block)
  }

  handleClick(id) {
    this.setState({auto: true})
    this.props.handleEditorClick(id)
  }

  render() {
    const { classes, sentence, selectedBlock, highlightId, selectedTargetId } = this.props;
   
    return (
      <Paper
        variant="outlined"
        id = {this.props.block_id+"##"+sentence.s_id}
        style={{
          margin: "10px",
          minHeight: "90px",
          padding: "1%",
          border:
            (selectedBlock &&
              sentence &&
              sentence.s_id === selectedBlock.s_id) ||
            arr.includes(sentence.s_id)
              ? "2px solid #1C9AB7"
              : "2px solid #D6D6D6",
        }}
        onClick={() => this.props.handleSentenceClick(this.props.sentence)}
      >
        <Grid container spacing={2}>
          <Grid item xs={8} sm={9} lg={11} xl={11}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Tooltip title="Go to validation mode">
                <ValidationIcon
                  style={{ color: "#1C9AB7", cursor: "pointer" }}
                />
              </Tooltip>

              <div style={{ width: "100%", paddingLeft: "10px" }}>
                <div
                  style={{ minHeight: "45px", padding: "5px" }}
                  onClick={() => this.props.handleSentenceClick(sentence)}
                >
                  {sentence.src}
                </div>
                <hr style={{ border: (highlightId === sentence.s_id && selectedBlock && sentence && sentence.s_id === selectedBlock.s_id) ? "1px dashed #1C9AB7" : "1px dashed #00000014" }} />
                {((selectedBlock && sentence && sentence.s_id === selectedBlock.s_id) &&  (selectedTargetId === sentence.s_id || this.state.auto))?
                  <AutoComplete
                    aId={sentence.s_id}
                    refId={sentence.s_id}
                    block_identifier_with_page={sentence.block_identifier + "_" + this.props.pageNo}
                    style={{
                      width: "100%",
                      resize: "none",
                      zIndex: 1111,
                      borderRadius: "4px",
                      border: '0px dotted white',
                      minHeight: "45px",
                      fontSize: "18px",
                      border: 'none',
                      outline: "none"

                    }}
                    tokenIndex={this.props.tokenIndex}
                    value={(this.props.selectedTargetId === this.state.sentence.s_id || this.state.enteredData) ? this.state.sentence.tgt : ""}
                    // value={this.state.sentence.tgt}
                    sentence={this.state.sentence}

                    sourceText={sentence.src}
                    page_no={this.props.page_no}
                    handleSuggestion={this.props.handleSuggestion}
                    heightToBeIncreased={sentence.font_size}
                    handleBlur={this.props.handleBlur}

                    showSuggestions={this.props.showSuggestions}
                    handleSuggestionClose={this.props.handleSuggestionClose}
                    tokenObject={sentence}
                    showTargetLang={this.props.selectedTargetId === sentence.s_id && true}
                    modelId={this.props.modelId}

                    autoCompleteText={this.state.autoCompleteText}
                    autoCompleteTextTaggetTgt={this.state.autoCompleteTextTaggetTgt}
                    handleChangeEvent={this.handleChangeEvent.bind(this)}
                    fetchSuggestions={this.fetchSuggestions.bind(this)}
                    handleSuggestionClick={this.handleSuggestionClick.bind(this)}
                    handleEditorClick={this.props.handleEditorClick}
                  /> 
                  : <textarea
                  aId={sentence.s_id}
                  refId={sentence.s_id}
                    // autoFocus={true}
                    placeholder="Type your translation here"
                    style={{
                      width: "100%",
                      resize: "none",
                      zIndex: 1111,
                      borderRadius: "4px",
                      border: '0px dotted white',
                      minHeight: "45px",
                      fontSize: "18px",
                      border: 'none',
                      outline: "none"

                    }}
                    value={this.props.value}
                    onChange={this.props.handleChangeEvent}
                    onKeyDown={this.handleEnter}
                    onClick={() => this.handleClick (sentence.s_id)}
                  />
                  }
              </div>

            </div>
          </Grid>

          <Grid item xs={4} sm={3} lg={1} xl={1}>
            {this.props.buttonStatus === "merge" ? (
              <Checkbox
                size="small"
                color="primary"
                onChange={this.handleChange(sentence.s_id)}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                {this.props.buttonStatus !== "split" && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingLeft: "4%",
                    }}
                  >
                    <Tooltip title="Get machine translated sentence">
                      <IconButton
                        aria-label="validation mode"
                        onClick={() => {
                          this.handleShowTarget(sentence.s_id);
                        }}
                      >
                        <ArrowBackIcon
                          fontSize="medium"
                          className={classes.Icons}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save">
                      <IconButton aria-label="save">
                        <Save fontSize="medium" onClick={(event) => {
                          this.props.handleClick("save");
                        }}/>
                      </IconButton>
                    </Tooltip>

                    {/* </div>} */}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    paddingLeft: "4%",
                  }}
                >
                  {/* <Tooltip title="Spit sentence">
                    <IconButton aria-label="Split">
                      <Split fontSize={this.props.buttonStatus !== "split" ? "medium" : "large"} onClick={event => {
                        this.props.handleClick("split");
                      }} />
                    </IconButton>
                  </Tooltip>
                  {this.props.buttonStatus !== "split" &&
                    <Tooltip title="Merge Sentence">
                      <IconButton aria-label="merge">
                        <Merge fontSize="medium" onClick={event => {
                          this.props.handleClick("merge");
                        }} />
                      </IconButton>
                    </Tooltip>}
                </div>
              </div>
            } */}
                  {this.props.buttonStatus === "split" && selectedBlock &&
              sentence &&
              sentence.s_id === selectedBlock.s_id? (
                <div>
                    <Tooltip title={window.getSelection().toString() ? "Split":"Please select sentence to split"}>
                      <IconButton aria-label="Split">
                        <Split
                          fontSize={"large"}
                          style={{ color: "#1C9AB7" }}
                          onClick={(event) => {
                            window.getSelection().toString() ? this.handleSplitSentence(event, sentence, this.props.block_id): alert("Please select text to split");
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={"Cancel"}>
                    <IconButton aria-label="cancel">
                      <CancelIcon
                        fontSize={"large"}
                        style={{ color: "#1C9AB7" }}
                        onClick={(event) => {
                          this.props.handleClick("");
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  </div>
                  ) : this.props.buttonStatus !== "split" && (
                    <Tooltip title={"Spit sentence"}>
                      <IconButton aria-label="Split">
                        <Split
                          fontSize={"medium"}
                          onClick={(event) => {
                            this.props.handleClick("split");
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  {this.props.buttonStatus !== "split" && (
                    <Tooltip title="Merge Sentence">
                      <IconButton aria-label="merge">
                        <Merge
                          fontSize="medium"
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
          </Grid>
          </Grid>
      </Paper>
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
