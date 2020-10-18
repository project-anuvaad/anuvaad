import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withRouter } from "react-router-dom";
import SourceView from "./PdfFileEditor";
import Grid from "@material-ui/core/Grid";
import Editor from "./PdfEditor";
import MenuItems from "./PopUp";
import Dialog from "../../../components/web/common/SimpleDialog";
import IntractiveApi from "../../../../flux/actions/apis/intractive_translate";
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseToken: false,
      gridValue: 4,

      hoveredSentence: "",
      hoveredTableId: "",
      selectedSentenceId: "",
      selectedTableId: "",
      clickedSentence: false,
      sourceSupScripts: {},
      targetSupScripts: {},
      superScript: false,
      token: false,
      header: "",
      openDialog: "",
      footer: "",
      pageNo: 1,
      isAddNewCell: false,
      scrollToPage: "",
      isAddNewSentence: false,
      addNewTable: false,
      tablePosition: "",
      hoveredTable: "",
      zoom: false,
      popOver: true,
      // sentences: Data.data
    };
  }

  handleScriptSave(target, indexValue) {
    const temp = this.state.targetSupScripts;
    temp[indexValue].text = target.tgt ? target.tgt : target;
    this.setState({
      targetSupScripts: temp
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      let sentenceObj = this.state.sentences;

      sentenceObj.map(paragraph => {
        if (paragraph._id === this.state.sentenceDetails.startNode.split("_")[0]) {
          paragraph.tokenized_sentences.map((sentence, index) => {
            
            if (this.state.value !==1 && sentence.sentence_index === parseInt(this.state.sentenceDetails.startNode.split("_")[1])) {
              sentence.src = this.state.selectedText;
              sentence.target = this.props.intractiveTrans.tgt;
              sentence.tagged_tgt = this.props.intractiveTrans.tagged_tgt;
              sentence.tagged_src = this.props.intractiveTrans.tagged_src;
              paragraph.tokenized_sentences.splice([index+1],1,paragraph.tokenized_sentences[index]);
              paragraph.tokenized_sentences[1].src = this.state.balanceText;
              paragraph.tokenized_sentences[1].sentence_index= paragraph.tokenized_sentences.length;
              const apiObj = new IntractiveApi(this.state.balanceText, "", { model_id: "17" }, true);
              if (this.state.balanceText) {
                const { APITransport } = this.props;
                this.setState({value:1})
                APITransport(apiObj);
                
              }
            }
            else if(this.state.value===1&& sentence.sentence_index === parseInt(this.state.sentenceDetails.startNode.split("_")[1])){
              paragraph.tokenized_sentences[index+1].target = this.props.intractiveTrans.tgt;
              paragraph.tokenized_sentences[index+1].tagged_tgt = this.props.intractiveTrans.tagged_tgt;
              paragraph.tokenized_sentences[index+1].tagged_src = this.props.intractiveTrans.tagged_src;
              
            }
         return null;
         });
        }
      return null;
    });

      this.setState({ sentences: sentenceObj });
    }
  }
  handleSave(value, index, submittedId, sentenceIndex, keyValue, cellValue, taggedValue) {
    const obj = this.state.sentences;
    this.setState({ open: this.state.token });
    const temp = this.state.sentences[index];

    if (temp.is_table) {
      temp.table_items[keyValue][cellValue].target = value.tgt ? value.tgt : value;
      temp.table_items[keyValue][cellValue].tagged_tgt = value.tagged_tgt ? value.tagged_tgt : taggedValue;
    }
    temp.tokenized_sentences[sentenceIndex].target = value.tgt ? value.tgt : value;
    temp.tokenized_sentences[sentenceIndex].tagged_tgt = value.tagged_tgt ? value.tagged_tgt : taggedValue;

    obj[index] = temp;
    this.setState({
      sentences: obj
    });

    this.handleDone(false, temp);
  }

  handleDialogSave() {
    if (this.state.title === "Merge" || this.state.title === "Split") {
      const apiObj = new IntractiveApi(this.state.selectedText, "", { model_id: "17" }, true);
      if (this.state.selectedText) {
        const { APITransport } = this.props;
        APITransport(apiObj);
        this.setState({ apiCall: true });
      }
    }

    this.setState({ openDialog: false });
  }

  handleCellOnClick(sentenceId, tableId, clickedCell, value, parent, pageNo, next_previous) {
    this.setState({
      selectedSentenceId: tableId,
      selectedTableId: tableId,
      clickedSentence: value,
      scrollToId: sentenceId,
      clickedCell,
      parent,
      superScript: false,
      contextToken: false,
      pageNo,
      isAddNewCell: true,
      sText: ""
    });
    this.handleClose();

    if (next_previous) {
      this.setState({ parent: "target" });
      const self = this;
      setTimeout(() => {
        self.setState({ scrollToId: "" });
        self.setState({ scrollToId: sentenceId, parent: "source" });
      }, 350);
    }
  }

  handleSenetenceOnClick(sentenceId, value, parent, pageNo, next_previous) {
    this.setState({
      selectedSentenceId: sentenceId,
      clickedSentence: value,
      selectedTableId: "",
      scrollToId: sentenceId,
      pageNo: pageNo || this.state.pageNo,
      parent,

      superScript: false
    });
    if (next_previous) {
      this.setState({ parent: "target" });
      const self = this;
      setTimeout(() => {
        self.setState({ scrollToId: "" });
        self.setState({ scrollToId: sentenceId, parent: "source" });
      }, 350);
    }
  }
  handleClose = () => {
    this.setState({
      openDialog: false,

      operation_type: "",

      endSentence: "",
      startSentence: "",
      addSentence: false,
      selectedMergeSentence: [],
      openEl: false
    });
  };

  handleDialog(title, dialogMessage) {
    this.setState({ openDialog: true, title, dialogMessage, openEl: false });
  }

  popUp = (operation_type, event, sentenceDetails, selectedText, balanceText) => {
    this.setState({ operation_type, openEl: true, topValue: event.clientY - 4, sentenceDetails,balanceText, selectedText, leftValue: event.clientX - 2 });
  };

  handleDone(token, value) {
    const senArray = [];
    senArray.push(value);
    // const apiObj = new InteractiveApi(senArray);
    // APITransport(apiObj);
    // this.setState({ token, message: `${this.state.fileDetails.process_name} ` + translate("intractive_translate.page.message.savedSuccessfully") });
  }
  render() {
    return (
      <div>
        <Grid container spacing={8} style={{ padding: "0 24px 0px 24px" }}>
          <Grid item xs={12} sm={6} lg={4} xl={4} className="GridFileDetails">
            <SourceView sentences={this.state.sentences} title={"Source"} popUp={this.popUp.bind(this)} />
          </Grid>
          <Grid item xs={12} sm={6} lg={4} xl={4} className="GridFileDetails">
            <SourceView title={"Target"} />
          </Grid>
          <Grid item xs={12} sm={12} lg={4} xl={4}>
            <Editor
              superScriptToken={this.state.superScript}
              scriptSentence={this.state.scriptSentence}
              modelDetails={this.state.fileDetails}
              clickedCell={this.state.clickedCell}
              selectedTableId={this.state.selectedTableId}
              clickedSentence={this.state.clickedSentence}
              handleSenetenceOnClick={this.handleSenetenceOnClick.bind(this)}
              submittedId={this.state.selectedSentenceId}
              sentences={this.state.sentences}
              hadleSentenceSave={this.handleDone.bind(this)}
              handleSave={this.handleSave.bind(this)}
              handleCellOnClick={this.handleCellOnClick.bind(this)}
              // sentences={Data}
              handleSelectionClose={this.handleClose.bind(this)}
            />
          </Grid>
        </Grid>
        {this.state.openDialog && (
          <Dialog
            message={this.state.dialogMessage}
            handleSubmit={this.handleDialogSave.bind(this)}
            handleClose={this.handleClose.bind(this)}
            open
            title={this.state.title}
          />
        )}
        {this.state.operation_type && this.state.openEl && (
          <MenuItems
            isOpen={this.state.openEl}
            topValue={this.state.topValue}
            leftValue={this.state.leftValue}
            anchorEl={this.state.anchorEl}
            operation_type={this.state.operation_type}
            handleClose={this.handleClose.bind(this)}
            handleDialog={this.handleDialog.bind(this)}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fetchPdfSentence: state.fetchPdfSentence,
  intractiveTrans: state.intractiveTrans
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Preview));
