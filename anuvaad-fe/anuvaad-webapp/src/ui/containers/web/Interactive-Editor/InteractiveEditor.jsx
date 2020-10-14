import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import "../../../styles/web/InteractiveEditor.css";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";

import GetAppIcon from '@material-ui/icons/GetApp';
import Toolbar from "@material-ui/core/Toolbar";
import DoneIcon from "@material-ui/icons/Done";
import KeyboardTabIcon from "@material-ui/icons/KeyboardTab";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import htmlToText from "html-to-text";
import { translate } from "../../../../assets/localisation";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Editor from "./Editor";
import FetchDoc from "../../../../flux/actions/apis/fetchdocsentence";
import InteractiveSourceUpdate from "../../../../flux/actions/apis/interactivesourceupdate";
import history from "../../../../web.history";
import EditorPaper from "./EditorPaper";
import InteractiveApi from "../../../../flux/actions/apis/interactivesavesentence";
import Snackbar from "../../../components/web/common/Snackbar";
import SentenceMerge from "../../../../flux/actions/apis/InteractiveMerge";
import Dialog from "../../../components/web/common/SimpleDialog";
import PdfPreview from "./PdfPreview";
import UpdatePdfTable from "../../../../flux/actions/apis/updatePdfTable";
import DeleteSentence from "../../../../flux/actions/apis/deleteSentence";
import DeleteTable from "../../../../flux/actions/apis/deleteTable";
import MenuItems from "../../../components/web/common/Menu";
import InsertNewSentence from "../../../../flux/actions/apis/insertSentence";
import EditorDialog from "../../../components/web/common/EditorDialog";
import copy from 'copy-to-clipboard';

