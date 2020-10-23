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
import WordDictionary from "../../../../flux/actions/apis/word_dictionary";
import BLOCK_OPS from "../../../../utils/block.operations";
import Dictionary from "./Dictionary";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import MenuItems from "./PopUp";
import Dialog from "../../../components/web/common/SimpleDialog";

const TELEMETRY = require("../../../../utils/TelemetryManager");

class PdfFileEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSentence: {},
      selectedTargetId: "",
      highlightId: "",
      updateToken: false,
      editedText: "",
      loading: false,
      displayMsg: false
    };
  }

  componentDidMount() {
    if (this.props.scroll) {
      let page = this.props.scroll && this.props.scroll.split("@")[0]
      if (this.refs[this.props.scroll] && page !== 1) {
        this.refs[this.props.scroll].scrollIntoView({
          behavior: "smooth",
          inline: "end"
        });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {

    if (this.props.open && prevProps.open !== this.props.open) {

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

    if (prevProps.wordDictionary !== this.props.wordDictionary && this.props.wordDictionary) {
      let parallel_words = [];
      if (this.state.src_locale === "en") {

        this.props.wordDictionary.parallel_words.map(words => {
          if (this.state.tgt_locale === words.locale) {
            parallel_words.push(words.name)
          }

        })

      }
      else {
        parallel_words.push(this.props.wordDictionary.name)
      }

      this.setState({ parallel_words, loading: false })

    }

    // if (prevState.activeSentence !== this.state.activeSentence) {
    //   this.setState({
    //     prevActiveState: prevState.activeSentence
    //   })
      // if (this.state.editedText && this.state.editedText) {
      //   if (prevState.activeSentence.tgt !== this.state.editedText) {
      //     this.setState({
      //       openDialog: true,
      //       title: "Save",
      //       dialogMessage: "Do you want to save the updated sentence"
      //     })
      //   }

      // }

    // }

  }

  handleDictionary(selectedValue, src_locale, tgt_locale) {

    const apiObj = new WordDictionary(selectedValue, src_locale, tgt_locale);
    this.props.APITransport(apiObj);
    this.setState({ src_locale, tgt_locale, loading: true })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 2000)
  }

  handleSentenceClick(value, saveData, block, blockIdentifier) {
    // this.setState({ activeSentence: value, selectedTargetId: value.s_id })

    if (block && this.state.activeSentence && this.state.activeSentence.s_id && this.state.activeSentence.s_id !== value.s_id)

      this.handleClick("");
    this.handleClose();
    this.setState({
      activeSentence: value,
      updateData: saveData && block,
      updateBlockId: blockIdentifier,
      buttonStatus: "selected"
    });
  }

  handleDialogMessage = (
    selected_block_id,
    sentence_id,
    sentence_index,
    operation,
    editedText
  ) => {

    this.handleDialog(sentence_id, selected_block_id, sentence_index, operation, editedText)
    // let splitValue = this.handleSplitSentence(subString)


    // this.handleDialog(sentence_id, selected_block_id,sentence_index,operation,editedText )
  };

  handleDialog(selected_block_id,
    sentence_id,
    sentence_index,
    title,
    editedText) {
    let SentenceOperationId;
    let workflowCode = "WF_S_TR";
    if (title === "Merge sentence") {
      let result = BLOCK_OPS.do_sentences_merging_v1(
        this.props.sentences,
        sentence_id
      );

      let updatedBlocks = result.blocks;
      SentenceOperationId = result.sentence_id;

      let initialSentences = []
      let finalSentence = ""
      result && result.sentences && Array.isArray(result.sentences) && result.sentences.length > 0 && result.sentences.map(sen => {
        initialSentences.push(sen.src)
        finalSentence += sen.src
        return true
      })

      if (initialSentences && Array.isArray(initialSentences) && initialSentences.length > 0) {
        TELEMETRY.mergeSentencesEvent(initialSentences, finalSentence)
      }

      this.props.workFlowApi(workflowCode, updatedBlocks, title);
    } else if (title === "Split sentence") {
      let data = this.state.activeSentence && this.state.activeSentence.src

      let updatedBlocks = BLOCK_OPS.do_sentence_splitting(
        this.props.sentences,
        selected_block_id,
        sentence_id,
        sentence_index
      );
      debugger
      SentenceOperationId = this.state.activeSentence.s_id;

      TELEMETRY.splitSentencesEvent(data, [data.slice(0, this.state.sentence_index), data.slice(this.state.sentence_index)])

      this.props.workFlowApi(workflowCode, [updatedBlocks], title);
    }
    else if (this.state.title === "Save") {
      this.getUpdatedBlock(selected_block_id, title, editedText)
    }

    this.setState({ openDialog: false, buttonStatus: "apiCalled", SentenceOperationId, dialogToken: false });
  }

  handleClose = () => {
    this.setState({
      openEl: false,
      title: "",

      sentence_id: "",
      sentence_index: "",
      selected_block_id: "",
      dialogMessage: "",
      buttonStatus: "",
      saveCancelled: true
    });

    setTimeout(() => {
      this.setState({ saveCancelled: false })
    }, 50)
  };

  handleClick(value) {
    this.setState({ buttonStatus: value });
  }

  saveUpdatedSentence(block, sentence, blockIdentifier, editedText, isSaved) {
    this.setState({ SentenceOperationId: sentence.s_id, updateToken: true })
    this.getUpdatedBlock(sentence, "Save", editedText, isSaved)
  }

  getUpdatedBlock(tokenObj, operationType, editedText, isSaved) {
    let callApi = false

    this.props.sentences && Array.isArray(this.props.sentences) && this.props.sentences.length > 0 && this.props.sentences.map((element) => {
      element && element.text_blocks && element.text_blocks.map((sentence) => {
        sentence.tokenized_sentences.map((value, tokenIndex) => {
          if (tokenObj && tokenObj.s_id === value.s_id) {
            if (operationType === "Save") {
              TELEMETRY.sentenceChanged(value.tgt, editedText, sentence.block_id, "translation")

              if (!isSaved) {
                if (tokenObj.tgt === editedText) {
                  callApi = false
                  this.setState({ displayMsg: true, displayTitle: "You have not edited sentence" })
                } else {
                  callApi = true
                }
              } else {
                callApi = true
              }

              value.save = true
              value.tgt = editedText
              value.tagged_tgt = editedText
              if (callApi) {
                this.props.saveUpdatedSentence(value, element.page_no)
              }

            } else {
              if (value.hasOwnProperty("save")) {
                value.tgt = this.state.prevActiveState && this.state.prevActiveState.tgt
                value.tagget_tgt = this.state.prevActiveState && this.state.prevActiveState.s0_tgt
                // value.save = true
              }
            }

          }

        return null;
      })
      return null;
    })
    return null;
  })
  }



  popUp = (selected_block_id,
    sentence_id,
    sentence_index, event, operation, selectedText, targetDict) => {

    window.getSelection().toString() && this.setState({
      operation_type: operation,
      openEl: true,

      topValue: event.clientY - 4,
      leftValue: event.clientX - 2,
      selected_block_id,
      sentence_id,
      sentence_index,
      selectedText,
      targetDict



    });
  };

  handlePopApi(status){
    if(status==="Split sentence"){
      if(this.state.activeSentence.src.length!==this.state.sentence_index && this.state.sentence_index>0){
        this.handleDialog( this.state.selected_block_id,this.state.sentence_id,this.state.sentence_index,this.state.operation_type )
      }
      else {
        alert("Please select split sentence correctly")
      }



    }
    else if (status === "Dictionary") {
      let word_locale = this.props.match.params.locale
      let tgt_locale = this.props.match.params.tgt_locale
      if (this.state.targetDict) {
        this.handleDictionary(this.state.selectedText, tgt_locale, word_locale)
      }
      else {
        this.handleDictionary(this.state.selectedText, word_locale, tgt_locale)
      }

    }
    this.setState({ openEl: false })
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
    this.handleClose();
  };

  handleOutsideClick = () => {
    if (Object.keys(this.state.activeSentence).length > 0 && this.state.dialogToken) {
      this.setState({ dialogToken: false })
    }
  }

  handleSentences(sentence, element) {
    return sentence.tokenized_sentences.map((value, tokenIndex) => {
      return <div ref={this.props.sentences.page_no}>
        <Block
          handleDialogMessage={this.handleDialog.bind(this)}
          sentence={value}
          sen={sentence}
          block_id={sentence.block_id}
          handleClick={this.handleClick.bind(this)}
          buttonStatus={this.state.buttonStatus}
          pageNo={element.page_no}
          modelId={this.props.modelId}
          selectedBlock={this.state.activeSentence}
          selectedTargetId={this.state.selectedTargetId}
          handleSentenceClick={this.handleSentenceClick.bind(this)}
          handleSourceChange={this.props.handleSourceChange}
          tokenIndex={this.props.tokenIndex}
          showTargetData={this.showTargetData.bind(this)}
          handleEditorClick={this.handleEditorClick.bind(this)}
          highlightId={this.state.highlightId}
          saveUpdatedSentence={this.saveUpdatedSentence.bind(this)}
          SentenceOperationId={this.state.SentenceOperationId}
          blockIdentifier={sentence.block_identifier}
          handleBlurClick={this.handleBlurClick.bind(this)}
          dialogToken={this.state.dialogToken}
          // updateSentence={this.updateSentence.bind(this)}
          prevBlock={this.state.prevActiveState}
          saveCancelled={this.state.saveCancelled}
          getUpdatedBlock={this.getUpdatedBlock.bind(this)}
          moveToValidationMode={this.props.moveToValidationMode}
          scroll={this.props.scroll}
          handleDictionary={this.handleDictionary.bind(this)}
          popUp={this.popUp.bind(this)}
        />
      </div>
    });
  }

  handleDialogClose() {
    this.setState({ displayMsg: false, displayTitle: "" })
  }

  render() {

    return (
      <div>
        {this.props.sentences && (
          <div>
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
                      mergeSaved aria-label="add"
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
                      border: "1px solid #D6D6D6"
                    }}
                  >
                    <InfiniteScroll
                      next={this.props.fetchData}
                      hasMore={this.props.hasMoreItems}
                      dataLength={this.props.sentences ? this.props.sentences.length : 0}
                      loader={
                        <p style={{ textAlign: "center" }} >
                          <CircularProgress
                            size={20}
                            style={{
                              zIndex: 1000
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
                      {this.props.sentences && Array.isArray(this.props.sentences) && this.props.sentences.length > 0 && this.props.sentences.map((element) => {
                        return element && element.text_blocks && element.text_blocks.map((sentence) => {
                          return <div
                            ref={element.page_no + "@" + sentence.block_identifier}
                            id={element.page_no + "@" + sentence.block_identifier}
                          // key={element.page_no + "@" + sentence.block_id}
                          >
                            {
                              this.handleSentences(sentence, element)
                            }
                          </div>

                        })
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
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={12}
                    xl={12}
                    style={{ height: "50%" }}
                  >

                    <Dictionary parallel_words={this.state.parallel_words} selectedText={this.state.selectedText} loading={this.state.loading} />
                  </Grid>
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

        {this.state.openEl && this.state.activeSentence && window.getSelection().toString() && (
          <MenuItems
            isOpen={this.state.openEl}
            splitValue={this.state.splitValue}
            topValue={this.state.topValue}
            leftValue={this.state.leftValue}
            anchorEl={this.state.anchorEl}
            targetDict={this.state.targetDict}
            selectedText={this.state.selectedText}
            operation_type={this.state.operation_type}
            handleClose={this.handleClose.bind(this)}
            handleDialog={this.handlePopApi.bind(this)}


          // handleCheck={this.handleCheck.bind(this)}

          />
        )}
        {
          this.state.displayMsg &&
          <Dialog
            message={this.state.displayTitle}
            type="warning"
            handleClose={this.handleDialogClose.bind(this)}
            open
            title="" />
        }
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
  wordDictionary: state.wordDictionary
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
