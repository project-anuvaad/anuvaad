import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Grid from "@material-ui/core/Grid";
import ClearContent from "../../../../flux/actions/apis/clearcontent";
import MachineTranslation from "./MachineTranslation";
import Block from "./Block";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import Merge from "@material-ui/icons/CallMerge";
import Snackbar from "../../../components/web/common/Snackbar";
import CancelIcon from "@material-ui/icons/Cancel";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Dialog from "../../../components/web/common/SimpleDialog";
import BLOCK_OPS from "../../../../utils/block.operations";

import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";

const TELEMETRY = require("../../../../utils/TelemetryManager");

class PdfFileEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSentence: {},
      selectedTargetId: "",
      highlightId: "",
      updateToken: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.open && prevProps.open !== this.props.open) {
      {
        this.props.sentences &&
          Array.isArray(this.props.sentences) &&
          this.props.sentences.length > 0 &&
          this.props.sentences.map((element) => {
            element &&
              element.text_blocks &&
              element.text_blocks.map((sentence) => {
                sentence.tokenized_sentences.map((value, tokenIndex) => {
                  if (value.s_id === this.state.SentenceOperationId) {
                    this.setState({
                      activeSentence: value,
                      buttonStatus: "selected",
                      updateToken: false,
                      openDialog: false,
                    });
                  }
                  return null;
                });
                return null;
              });
            return null;
          });
      }
    }

    if (prevState.activeSentence !== this.state.activeSentence) {
      this.setState({
        prevActiveState: prevState.activeSentence,
      });
    }
  }

  handleSentenceClick(value, saveData, block, blockIdentifier) {
    // this.setState({ activeSentence: value, selectedTargetId: value.s_id })

    if (
      block &&
      this.state.activeSentence &&
      this.state.activeSentence.s_id &&
      this.state.activeSentence.s_id !== value.s_id
    )
      if (saveData) {
        this.setState({
          title: "Please save the edited sentence",
          openDialog: true,
        });
      }

    this.handleClick("");
    this.setState({
      activeSentence: value,
      updateData: saveData && block,
      updateBlockId: blockIdentifier,
      buttonStatus: "selected",
    });
  }

  handleDialogMessage = (
    selected_block_id,
    sentence_id,
    sentence_index,
    operation,
    message
  ) => {
    // let splitValue = this.handleSplitSentence(subString)
    this.setState({
      operation_type: operation,
      openDialog: true,
      title: operation,

      sentence_id,
      sentence_index,
      selected_block_id,
      dialogMessage: message,
    });
  };

  handleDialog() {
    let SentenceOperationId;
    let workflowCode = "DP_WFLOW_S_TR";
    if (this.state.title === "Merge sentence") {
      let result = BLOCK_OPS.do_sentences_merging_v1(
        this.props.sentences,
        this.state.sentence_id
      );
      let updatedBlocks = result.blocks;
      SentenceOperationId = result.sentence_id;

      this.props.workFlowApi(workflowCode, updatedBlocks, this.state.title);
    } else if (this.state.title === "Split sentence") {
      let updatedBlocks = BLOCK_OPS.do_sentence_splitting(
        this.props.sentences,
        this.state.selected_block_id,
        this.state.sentence_id,
        this.state.sentence_index
      );
      SentenceOperationId = this.state.activeSentence.s_id;
      this.props.workFlowApi(workflowCode, [updatedBlocks], this.state.title);
    } else if (this.state.title === "Save") {
      this.getUpdatedBlock(this.state.prevActiveState, "save");
      // this.props.saveUpdatedSentence(this.state.updateData, this.state.updateBlockId)
    }

    this.setState({
      openDialog: false,
      buttonStatus: "apiCalled",
      SentenceOperationId,
      dialogToken: false,
    });
  }

  handleClose = () => {
    if (this.state.title === "Save") {
      this.getUpdatedBlock(this.state.prevActiveState, "no");

    }
    this.setState({
      openDialog: false,
      title: "",
      
      sentence_id: "",
      sentence_index: "",
      selected_block_id: "",
      dialogMessage: "",
      buttonStatus: "",
    });
  };

  handleClick(value) {
    this.setState({ buttonStatus: value });
  }

  saveUpdatedSentence(block, sentence, blockIdentifier) {
    
    // this.props.saveUpdatedSentence(block, sentence, blockIdentifier)
    this.getUpdatedBlock(sentence, "save");
    this.setState({ SentenceOperationId: sentence.s_id, updateToken: true });
  }

  getUpdatedBlock(tokenObj, operationType) {
    this.props.sentences &&
      Array.isArray(this.props.sentences) &&
      this.props.sentences.length > 0 &&
      this.props.sentences.map((element) => {
        element &&
          element.text_blocks &&
          element.text_blocks.map((sentence) => {
            sentence.tokenized_sentences.map((value, tokenIndex) => {
              if (tokenObj && tokenObj.s_id === value.s_id) {
                if (operationType === "save") {
                  value.save = true;
                  this.props.saveUpdatedSentence(
                    sentence,
                    sentence,
                    sentence.block_identifier
                  );
                } else {
                  if (value.hasOwnProperty("save")) {
                    value.tgt = value.s0_tgt;
                    value.tagget_tgt = value.s0_tgt;
                    value.save = true;
                  } else {
                    value.tgt = "";
                    value.tagget_tgt = "";
                  }
                  this.setState({prevActiveState:{}})
                }
              }
            });
          });
      });
  }

  handleEditorClick(id) {
    this.setState({ highlightId: id });
  }

  handleMe(value) {
    this.setState({ mergeButton: value });
  }

  showTargetData(blockId) {
    this.setState({ selectedTargetId: blockId, showData: true });
  }

  handleBlurClick = (token) => {
    this.setState({ dialogToken: token });
  };

  handleOutsideClick = () => {
    // Object.keys(this.state.activeSentence).length > 0 && console.log("clicked", this.state.activeSentence)
    if (
      Object.keys(this.state.activeSentence).length > 0 &&
      this.state.dialogToken
    ) {
      // this.handleDialogMessage(
      //   "",
      //   "",
      //   "",
      //   "Save",
      //   "Do you want to save the updated sentence"
      // );
      this.setState({ dialogToken: false });
    }
  };

  render() {
    return (
      <div>
        {this.props.sentences && (
          <div onClick={() => this.handleOutsideClick("")}>
            <Grid
              container
              spacing={2}
              style={{
                marginTop: "-20px",
                padding: "5px 24px 0px 10px",
                width: "100%",
                position: "fixed",
                zIndex: 1000,
                background: "#F5F9FA",
              }}
            >
              <Grid item xs={12} sm={9} lg={9} xl={9}>
                {this.state.buttonStatus === "merge" && (
                  <Toolbar>
                    <Typography
                      variant="h5"
                      color="inherit"
                      style={{ flex: 1 }}
                    />
                    <Fab
                      variant="extended"
                      size="medium"
                      color="primary"
                      aria-label="add"
                      onClick={() => this.handleClick("")}
                    >
                      <CancelIcon />
                      Cancel
                    </Fab>
                    <Fab
                      variant="extended"
                      size="medium"
                      color="primary"
                      mergeSaved
                      aria-label="add"
                      onClick={() => this.handleClick("mergeSaved")}
                      style={{ marginLeft: "10px" }}
                    >
                      <Merge />
                      Merge
                    </Fab>
                  </Toolbar>
                )}
                <div elevation={3} style={{ overflow: "auto" }}>
                  <div
                    id="scrollableDivs"
                    style={{
                      maxHeight: window.innerHeight - 180,
                      overflowY: this.state.selectedBlock ? "hidden" : "auto",
                      border: "1px solid #D6D6D6",
                    }}
                  >
                    <InfiniteScroll
                      next={this.props.fetchData}
                      hasMore={this.props.hasMoreItems}
                      dataLength={
                        this.props.sentences ? this.props.sentences.length : 0
                      }
                      loader={
                        <p style={{ textAlign: "center" }}>
                          <CircularProgress
                            size={20}
                            style={{
                              zIndex: 1000,
                            }}
                          />
                        </p>
                      }
                      endMessage={
                        <p style={{ textAlign: "center" }}>
                          <b>You have seen it all</b>
                        </p>
                      }
                      scrollableTarget={"scrollableDivs"}
                    >
                      {this.props.sentences &&
                        Array.isArray(this.props.sentences) &&
                        this.props.sentences.length > 0 &&
                        this.props.sentences.map((element) => {
                          return (
                            element &&
                            element.text_blocks &&
                            element.text_blocks.map((sentence) => {
                              return sentence.tokenized_sentences.map(
                                (value, tokenIndex) => {
                                  return (
                                    <Block
                                      handleDialogMessage={this.handleDialogMessage.bind(
                                        this
                                      )}
                                      sentence={value}
                                      sen={sentence}
                                      block_id={sentence.block_id}
                                      handleClick={this.handleClick.bind(this)}
                                      buttonStatus={this.state.buttonStatus}
                                      pageNo={element.page_no}
                                      modelId={this.props.modelId}
                                      selectedBlock={this.state.activeSentence}
                                      selectedTargetId={
                                        this.state.selectedTargetId
                                      }
                                      handleSentenceClick={this.handleSentenceClick.bind(
                                        this
                                      )}
                                      handleSourceChange={
                                        this.props.handleSourceChange
                                      }
                                      tokenIndex={this.props.tokenIndex}
                                      showTargetData={this.showTargetData.bind(
                                        this
                                      )}
                                      handleEditorClick={this.handleEditorClick.bind(
                                        this
                                      )}
                                      highlightId={this.state.highlightId}
                                      saveUpdatedSentence={this.saveUpdatedSentence.bind(
                                        this
                                      )}
                                      SentenceOperationId={
                                        this.state.SentenceOperationId
                                      }
                                      blockIdentifier={
                                        sentence.block_identifier
                                      }
                                      handleBlurClick={this.handleBlurClick.bind(
                                        this
                                      )}
                                      dialogToken={this.state.dialogToken}
                                      prevBlock={this.state.prevActiveState}
                                    />
                                  );
                                }
                              );
                            })
                          );
                        })}
                    </InfiniteScroll>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={3} lg={3} xl={3}>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  lg={12}
                  xl={12}
                  style={{ height: "50%" }}
                >
                  <MachineTranslation
                    sentence={this.state.activeSentence}
                    buttonStatus={this.state.buttonStatus}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
              style={{ padding: "12px 24px 0px 24px" }}
            >
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <Paper></Paper>
              </Grid>
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <Paper></Paper>
              </Grid>
            </Grid>
          </div>
        )}

        {this.state.openDialog && !this.state.updateToken && (
          <Dialog
            message={this.state.dialogMessage}
            handleSubmit={this.handleDialog.bind(this)}
            handleClose={this.handleClose.bind(this)}
            open
            title={this.state.title}
          />
        )}

        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={3000}
            variant="success"
            message={this.state.message}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  fetchPdfSentence: state.fetchPdfSentence,
  fileUpload: state.fileUpload,
  documentDetails: state.documentDetails,
  fetchContent: state.fetchContent,
  workflowStatus: state.workflowStatus,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport,
      ClearContent: ClearContent,
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PdfFileEditor)
);