class IntractiveTrans extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      collapseToken: false,
      gridValue: 4,
      message: translate("intractive_translate.page.snackbar.message"),
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
      popOver: true
    };
  }

  handleClick(value, gridValue) {
    this.setState({ collapseToken: value, gridValue });
  }

  handleBack() {
    history.push(`${process.env.PUBLIC_URL}/view-pdf`);
  }

  componentDidMount() {
    this.handleSentenceApi();
  }

  handleSentenceApi() {
    const { APITransport } = this.props;
    const apiObj = new FetchDoc(this.props.match.params.fileid);
    APITransport(apiObj);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.interactiveUpdate !== this.props.interactiveUpdate) {
      this.setState({ open: this.state.token });
      this.state.token &&
        setTimeout(() => {
          this.handleBack();
        }, 3000);
    }
    if (prevProps.updateSource !== this.props.updateSource) {
      this.handleSentenceApi();
      this.setState({ selectedSourceCheckText: "", selectedSourceText: "", selectedSourceId: "" });
    }
    if (prevProps.mergeSentenceApi !== this.props.mergeSentenceApi) {
      this.handleSentenceApi();
      this.setState({
        action: true,
        selectedMergeSentence: []
      });
    }

    if (
      prevProps.updatePdfTable !== this.props.updatePdfTable ||
      prevProps.deleteSentence !== this.props.deleteSentence ||
      prevProps.deleteTable !== this.props.deleteTable ||
      prevProps.insertSentence !== this.props.insertSentence
    ) {
      const { APITransport } = this.props;
      const apiObj = new FetchDoc(this.props.match.params.fileid);
      APITransport(apiObj);
      this.setState({
        action: true,

      });
    }

    if (prevProps.fetchPdfSentence !== this.props.fetchPdfSentence) {
      const temp = this.props.fetchPdfSentence.data;
      const sentenceArray = [];
      const superArray = [];
      const supScripts = {};
      const targetSupScript = {};
      temp.map(sentence => {
        if (Array.isArray(sentence.tokenized_sentences) && sentence.tokenized_sentences.length) {
          if (!sentence.is_footer && !sentence.is_header && !sentence.is_footer_text) {
            let a = [];

            sentence.tokenized_sentences.map(item => {
              if (item.status !== "DELETED") {
                a.push(item);
              }
              return true
            });

            sentence.tokenized_sentences = a;

            if (sentence.is_table && sentence.status !== "DELETED") {
              let i = 0,
                objSentfinal = {};
              for (let row in sentence.table_items) {
                let j = 0,
                  objSent = {};
                for (let block in sentence.table_items[row]) {
                  if (sentence.table_items[row][block].status !== "DELETED") {
                    objSent[j] = sentence.table_items[row][block];
                    j = j + 1;
                  }
                }
                if (Object.getOwnPropertyNames(objSent).length > 0) {
                  objSentfinal[i] = objSent;
                  i = i + 1;
                }

              }
              sentence.table_items = objSentfinal;
            }
            if (sentence.status !== "DELETED") {
              sentenceArray.push(sentence);
            }
          } else if (sentence.is_footer) {
            superArray.push(sentence);
            let sourceValue = "";

            const key = sentence.text.substr(0, sentence.text.indexOf(" "));

            if (!isNaN(key)) {
              const sScript = {};
              const tScript = {};

              sScript.sentence_id = sentence._id;
              tScript.sentence_id = sentence._id;

              if (sentence.text) {
                sScript.text = sentence.text.substr(sentence.text.indexOf(" ") + 1);
              }
              if (
                sentence.tokenized_sentences &&
                Array.isArray(sentence.tokenized_sentences) &&
                sentence.tokenized_sentences[0] &&
                sentence.tokenized_sentences[0].target
              ) {
                tScript.text = sentence.tokenized_sentences[0].target.substr(sentence.tokenized_sentences[0].target.indexOf(" ") + 1);
              }

              supScripts[key] = sScript;
              targetSupScript[key] = tScript;
            } else {
              const sScript = {};
              const tScript = {};

              const prevKey = Object.keys(supScripts).length;

              if (sentence.text && supScripts[prevKey] && supScripts[prevKey].sentence_id) {
                sScript.sentence_id = supScripts[prevKey].sentence_id;
                sourceValue = supScripts[prevKey].text;
                if (sourceValue) {
                  sScript.text = sourceValue.concat(" ", sentence.text);
                } else {
                  sScript.text = sentence.text;
                }
              }
              if (
                sentence.tokenized_sentences &&
                Array.isArray(sentence.tokenized_sentences) &&
                targetSupScript[prevKey] &&
                targetSupScript[prevKey]._id
              ) {
                tScript.sentence_id = targetSupScript[prevKey].sentence_id;
                tScript.text = targetSupScript[prevKey].text;

                sentence.tokenized_sentences.map(tokenSentence => {
                  tScript.text = tScript.text.concat(" ", tokenSentence.target);
                  return true;
                });
              }
              supScripts[prevKey] = sScript;
              targetSupScript[prevKey] = tScript;
            }
          }
        } else if (sentence.is_header) {
          this.setState({ header: sentence.text });
        } else if (sentence.is_footer_text) {
          this.setState({ footer: sentence.text });
        }
        return true;
      });

      this.setState({ open: this.state.action });
      this.state.action &&
        setTimeout(() => {
          this.setState({ action: false, open: false });
        }, 2000);

      this.setState({
        sentences: sentenceArray,
        action: false,
        scriptSentence: superArray,
        fileDetails: this.props.fetchPdfSentence.pdf_process,
        sourceSupScripts: supScripts,
        targetSupScripts: targetSupScript,
        clickedSentence: "",
        selectedSentenceId: "",
        contextToken: false,
        addSentence: false,
        sText: ''
      });
    }
  }

  handleSave(value, index, submittedId, sentenceIndex, keyValue, cellValue, taggedValue) {
    const obj = this.state.sentences;
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

  handleDone(token, value) {
    const { APITransport } = this.props;
    const senArray = [];
    senArray.push(value);
    const apiObj = new InteractiveApi(senArray);
    APITransport(apiObj);
    this.setState({ token, message: `${this.state.fileDetails.process_name} ` + translate("intractive_translate.page.message.savedSuccessfully") });
  }

  handleScriptSave(target, indexValue) {
    const temp = this.state.targetSupScripts;
    temp[indexValue].text = target.tgt ? target.tgt : target;
    this.setState({
      targetSupScripts: temp
    });
  }

  handleOnMouseEnter(sentenceId, parent, pageNo) {
    if (this.state.selectedSentenceId) {
      this.setState({ hoveredSentence: sentenceId, scrollToId: "", pageNo: pageNo || this.state.pageNo, parent });
    } else {
      this.setState({ hoveredSentence: sentenceId, scrollToId: sentenceId, pageNo: pageNo || this.state.pageNo, parent });
    }
  }

  handleOnMouseLeave() {
    this.setState({ hoveredSentence: "" });
  }

  handleTableHover(sentenceId, tableId, parent, pageNo, paragraph) {
    if (this.state.clickedCell && this.state.selectedSentenceId) {
      this.setState({
        hoveredSentence: sentenceId,
        hoveredTableId: tableId,
        scrollToId: "",
        pageNo: pageNo || this.state.pageNo,
        parent,
        hoveredTable: paragraph
      });
    } else {
      this.setState({
        hoveredSentence: sentenceId,
        hoveredTableId: tableId,
        scrollToId: sentenceId,
        pageNo: pageNo || this.state.pageNo,
        parent,
        hoveredTable: paragraph
      });
    }
  }

  handleTableHoverLeft() {
    this.setState({ hoveredSentence: "", hoveredTableId: "" });
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

  handleAddSentence() {
    this.setState({ addSentence: true, operation_type: 'merge-individual', openEl: false });
  }

  handleApiMerge() {
    const { APITransport } = this.props;
    let totalSelectedSentence = this.state.mergeSentence;
    let splitArray = [];

    if (this.state.operation_type === "merge-individual") {
      splitArray.push(totalSelectedSentence[0]);
      if (totalSelectedSentence[0]._id !== totalSelectedSentence.slice(-1)[0]._id) {
        splitArray.push(totalSelectedSentence.slice(-1)[0]);
      }
      this.setState({ message: 'Sentence merged successfully' })
      totalSelectedSentence = splitArray;
    }
    if (this.state.operation_type === "merge" || this.state.operation_type === "split" || this.state.operation_type === "merge-individual") {
      const apiObj = new SentenceMerge(
        totalSelectedSentence,
        this.state.startSentence,
        this.state.operation_type,
        this.state.endSentence,
        this.state.splitSentence
      );
      APITransport(apiObj);
    }
    if (this.state.operation_type === "merge") {
      this.setState({ message: 'Sentence merged successfully' })
    }
    else if (this.state.operation_type === "split") {
      this.setState({ message: 'Sentence splitted successfully' })
    }
    this.handleClose();
  }

  handleDialogTable(sentence, cellData, operationType) {
    if (operationType === "add-row") {
      this.setState({ openDialog: true, title: "Add row", dialogMessage: "Do you want to add row ?", addCellSentence: sentence, operationType });
    }
    else if (operationType === "add-column") {
      this.setState({ openDialog: true, title: "Add column", dialogMessage: "Do you want to add column ?", addCellSentence: sentence, operationType });
    }
    else if (operationType === "delete-row") {
      this.setState({ openDialog: true, title: "Delete row", dialogMessage: "Do you want to delete row ?", addCellSentence: sentence, cellData, operationType, message: "Row deleted successfully" });
    }
    else if (operationType === "delete-column") {
      this.setState({ openDialog: true, title: "Delete column", dialogMessage: "Do you want to delete column ?", addCellSentence: sentence, cellData, operationType, message: "Column deleted successfully" });
    }
    else if (operationType === "delete-table") {
      this.setState({ openDialog: true, title: "Delete table", dialogMessage: "Do you want to delete table ?", addCellSentence: sentence, cellData, operationType, message: "Table deleted successfully" });
    }


  }

  handleDialogSave() {

    if (this.state.title === "Merge" || this.state.title === "Split") {
      this.handleApiMerge();
    }
    else if (this.state.title === "Delete Sentence") {
      this.handleDeleteSentence();
    }
    else if (this.state.title === "Add new paragraph above") {
      this.handleAddNewSentence("next", '', "text")
    }
    else if (this.state.title === "Add new paragraph below") {
      this.handleAddNewSentence("previous", '', "text")
    }
    else if (this.state.title === "Add row" || this.state.title === "Add column") {
      this.handleAddCell(this.state.addCellSentence, this.state.operationType)
    }
    else if (this.state.title === "Delete row" || this.state.title === "Delete column" || this.state.title === "Delete table") {
      this.handleDeleteTable(this.state.addCellSentence, this.state.cellData, this.state.operationType)
    }


    this.setState({ openDialog: false });
  }

  handleSuperScript(sentenceId, value, parent, token) {
    this.setState({
      selectedSentenceId: sentenceId,
      clickedSentence: value,
      selectedTableId: "",
      scrollToId: sentenceId,
      parent,
      contextToken: false,
      superScript: token,
      sText: ''
    });
    this.handleClose();
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      operation_type: "",
      mergeSentence: [],
      endSentence: "",
      startSentence: "",
      addSentence: false,
      selectedMergeSentence: []
    });
  };

  handleDialog(title, dialogMessage) {
    this.setState({ openDialog: true, title, dialogMessage });
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
      sText: ''
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

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  // handlePageChange(value) {
  //   this.setState({ pageNo: this.state.pageNo + value });
  // }
  handlePageChange(value) {
    this.setState({ pageNo: Number(this.state.pageNo) + Number(value), scrollToPage: this.state.pageNo + value });
  }

  handlePreview() {
    if (this.props.match.params.fileid) {
      history.push(`${process.env.PUBLIC_URL}/interactive-preview/${this.props.match.params.fileid}`);
    }
  }

  handleonDoubleClick(selectedSourceId, selectedSourceText, row, cell) {
    this.setState({ selectedSourceId, selectedSourceText, selectedSourceCheckText: selectedSourceText, row, cell });
  }

  handleSourceChange = evt => {
    this.setState({ selectedSourceText: evt.target.value });
  };
  handleZoomChange = value => {
    this.setState({ zoom: !this.state.zoom });
  };

  handleCheck = () => {
    const startValue = this.state.selectedSourceId.split("_");
    let sentenceObj;
    let updatedSentence;

    const text = htmlToText.fromString(this.state.selectedSourceText);
    if (this.state.selectedSourceCheckText !== text) {
      this.state.sentences.map((sentence, index) => {
        if (sentence._id === startValue[0]) {
          sentence.tokenized_sentences.map((value, index) => {
            if (value.sentence_index === Number(startValue[1])) {
              value.src = text;
              value.text = text;
              sentenceObj = sentence;
              updatedSentence = value;
            }
            sentence.text_pending = false;
            return true;
          });
          if (sentence.is_table) {
            sentence.table_items[this.state.row][this.state.cell].text = text;
          }
        }
        return true;
      });
      const { APITransport } = this.props;
      const apiObj = new InteractiveSourceUpdate(sentenceObj, updatedSentence);
      APITransport(apiObj);
    }
  };

  handleSelection(selectedSentence, event) {
    this.setState({ sText: window.getSelection().toString() })
    if (
      selectedSentence &&
      selectedSentence.startNode &&
      selectedSentence.endNode &&
      selectedSentence.pageNo &&
      window.getSelection().toString() &&
      selectedSentence.startParagraph &&
      selectedSentence.endParagraph
    ) {
      let initialIndex;
      let startSentence;
      let endIndex;
      let endSentence;
      let operation_type;
      let selectedSplitValue;
      const { pageNo } = selectedSentence;

      const startValue = selectedSentence.startNode.split("_");
      const endValue = selectedSentence.endNode.split("_");

      this.state.sentences.map((sentence, index) => {
        if (sentence._id === startValue[0]) {
          initialIndex = index;
          sentence.tokenized_sentences.map((value, index) => {
            if (value.sentence_index === Number(startValue[1])) {
              startSentence = value;
            }
            return true;
          });
        }
        if (sentence._id === endValue[0]) {
          endIndex = index;

          sentence.tokenized_sentences.map((value, index) => {
            if (value.sentence_index === Number(endValue[1])) {
              endSentence = value;
            }
            return true;
          });
        }
        return true;
      });

      const mergeSentence = this.state.sentences.slice(initialIndex, endIndex + 1);
      if (startValue[0] === endValue[0] && startValue[1] === endValue[1]) {
        const selectedSplitEndIndex = window.getSelection() && window.getSelection().getRangeAt(0).endOffset;
        operation_type = "split";
        selectedSplitValue = startSentence.src.substring(0, selectedSplitEndIndex);
      } else {
        operation_type = "merge";
        selectedSplitValue = window.getSelection().toString();
      }

      this.state.addSentence
        ? this.setState({
          mergeSentence: [...this.state.mergeSentence, ...mergeSentence],
          selectedMergeSentence: [...this.state.selectedMergeSentence, selectedSentence],
          endSentence,
          openEl: true,
          contextToken: true,
          addSentence: true,
          pageNo,
          topValue: event.clientY - 4,
          leftValue: event.clientX - 2,
          startParagraph: selectedSentence.startParagraph,
          endParagraph: selectedSentence.endParagraph
        })
        : this.setState({
          mergeSentence,
          selectedMergeSentence: [selectedSentence],
          startSentence,
          endSentence,
          operation_type,
          openEl: true,
          splitSentence: selectedSplitValue,
          contextToken: true,
          topValue: event.clientY - 2,
          leftValue: event.clientX - 2,
          pageNo,
          startParagraph: selectedSentence.startParagraph,
          endParagraph: selectedSentence.endParagraph
        });
    }
  }
  handleCopy(){
    copy( window.getSelection().toString())
                    this.handleClose()

  }
  handleAddCell(sentence, operationType) {
    if (sentence && operationType) {
      const { APITransport } = this.props;
      const apiObj = new UpdatePdfTable(sentence, operationType);
      APITransport(apiObj);
    }
    this.setState({ openEl: true, message: operationType === "add-row"? "New row added": "New column added." });
    this.handleClose();
  }

  handleDeleteSentence() {
    let startNode = this.state.startSentence;
    let endNode = this.state.endSentence;
    let sentences = [];

    let sentenceData = this.state.startParagraph.tokenized_sentences;
    sentenceData &&
      Array.isArray(sentenceData) &&
      sentenceData.length > 0 &&
      sentenceData.map(sentence => {
        if (sentence.sentence_index >= startNode.sentence_index && sentence.sentence_index <= endNode.sentence_index) {
          sentences.push(sentence);
        } else if (sentence.sentence_index <= startNode.sentence_index && sentence.sentence_index >= endNode.sentence_index) {
          sentences.push(sentence);
        }
        return true;
      });

    if (this.state.startParagraph === this.state.endParagraph && sentences && sentences.length > 0) {
      const { APITransport } = this.props;
      const apiObj = new DeleteSentence(this.state.startParagraph, sentences);
      APITransport(apiObj);
    }
    this.setState({ openEl: true, message: 'Deleted sentence successfully' });
    this.handleClose();
  }
  handleDeleteTable(paragraph, cellData, operation_type) {
    if (paragraph && cellData && operation_type) {
      const { APITransport } = this.props;
      const apiObj = new DeleteTable(paragraph, cellData, operation_type);
      APITransport(apiObj);
    }
    this.handleClose();

  }
  handlePopOverClose() {
    this.setState({ openContextMenu: false, anchorEl: null, leftValue: "", topValue: "" });
  }

  handleAddNewSentence(nodeType, sentence, selectedNodeType) {
    this.setState({ popOver: false, message: 'Added new paragraph successfully' })
    let paragraph = "";
    if (selectedNodeType === "text" && this.state.startParagraph && this.state.endParagraph) {
      paragraph = this.state.startParagraph;
    } else if (selectedNodeType === "table") {
      paragraph = sentence;
    }
    if (paragraph) {
      let req = {};
      req.type = "text";

      const { APITransport } = this.props;
      const apiObj = new InsertNewSentence(paragraph, req, nodeType);
      APITransport(apiObj);
    }
    this.handleClose();
  }

  handleAddNewTable(tablePosition, paragraph) {
    this.setState({ addNewTable: true, openEl: false, tablePosition, hoveredTable: paragraph, popOver: false, message: 'Added new table successfully' });
    this.handleClose();
  }

  handleAddTableCancel() {
    this.setState({ addNewTable: false, openEl: false, popOver: false });
    this.handleClose();
  }

  handleAddTable(rows, columns) {
    if (rows > 0 && columns > 0) {
      let sentenceNode = {};
      sentenceNode.type = "table";
      sentenceNode.row_count = rows.toString();
      sentenceNode.column_count = columns.toString();

      const { APITransport } = this.props;
      const apiObj = new InsertNewSentence(
        this.state.hoveredTable ? this.state.hoveredTable : this.state.startParagraph,
        sentenceNode,
        this.state.tablePosition
      );
      APITransport(apiObj);
      this.setState({ addNewTable: false, popOver: false, message: 'Added new table successfully' });
    }
    this.handleClose();
  }

  handlePopUp() {
    this.setState({ popOver: true })
  }

  render() {
    const { gridValue } = this.state;

    return (
      <div>
        {this.state.sentences && (
          <div>

            {!this.state.collapseToken && (
              <Grid container spacing={8} style={{ padding: "0 24px 12px 24px" }}>
                <Grid item xs={12} sm={6} lg={2} xl={2} className="GridFileDetails">
                  <Button
                    variant="outlined"
                    // size="large"
                    onClick={event => {
                      this.handleBack();
                    }}
                    style={{ textTransform: "capitalize",width: "100%", minWidth: "150px", borderRadius: '30px', color: '#233466' }}
                  >
                    <ChevronLeftIcon fontSize="large" />{translate("common.page.title.document")}
                  </Button>
                </Grid>
                <Grid item xs={false} sm={6} lg={7} xl={7} className="GridFileDetails">
                  <Button
                    variant="outlined"
                    // size="large"
                    className="GridFileDetails"
                    style={{ textTransform: "capitalize",justifyContent: 'left', height: '100%', width: "100%", overflow: "hidden", whiteSpace: "nowrap", pointerEvents: "none", borderRadius: '30px'}}
                  >
                    {/* <PlayArrowIcon fontSize="large" style={{ color: "grey" }} /> */}
                    {this.state.fileDetails && <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ color: "#909090" }}>&nbsp;&nbsp;{translate("common.page.label.source")}&nbsp;&nbsp;</div> <div>{":"}</div> <div>&nbsp;&nbsp;{this.state.fileDetails.source_lang}&nbsp;&nbsp;</div>
                    </div>}
                    <span fontSize="large" style={{ color: "grey", marginLeft: '4%', marginRight: '1%' }}>&nbsp;&nbsp; | &nbsp;&nbsp;</span>
                    {/* <PlayArrowIcon fontSize="large" style={{ color: "grey" }} />{" "} */}
                    {this.state.fileDetails && <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <div style={{ color: "#909090" }}>&nbsp;&nbsp;{translate("common.page.label.target")}&nbsp;&nbsp;</div> <div>{":"}</div> <div>&nbsp;&nbsp;{this.state.fileDetails.target_lang}&nbsp;&nbsp;</div>
                    </div>}
                    {/* <PlayArrowIcon fontSize="large" style={{ color: "grey" }} />{" "} */}
                    <span fontSize="large" style={{ color: "grey", marginLeft: '4%', marginRight: '1%' }}>&nbsp;&nbsp; | &nbsp;&nbsp;</span>

                    <div style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                      {this.state.fileDetails && <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ color: "#909090" }}>&nbsp;&nbsp;{translate("common.page.label.fileName")}&nbsp;&nbsp;</div> <div>{" : "}</div> <div>&nbsp;&nbsp;{this.state.fileDetails.process_name}&nbsp;&nbsp;</div>
                      </div>}
                    </div>
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={2} xl={2}>
                  <Button
                    variant="contained"
                    // size="large"
                    color="primary"
                    style={{ textTransform: "capitalize", width: "100%", minWidth: "110px", overflow: "hidden", whiteSpace: "nowrap", borderRadius: '30px',height:'46px' }}
                    onClick={() => this.handlePreview()}
                  >
                    <GetAppIcon  />
                    &nbsp;&nbsp;{translate("common.page.label.review/download")}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} lg={1} xl={1}>
                  <Button
                    onClick={event => {
                      this.handleDone(true, this.state.scriptSentence);
                    }}
                    variant="outlined"
                    // size="large"
                     //color="primary"
                    style={{ width: "100%", minWidth: "55px",  borderRadius: '30px', color: '#233466',height:'46px' }}
                  >
                    <DoneIcon  style={{ color: '#233466' }} />
                    &nbsp;&nbsp;{translate("common.page.label.done")}
                  </Button>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={16} style={{ padding: "0 24px 0px 24px" }}>
              {!this.state.collapse ? (
                <Grid item xs={12} sm={6} lg={gridValue} xl={gridValue} className="GridFileDetails">
                  <Paper
                    elevation={2}
                    style={{
                      // paddingBottom: "10px",
                      maxHeight: this.state.collapseToken ? window.innerHeight - 120 : window.innerHeight - 200,
                      paddingBottom: "12px"
                    }}
                  >
                    <Toolbar style={{ color: '#000000', background: '#ECEFF1' }}>
                      <Typography value="" variant="h6" gutterBottom style={{ flex: 1 }}>
                        {translate("common.page.label.source")}
                      </Typography>

                      {!this.state.collapseToken && (
                        <Toolbar
                          onClick={event => {
                            this.handleClick(true, 6);
                          }}
                          style={{ paddingRight: '0px' }}
                        >
                          <PictureAsPdfIcon style={{ cursor: "pointer", color: '#233466' }} color="primary" />
                          <Typography value="" variant="subtitle2" style={{ cursor: "pointer", color: '#233466', paddingLeft: '7px' }}>
                            {translate("intractive_translate.page.preview.compareWithOriginal")}
                          </Typography>
                        </Toolbar>
                      )}
                    </Toolbar>
                    <div
                      onContextMenu={this.handleClickv}
                      id="popUp"
                      style={{
                        maxHeight: this.state.collapseToken ? window.innerHeight - 220 : window.innerHeight - 300,
                        overflowY: "scroll",
                        padding: "24px"
                      }}
                    >
                      <EditorPaper
                      fileDetails={this.state.fileDetails}
                        paperType="source"
                        sentences={this.state.sentences}
                        hoveredSentence={this.state.hoveredSentence}
                        hoveredTableId={this.state.hoveredTableId}
                        isPreview={false}
                        header={this.state.header}
                        footer={this.state.footer}
                        handleOnMouseEnter={this.handleOnMouseEnter.bind(this)}
                        scrollToId={this.state.scrollToId}
                        scrollToPage={this.state.scrollToPage}
                        handleTableHover={this.handleTableHover.bind(this)}
                        parent={this.state.parent}
                        selectedSentenceId={this.state.selectedSentenceId}
                        selectedTableId={this.state.selectedTableId}
                        supScripts={this.state.sourceSupScripts}
                        handleSuperScript={this.handleSuperScript.bind(this)}
                        handleSentenceClick={this.handleSenetenceOnClick.bind(this)}
                        handleTableCellClick={this.handleCellOnClick.bind(this)}
                        handleSelection={this.handleSelection.bind(this)}
                        selectedMergeSentence={this.state.addSentence ? this.state.selectedMergeSentence : ""}
                        handleSourceChange={this.handleSourceChange}
                        selectedSourceText={this.state.selectedSourceText}
                        selectedSourceId={this.state.selectedSourceId}
                        handleonDoubleClick={this.handleonDoubleClick.bind(this)}
                        handleCheck={this.handleCheck}
                        handleAddCell={this.handleAddCell.bind(this)}
                        handleDeleteTable={this.handleDeleteTable.bind(this)}
                        handleAddNewTable={this.handleAddNewTable.bind(this)}
                        handleAddTableCancel={this.handleAddTableCancel.bind(this)}
                        handleAddNewSentence={this.handleAddNewSentence.bind(this)}
                        popOver={this.state.popOver}
                        handleDialog={this.handleDialogTable.bind(this)}
                        handlePopUp={this.handlePopUp.bind(this)}
                      />
                    </div>
                  </Paper>
                </Grid>
              ) : (
                  <Grid item xs={1} sm={1} lg={1} xl={1}>
                    <Paper elevation={2} style={{ height: "49px", paddingBottom: "15px" }}>
                      <Toolbar
                        onClick={event => {
                          this.handleClick(false, 4);
                        }}
                        style={{ color: '#000000', background: '#ECEFF1' }}
                      >
                        <KeyboardTabIcon color="primary" style={{ cursor: "pointer" }} /> &nbsp;&nbsp;
                      <Typography value="" variant="subtitle2" color="primary" style={{ cursor: "pointer" }}>
                          {translate("common.page.label.source")}
                        </Typography>
                      </Toolbar>
                    </Paper>
                  </Grid>
                )}

              {!this.state.collapseToken ? (
                <Grid item xs={12} sm={6} lg={4} xl={4} className="GridFileDetails">
                  <Paper elevation={2} style={{ maxHeight: window.innerHeight - 200, paddingBottom: "12px" }}>
                    <Toolbar style={{ color: '#000000', background: '#ECEFF1' }}>
                      <Typography value="" variant="h6" gutterBottom>
                        {translate("common.page.label.target")}
                      </Typography>
                    </Toolbar>

                    <div style={{ maxHeight: window.innerHeight - 300, overflowY: "scroll", padding: "24px" }}>
                      <EditorPaper
                      fileDetails={this.state.fileDetails}
                        paperType="target"
                        sentences={this.state.sentences}
                        hoveredSentence={this.state.hoveredSentence}
                        hoveredTableId={this.state.hoveredTableId}
                        isPreview={false}
                        header={this.state.header}
                        footer={this.state.footer}
                        scrollToId={this.state.scrollToId}
                        parent={this.state.parent}
                        handleOnMouseEnter={this.handleOnMouseEnter.bind(this)}
                        handleTableHover={this.handleTableHover.bind(this)}
                        selectedSentenceId={this.state.selectedSentenceId}
                        selectedTableId={this.state.selectedTableId}
                        supScripts={this.state.targetSupScripts}
                        handleSuperScript={this.handleSuperScript.bind(this)}
                        handleSentenceClick={this.handleSenetenceOnClick.bind(this)}
                        handleTableCellClick={this.handleCellOnClick.bind(this)}
                        handleSelection={this.handleSelection.bind(this)}
                      />
                    </div>
                  </Paper>
                </Grid>
              ) : (
                  <Grid item xs={12} sm={6} lg={gridValue} xl={gridValue} className="GridFileDetails">
                    <PdfPreview
                      pageNo={this.state.pageNo}
                      fileDetails={this.state.fileDetails}
                      numPages={this.state.numPages}
                      onDocumentLoadSuccess={this.onDocumentLoadSuccess.bind(this)}
                      handlePageChange={this.handlePageChange.bind(this)}
                      handleClick={this.handleClick.bind(this)}
                      handleChange={this.handleZoomChange.bind(this)}
                      zoom={this.state.zoom}
                    />
                  </Grid>
                )}
              {!this.state.collapseToken && (
                <Grid item xs={12} sm={12} lg={4} xl={4}>
                  {this.state.sentences && this.state.sentences[0] && (
                    <Editor
                      handleScriptSave={this.handleScriptSave.bind(this)}
                      superScriptToken={this.state.superScript}
                      scriptSentence={this.state.scriptSentence}
                      modelDetails={this.state.fileDetails.model}
                      hadleSentenceSave={this.handleDone.bind(this)}
                      handleSave={this.handleSave.bind(this)}
                      clickedCell={this.state.clickedCell}
                      selectedTableId={this.state.selectedTableId}
                      clickedSentence={this.state.clickedSentence}
                      handleCellOnClick={this.handleCellOnClick.bind(this)}
                      handleSenetenceOnClick={this.handleSenetenceOnClick.bind(this)}
                      submittedId={this.state.selectedSentenceId}
                      sentences={this.state.sentences}
                      handleSelectionClose={this.handleClose.bind(this)}
                    />
                  )}
                </Grid>
              )}
            </Grid>

            {this.state.addNewTable && (
              <EditorDialog
                open={true}
                rowLabel={translate("intractive_translate.page.preview.rows")}
                columnLabel={translate("intractive_translate.page.preview.columns")}
                handleAddTableCancel={this.handleAddTableCancel.bind(this)}
                handleAddTable={this.handleAddTable.bind(this)}
                handlePopUp={this.handlePopUp.bind(this)}
              ></EditorDialog>
            )}

            {this.state.openDialog && (
              <Dialog
                message={this.state.dialogMessage}
                handleSubmit={this.handleDialogSave.bind(this)}
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
                message={
                  this.state.message

                }
              />
            )}
            {this.state.sText &&
              this.state.contextToken &&
              this.state.startSentence &&
              this.state.endSentence &&
              this.state.topValue &&
              this.state.leftValue &&
              this.state.openEl && (
                <MenuItems
                  isOpen={this.state.openEl}
                  handleCopy={this.handleCopy.bind(this)}
                  anchorEl={this.state.anchorEl}
                  operation_type={this.state.operation_type}
                  addSentence={this.state.addSentence}
                  handleDialog={this.handleDialog.bind(this)}
                  handleApiMerge={this.handleApiMerge.bind(this)}
                  mergeSentence={this.state.mergeSentence}
                  handleAddSentence={this.handleAddSentence.bind(this)}
                  handleDeleteSentence={this.handleDeleteSentence.bind(this)}
                  startParagraph={this.state.startParagraph}
                  endParagraph={this.state.endParagraph}
                  topValue={this.state.topValue}
                  leftValue={this.state.leftValue}
                  handleClose={this.handleClose.bind(this)}
                  handleAddNewSentence={this.handleAddNewSentence.bind(this)}
                  handleAddNewTable={this.handleAddNewTable.bind(this)}
                  handleAddTableCancel={this.handleAddTableCancel.bind(this)}
                />
              )}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchPdfSentence: state.fetchPdfSentence,
  interactiveUpdate: state.interactiveUpdate,
  mergeSentenceApi: state.mergeSentenceApi,
  updateSource: state.updateSource,
  updatePdfTable: state.updatePdfTable,
  deleteSentence: state.deleteSentence,
  deleteTable: state.deleteTable,
  insertSentence: state.insertSentence
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      NMTApi: APITransport,
      NMTSPApi: APITransport,
      MODELApi: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IntractiveTrans));
