import React from "react";
import BlockView from "./DocumentBlock";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import MenuItems from "./PopUp";
import Dialog from "../../../components/web/common/SimpleDialog";
import Image from "./Image";
import { withRouter } from "react-router-dom";
import BLOCK_OPS from "../../../../utils/block.operations";

class DocumentSource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEl: false,
      value: false,
      showLoader: false,
      autoCompleteText: null,
      openContextMenu: false,
      targetVal: "",
      showSuggestions: false
    };
  }

  componentDidMount() {
    if (this.props.scrollToPage) {
      if (this.refs[this.props.scrollToPage]) {
        this.refs[this.props.scrollToPage].scrollIntoView({
          behavior: "smooth",
          inline: "end"
        });
      }
    }

    if (this.props.scrollId) {
      if (this.refs[this.props.scrollId]) {
        this.refs[this.props.scrollId].scrollIntoView({
          behavior: "smooth",
          inline: "end"
        });
      }
    }

  }

  componentDidUpdate(prevProps) {

    if (prevProps.scrollToPage !== this.props.scrollToPage) {
      if (this.refs[this.props.scrollToPage]) {
        this.refs[this.props.scrollToPage].scrollIntoView({
          behavior: "smooth",
          inline: "end"
        });
      }
    }
    if (this.props.createBlockId && prevProps.createBlockId !== this.props.createBlockId) {
      this.setState({ selectedSentence: this.props.createBlockId, value: true });
    }

  }


  updateContent(value) {
    this.setState({ openDialog: true, selectedArray: value, title: "Merge Paragraphs", dialogMessage: "Do you want to merge selected paragraphs ?" })
  }

  handleDialog() {
    let workflowCode = "WF_S_TR";
    if (this.state.title === "Merge sentence") {
      let updatedBlocks = BLOCK_OPS.do_sentences_merging(this.props.sentences, this.state.start_block_id, this.state.start_sentence_id, this.state.end_sentence_id);
      this.props.workFlowApi(workflowCode, [updatedBlocks], this.state.title);

    }
    else if (this.state.title === "Split sentence") {
      let updatedBlocks = BLOCK_OPS.do_sentence_splitting(this.props.sentences, this.state.start_block_id, this.state.start_sentence_id, this.state.end_sentence_id);
      this.props.workFlowApi(workflowCode, [updatedBlocks], this.state.title);
    }

    else if (this.state.title === "Merge Paragraphs") {

      this.props.updateContent(this.state.selectedArray)
    }
    this.setState({ openDialog: false });
  }

  handleDialogMessage(title, dialogMessage) {

    this.setState({ openDialog: true, title, dialogMessage, openEl: false });
  }

  popUp = (start_block_id, start_sentence_id, end_sentence_id, subString, event, operation) => {
    // let splitValue = this.handleSplitSentence(subString)


    this.setState({
      operation_type: operation,
      openEl: true,

      topValue: event.clientY - 4,
      leftValue: event.clientX - 2,
      selectedBlock: null,
      start_block_id,
      start_sentence_id,
      end_sentence_id



    });
  };
  handleBlur = (id, workflowcode, saveData, prevValue, finalValue) => {
    this.setState({ hoveredSentence: null, value: false, selectedSentence: "" });
    this.props.handleBlur(id, workflowcode, saveData, prevValue, finalValue);
  };

  handleClose = () => {

    this.setState({
      openDialog: false,
      start_block_id: "",
      start_sentence_id: '',
      end_sentence_id: '',
      operation_type: "",
      arrayClear: true,
      selectedArray: [],
      endSentence: "",
      startSentence: "",
      addSentence: false,
      selectedMergeSentence: [],
      openEl: false
    });
  };

  handleDoubleClick(selectedBlock, value, pageDetail) {
    this.props.handleSource(selectedBlock, value, pageDetail);
    this.setState({ hoveredSentence: null, selectedSentence: selectedBlock, value: true });
  }

  handleCheck(block, evt, val) {
    this.props.handleCheck(block, evt, val);
    this.setState({ selectedBlock: null });
  }

  handleDoubleClickTarget(event, id, text, pageDetails, block_id) {
    this.setState({ autoCompleteText: null })
    this.props.handleDoubleClickTarget(event, id, text, pageDetails, block_id)
  }

  getContent() {
    let yAxis = 0;
    let sourceSentence = this.props.sourceSentence;
    return (
      <div ref={sourceSentence.page_no}>
        {sourceSentence.text_blocks &&
          sourceSentence.text_blocks.map((sentence, index) => {
            yAxis = sentence.text_top + sourceSentence.page_no * sourceSentence.page_height;
            //const block_id = sentence.block_id;
            return (
              <div id={sourceSentence.page_no + "@" + sentence.block_identifier}
                ref={sourceSentence.page_no + "@" + sentence.block_identifier}
              >
                <BlockView
                  block_identifier={this.props.block_identifier}
                  sentences={this.props.sentences}
                  has_sibling={this.props.has_sibling}
                  key={index + "_" + sentence.block_id}
                  pageDetail={this.props.pageDetail}
                  sentence={sentence}
                  yAxis={yAxis}
                  page_no={sourceSentence.page_no}
                  handleOnMouseEnter={this.props.handleOnMouseEnter}
                  hoveredSentence={this.props.hoveredSentence}
                  handleDoubleClick={this.handleDoubleClick.bind(this)}
                  selectedBlock={this.state.selectedBlock}
                  handleSourceChange={this.props.handleSourceChange}
                  tokenized={this.props.tokenized}
                  isEditable={this.props.isEditable}
                  selectedSourceText={this.props.selectedSourceText}
                  value={this.state.value}
                  handleBlur={this.handleBlur.bind(this)}
                  selectedSentence={this.state.selectedSentence}
                  handleOnMouseLeave={this.props.handleOnMouseLeave}
                  paperType={this.props.paperType}
                  mergeButton={this.props.mergeButton}
                  updateContent={this.updateContent.bind(this)}
                  handleDoubleClickTarget={this.handleDoubleClickTarget.bind(this)}
                  targetSelected={this.props.targetSelected}
                  popUp={this.popUp.bind(this)}
                  scrollId={this.props.scrollId}
                />
              </div>
            );
          })}

        {this.state.openDialog && (
          <Dialog
            message={this.state.dialogMessage}
            handleSubmit={this.handleDialog.bind(this)}
            handleClose={this.handleClose.bind(this)}
            open
            title={this.state.title}
          />
        )}

        {this.state.openEl && (
          <MenuItems
            isOpen={this.state.openEl}
            splitValue={this.state.splitValue}
            topValue={this.state.topValue}
            leftValue={this.state.leftValue}
            anchorEl={this.state.anchorEl}
            operation_type={this.state.operation_type}
            handleClose={this.handleClose.bind(this)}
            handleDialog={this.handleDialogMessage.bind(this)}


            handleCheck={this.handleCheck.bind(this)}

          />
        )}

        {sourceSentence.images &&
          Array.isArray(sourceSentence.images) &&
          sourceSentence.images.length > 0 &&
          sourceSentence.images.map((images, imgIndex) => {
            return <Image imgObj={images}></Image>;
          })}
      </div>
    );
  }

  handlePaperClick() {
    if (this.state.contentEditableId) {
      this.props.handleAutoCompleteEditor("", "");
      this.setState({
        contentEditableId: null
      });
    }
  }

  render() {
    const { sourceSentence } = this.props;

    let style = {
      maxWidth: sourceSentence.page_width + "px",
      overflowX: "scroll",
      overflowY: "hidden",
      position: "relative",
      minHeight: sourceSentence.page_height + "px",
      backgroundColor: "white",
      marginLeft: "auto",
      marginRight: "auto",
      borderTop: sourceSentence.page_no !== 1 ? "1px black solid" : "",
      borderBottom: this.props.pageCount !== sourceSentence ? "1px black solid" : ""
    };

    return (
      <div ref={el => (this.container = el)}>
            <div
              style={style}
              onMouseEnter={() => {
                this.props.handlePreviewPageChange(sourceSentence.page_no, 1);
              }}
            >
              {this.getContent()}
            </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  apistatus: state.apistatus,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentSource));

