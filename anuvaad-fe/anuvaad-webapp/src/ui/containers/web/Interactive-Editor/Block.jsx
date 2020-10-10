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
import Checkbox from '@material-ui/core/Checkbox';
import ValidationIcon from '@material-ui/icons/SettingsEthernet';
import AutoComplete from "../../../components/web/common/AutoComplete1"
import IntractiveApi from "../../../../flux/actions/apis/intractive_translate";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withRouter } from "react-router-dom";

var getCaretCoordinates = require('textarea-caret');

let arr = [];
class Block extends Component {
  constructor() {
    super();
    this.state = {
      showSuggestions: false,
      enteredData: false
    };
  }

  componentDidMount() {
    this.setState({
      sentence: this.props.sentence
    })
  }
  componentDidUpdate(prevProps) {

    if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      let sentence = this.state.sentence
      // sentence.tagged_tgt = this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_tgt,
      this.setState({
        autoCompleteText: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tgt,
        autoCompleteTextTaggetTgt: this.props.intractiveTrans && this.props.intractiveTrans.length > 0 && this.props.intractiveTrans[0].tagged_tgt,

      });
    }

    if (prevProps.buttonStatus !== this.props.buttonStatus) {
      if (this.props.buttonStatus == "mergeSaved" && arr.length > 0) {
        this.handleDialogMessage(arr);
        arr = [];
      } else if (this.props.buttonStatus == "") {
        arr = [];
        this.setState({ selectedValueArray: [] });
      }
    }
  }

  handleSplitSentence(event, text) {
    const sentenceStartId = window.getSelection().anchorNode.parentNode.id;
    const split_index = window.getSelection().focusOffset;
    let opeartion = "Split sentence";
    let actual_text = text;
    actual_text = actual_text.replace(/\s{2,}/g, " ");
    actual_text = actual_text.trim();
    this.props.handleDialogMessage(
      sentenceStartId,
      split_index,
      actual_text.substring(0, split_index),
      event,
      opeartion,
      "Do you want to split the sentence"
    );
  }

  handleChangeEvent = event => {
    let sentence = this.state.sentence

    sentence.tagged_tgt = event.target.value
    sentence.tgt = event.target.value
    this.setState({
      sentence: sentence,
      enteredData : true
    })

  }

  fetchSuggestions(srcText, targetTxt, tokenObject) {
    let targetVal = targetTxt

    this.setState({ showSuggestions: true, autoCompleteText: null })
    const apiObj = new IntractiveApi(srcText, targetVal, { model_id: this.props.modelId }, true, true);
    this.props.APITransport(apiObj);
  }

  handleSuggestionClick(suggestion, value, src, tokenObject) {
    let sentence = this.state.sentence
    sentence.tagged_tgt = value.trim() + suggestion
    sentence.tgt = value.trim() + suggestion
    // console.log(sentence)
    this.setState({ showSuggestions: false })
    // this.props.handleSuggestion(suggestion, value)

    this.setState({ autoCompleteText: null, tokenObject, sentence: sentence })


    let targetVal = value.trim() + suggestion
    setTimeout(() => {
      this.setState({ showSuggestions: true })

    }, 50)

    const apiObj = new IntractiveApi(src, targetVal, { model_id: this.props.modelId }, true, true);
    this.props.APITransport(apiObj);
  }

  handleChangeEvent = (event) => {
    this.props.handleSourceChange(event, this.props.sentence);
  };

  handleChange = (name) => (event) => {
    debugger;
    if (arr.includes(name)) {
      arr = arr.filter((item) => item !== name);
    } else {
      arr.push(name);
    }
    this.setState({ selectedValueArray: arr });
  };
   

  render() {
    const { classes, sentence, selectedBlock } = this.props;

    return (
      <Paper
        variant="outlined"
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
      >
        <Grid container spacing={2}>
          <Grid item xs={8} sm={9} lg={11} xl={11}>
            <div style={{ display: "flex", flexDirection: "row" }}  onClick={() => this.props.buttonStatus!== "merge" && this.props.handleSentenceClick(this.props.sentence)}>
              <Tooltip title="Go to validation mode">
                <ValidationIcon
                  style={{ color: "#1C9AB7", cursor: "pointer" }}
                />
              </Tooltip>

              <div style={{ width: "100%", paddingLeft: "10px" }}>
                <div
                  id={sentence.s_id}
                  style={{ minHeight: "45px", padding: "5px" }}
                  onClick={() => this.props.handleSentenceClick(sentence)}
                >
                  {sentence.src}
                </div>
                <hr style={{ border: "1px dashed #00000014" }} />

                {/* <div style={{ minHeight: '45px' }}> */}
                {selectedBlock &&
                  sentence &&
                  sentence.s_id === selectedBlock.s_id && (
                    <AutoComplete
                      aId={sentence.s_id}
                      refId={sentence.s_id}
                      block_identifier_with_page={
                        sentence.block_identifier + "_" + this.props.pageNo
                      }
                      style={{
                        width: "100%",
                        resize: "none",
                        zIndex: 1111,
                        borderRadius: "4px",
                        backgroundColor: "#F4FDFF",
                        border: this.props.selectedTargetId === sentence.s_id ? '1px dotted #1C9AB7' : ""
                      }}
                      tokenIndex={this.props.tokenIndex}
                      value={(this.props.selectedTargetId === this.state.sentence.s_id || this.state.enteredData ) ? this.state.sentence.tgt : ""}
                      sentence={this.state.sentence}

                      sourceText={sentence.src}
                      page_no={this.props.page_no}
                      // fetchSuggestions={this.props.fetchSuggestions}
                      handleSuggestion={this.props.handleSuggestion}
                      heightToBeIncreased={sentence.font_size}
                      handleBlur={this.props.handleBlur}

                      showSuggestions={this.props.showSuggestions}
                      handleSuggestionClose={this.props.handleSuggestionClose}
                      // handleClickAway={this.props.handleClickAway.bind(this)}
                      tokenObject={sentence}
                      showTargetLang={this.props.selectedTargetId === sentence.s_id && true}
                      modelId={this.props.modelId}

                      autoCompleteText={this.state.autoCompleteText}
                      autoCompleteTextTaggetTgt={this.state.autoCompleteTextTaggetTgt}
                      handleChangeEvent={this.handleChangeEvent.bind(this)}
                      fetchSuggestions={this.fetchSuggestions.bind(this)}
                      handleSuggestionClick={this.handleSuggestionClick.bind(this)}
                    />)}
                </div>
              </div>
            </Grid>
            <Grid
              item
              xs={4}
              sm={3}
              lg={1}
              xl={1}

            >

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
                          this.props.showTargetData(sentence.s_id);
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
                        <Save fontSize="medium" />
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
                  <Tooltip
                    title={
                      this.props.buttonStatus === "split"
                        ? "Please select sentence to split"
                        : "Spit sentence"
                    }
                  >
                    <IconButton aria-label="Split">
                      <Split
                        fontSize={
                          this.props.buttonStatus !== "split"
                            ? "medium"
                            : "large"
                        }
                        style={
                          this.props.buttonStatus === "split"
                            ? { color: "#1C9AB7" }
                            : {}
                        }
                        onClick={(event) => {
                          this.props.buttonStatus !== "split"
                            ? this.props.handleClick("split")
                            : this.handleSplitSentence(event, sentence.src);
                        }}
                      />
                    </IconButton>
                  </Tooltip>
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

const mapStateToProps = state => ({
  apistatus: state.apistatus,
  intractiveTrans: state.intractiveTrans
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(Styles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Block)
  )
);
