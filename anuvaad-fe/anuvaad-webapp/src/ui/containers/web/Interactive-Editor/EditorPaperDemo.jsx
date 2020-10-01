import React from "react";
import { withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import ContentEditable from "react-contenteditable";
import CustomTable from "../../../components/web/common/CustomTable";
// import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Popover from 'react-text-selection-popover';
import placeBelow from './placeBelow'
import placeRight from './placeRight'
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import IntractiveApi from "../../../../flux/actions/apis/intractive_translate";
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover1 from "./Menu"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = {
  paperHeader: {
    color: '#000000',
    background: '#ECEFF1',
  },
};

class EditorPaper extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      html: "",
      columns: 1,
      selectedIndex: 0,
      openContextMenu: false,
      suggestionText: "",
      suggestionSrc: "",
      suggestionId: "",
      callApi: false,
      previousPressedKeyCode: "",
      editable: false
    };
    this.handleTargetChange = this.handleTargetChange.bind(this)
  }

  componentDidMount() {
    let previousNode = null
    if (Array.isArray(this.props.sentences) &&
      this.props.sentences.length > 0) {
      this.props.sentences.map((sentence, index) => {
        if (previousNode != null && sentence.page_no == 1) {
          if (parseInt(sentence.y) < parseInt(previousNode.y_end)) {
            let difference = (previousNode.y_end - sentence.y) * 100 / previousNode.y_end
            if (difference > 30) {
              this.setState({ columns: this.state.columns + 1 })
            }
          }
        }
        previousNode = sentence
      })
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scrollToId !== this.props.scrollToId) {
      let sid = this.props.scrollToId.split("_")[0];
      if (this.refs[sid + "_" + this.props.scrollToId.split("_")[1] + "_" + this.props.paperType] && this.props.paperType !== this.props.parent) {
        if (!(this.state.contentEditableId || this.props.contentEditableId)) {
          this.refs[sid + "_" + this.props.scrollToId.split("_")[1] + "_" + this.props.paperType].scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      } else if (this.refs[sid + "_" + this.props.paperType] && this.props.paperType !== this.props.parent) {
        if (!(this.state.contentEditableId || this.props.contentEditableId)) {

          this.refs[sid + "_" + this.props.paperType].scrollIntoView({
            behavior: "smooth",
            block: "center"
          });
        }
      }
    } else if (prevProps.scrollToPage !== this.props.scrollToPage) {
      if (this.refs[this.props.scrollToPage + "_" + this.props.paperType])
        this.refs[this.props.scrollToPage + "_" + this.props.paperType].scrollIntoView({
          behavior: "smooth"
        });
    } else if (prevProps.intractiveTrans !== this.props.intractiveTrans) {
      this.setState({
        // open: true,
        showLoader: false,
        autoCompleteText: this.props.intractiveTrans[0].tgt,
        openContextMenu: true
      })
    }

    if (this.state.callApi) {
      this.fecthNextSuggestion()
    }
  }

  fetchSuperScript(supArr) {
    let supArray = [];
    if (supArr && Array.isArray(supArr) && supArr.length > 0) {
      supArr.map((supScript, index) => {
        let superScripts = this.props.supScripts;
        let sentenceId = superScripts[supScript] ? superScripts[supScript].sentence_id : "";

        supArray.push(
          <span key={index}>
            <a href="#">
              <span
                onClick={() => this.props.handleSuperScript(sentenceId + "_" + 0, "true", this.props.paperType, true)}
                title={superScripts && superScripts[supScript] ? superScripts[supScript].text : ""}
              >
                {supScript}
              </span>
            </a>
            <span>{supArr.length === index + 1 ? "" : ","}</span>
          </span>
        );
        return true;
      });
      return supArray;
    } else {
      return "";
    }
  }

  getSelectionText(event) {
    var text = "";
    let selection = {};
    var activeEl = document.activeElement;
    var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;

    if (
      activeElTagName === "textarea" ||
      (activeElTagName === "input" && /^(?:text|search|password|tel|url)$/i.test(activeEl.type) && typeof activeEl.selectionStart === "number")
    ) {
      text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection) {
      text = window.getSelection().toString();
    }

    let sentences = "";
    let startNode = "";
    let endNode = "";

    if (window.getSelection()) {
      sentences = window.getSelection();
    }
    if (
      sentences &&
      sentences.anchorNode &&
      sentences.anchorNode.parentElement &&
      sentences.anchorNode.parentElement.id &&
      sentences.anchorNode.textContent
    ) {
      startNode = window.getSelection().anchorNode.parentElement.id;
      this.props.sentences.map(paragraph => {
        if (paragraph._id === startNode.split("_")[0] && !paragraph.is_table) {
          selection.startNode = startNode;
          selection.pageNo = paragraph.page_no;
          selection.startParagraph = paragraph;
        }
        return true;
      });
    }

    if (
      sentences &&
      sentences.focusNode &&
      sentences.focusNode.parentElement &&
      sentences.focusNode.parentElement.id &&
      sentences.focusNode.textContent
    ) {
      endNode = window.getSelection().focusNode.parentElement.id;
      this.props.sentences.map(paragraph => {
        if (paragraph._id === endNode.split("_")[0] && !paragraph.is_table) {
          selection.endNode = endNode;
          selection.pageNo = paragraph.page_no;
          selection.endParagraph = paragraph;
        }
        return true;
      });
    }
    if (selection && selection.startNode && selection.endNode) {
      this.props.handleSelection(selection, event);
    }
  }

  renderPageNumber(pageNo, noOfPage) {
    return <span ref={pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small", display: "inline" }}>
      <div>&nbsp;</div>
      {pageNo !== 1 ? <hr /> : ""}Page: {pageNo}/{noOfPage}
      <span>&nbsp;</span>
    </span>
  }

  newFetchSentence(sentence, prevSentence, index, noOfPage, sArray) {
    let padding = Number(sArray[0].x) * 100 / Number(sArray[0].page_width);
    if (this.state.columns > 1 && padding > 40) {
      padding = 10
    }
    padding = (padding - 10) + "%";
    let pageNo = sArray[0].page_no;
    if (!sArray[0].is_footer && !sArray[0].is_table) {
      let printPageNo = false;
      let isFirst = false;
      if (index === 0) {
        printPageNo = true;
        isFirst = true;
      } else if (prevSentence && sentence.page_no !== prevSentence.page_no) {
        printPageNo = true;
      }


      return (
        <div>
          <span>
            {/* {printPageNo ? (
              <span ref={pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small", display: "inline" }}>
                <div>&nbsp;</div>
                {!isFirst ? <hr /> : ""}Page: {pageNo}/{noOfPage}
                <span>&nbsp;</span>
              </span>
            ) : ( */}
            <span></span>
            {/* )} */}
          </span>
          <div style={{ textAlign: "justify", paddingLeft: padding }}>

            {sArray.map(sen => (

              <span>

                <span
                  key={sen._id}
                  style={{

                    right: 0,
                    fontWeight: sen.is_bold ? "bold" : "normal",
                    textDecorationLine: sen.underline ? "underline" : "",
                    fontSize: sen.class_style['font-size']
                  }}
                  onMouseUp={this.getSelectionText.bind(this)}
                  onKeyUp={this.getSelectionText.bind(this)}
                >
                  <span style={{ textAlign: "justify", fontSize: sen.class_style['font-size'] }}>
                    {this.fetchTokenizedSentence(sen, true, index)}
                    {sen.sup_array ? (
                      <sup>
                        <span>{this.fetchSuperScript(sen.sup_array)}</span>
                      </sup>
                    ) : (
                        ""
                      )}

                  </span>
                </span>
              </span>
            ))}
            <br /><br />
          </div></div>)
    } else if (sentence.is_table) {
      // return this.fetchTable(sentence._id, sentence.table_items, prevSentence, index, pageNo, noOfPage)
      return (
        <CustomTable
          id={sentence._id}
          tableItems={sentence.table_items}
          isPreview={this.props.isPreview}
          hoveredTableId={this.props.hoveredTableId}
          selectedTableId={this.props.selectedTableId}
          scrollToId={this.props.scrollToId}
          scrollToPage={this.props.scrollToPage}
          prevSentence={prevSentence}
          tableIndex={index}
          pageNo={pageNo}
          noOfPage={noOfPage}
          paperType={this.props.paperType}
          handleOnMouseEnter={this.tableHoverOn.bind(this)}
          handleOnMouseLeave={this.tableHoverOff.bind(this)}
          handleTableCellClick={this.handleTableOnCLick.bind(this)}
          handleAddCell={this.props.handleAddCell}
          handleDialog={this.props.handleDialog}
          sentence={sentence}
          handleSourceChange={this.props.handleSourceChange}
          selectedSourceText={this.props.selectedSourceText}
          selectedSourceId={this.props.selectedSourceId}
          handleonDoubleClick={this.handleonDoubleClick.bind(this)}
          handleCheck={this.props.handleCheck}
          handleDeleteTable={this.props.handleDeleteTable}
          handleAddNewTable={this.props.handleAddNewTable}
          handleAddTableCancel={this.props.handleAddTableCancel}
          handleAddNewSentence={this.props.handleAddNewSentence}
          parent={this.props.parent}
          popOver={this.props.popOver}
          handlePopUp={this.props.handlePopUp}
          contentEditableId={this.state.contentEditableId}
        ></CustomTable>
      );
    } else {
      return <div></div>;
    }
  }

  handleTargetChange(refId, event, sentence, tokenText, tokenIndex, senIndex) {
    var selObj = window.getSelection();
    var range = selObj.getRangeAt(0)
    var boundary = range.getBoundingClientRect();
    if (boundary) {
      this.setState({
        topValue: boundary.y + 15,
        leftValue: boundary.x + 5
      })
    }
    if (event.key === 'Escape') {
      this.props.handleEditor(null, this.props.paperType)
      this.setState({
        contentEditableId: null,
        selectedIndex: 0,
        editable: false
      })
    }
    else if (event.key === 'Tab') {
      event.preventDefault()
    }
    if (((event.key === ' ' || event.key === 'Spacebar') && this.state.previousKeyPressed === 'Shift')) {
      // if (((event.key === ' ' || event.key === 'Spacebar') && (this.state.previousKeyPressed === 'Control' || this.state.previousKeyPressed === "Command"))) {
      let editableDiv = this.refs[refId]
      var caretPos = 0,
        sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = range.endOffset;
          }
        }
      } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
          var tempEl = document.createElement("span");
          editableDiv.insertBefore(tempEl, editableDiv.firstChild);
          var tempRange = range.duplicate();
          tempRange.moveToElementText(tempEl);
          tempRange.setEndPoint("EndToEnd", range);
          caretPos = tempRange.text.length;
        }
      }
      let targetVal = this.handleCalc(editableDiv.textContent.substring(0, caretPos), tokenText)
      const apiObj = new IntractiveApi(tokenText.src, targetVal, this.props.modelDetails, true, true);
      this.props.APITransport(apiObj);
      this.setState({
        anchorEl: event.currentTarget,
        caretPos: caretPos,
        targetVal: editableDiv.textContent.substring(0, caretPos),
        tokenIndex,
        showLoader: true,
        senIndex,
        suggestionSrc: tokenText.src,
        suggestionId: this.props.modelDetails
      })
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'Enter') {
      // if (event.key === 'ArrowUp') {
      //   if (this.state.selectedIndex !== 0) {
      //     this.setState({
      //       selectedIndex: this.state.selectedIndex - 1
      //     })
      //   }
      // }
      // else if (event.key === 'ArrowDown') {
      //   if (this.state.selectedIndex !== this.state.autoCompleteText.length - 1)
      //     this.setState({
      //       selectedIndex: this.state.selectedIndex + 1
      //     })
      // }
      if (event.key === 'Enter') {
        if (this.state.open) {
          this.handleUpdateSentenceWithPrediction()
        }
      }
      event.preventDefault()
    }
    else {
      this.setState({
        open: false,
        showLoader: false
      })
    }
    this.setState({
      previousKeyPressed: event.key,
      previousPressedKeyCode: event.keyCode
    })
  }

  handleDataSave(i) {
    this.handleUpdateSentenceWithPrediction(i)
  }

  handlePopOverClose() {
    var el = document.getElementById("editable")
    var range = document.createRange()
    var sel = window.getSelection()

    if (el.childNodes[0].textContent.length < this.state.caretPos) {
      range.setStart(el.childNodes[0], el.childNodes[0].textContent.length - 1)
    } else {
      range.setStart(el.childNodes[0], this.state.caretPos)
    }
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
    this.setState({ caretPos: this.state.caretPos })

    this.setState({ openContextMenu: false })
  }

  fecthNextSuggestion() {
    const apiObj = new IntractiveApi(this.state.suggestionSrc, this.state.suggestionText, this.state.suggestionId, true, true);
    this.props.APITransport(apiObj);
    this.setState({ callApi: false })
  }

  handleUpdateSentenceWithPrediction(selectedText) {
    this.setState({
      open: false,
      showLoader: false,
      openContextMenu: false
    })



    var self = this
    setTimeout(() => {
      var sentences = Object.assign([], this.state.sentences ? this.state.sentences : this.props.sentences)
      // sentences[this.state.senIndex]['tokenized_sentences'][this.state.tokenIndex].target = this.state.targetVal + this.state.autoCompleteText[index].substring(this.state.caretPos)
      sentences[this.state.senIndex]['tokenized_sentences'][this.state.tokenIndex].target = this.state.targetVal + selectedText
      self.setState({
        sentences: sentences,
        selectedIndex: 0,
        suggestionText: this.state.targetVal + selectedText,

        callApi: true,
        targetVal: this.state.targetVal + selectedText,
        // caretPos: this.state.caretPos + selectedText.length
      })
      document.activeElement.blur()
    }, 50)

    setTimeout(() => {
      this.setCaretPosition(selectedText)

    }, 100)

    setTimeout(() => {
      this.setState({ showLoader: true })
      this.fetchCursorPosition()
    }, 250)
  }

  fetchCursorPosition() {
    var selObj = window.getSelection();
    var range = selObj.getRangeAt(0)
    var boundary = range.getBoundingClientRect();
    if (boundary) {
      this.setState({
        topValue: boundary.y + 15,
        leftValue: boundary.x + 5
      })
    }
  }

  setCaretPosition(data) {
    // var elem = this.refs[this.state.contentEditableId + "_target"]
    // let elem = document.getElementById()
    // console.log(this.state.contentEditableId)
    // caretPos = this.state.caretPos
    // if(elem != null) {
    //     if(elem.createTextRange) {
    //         var range = elem.createTextRange();
    //         debugger
    //         range.move('character', caretPos);
    //         range.select();
    //     }
    //     else {
    //         if(elem.selectionStart) {
    //             elem.focus();
    //             debugger
    //             elem.setSelectionRange(caretPos, caretPos);
    //         }
    //         else
    //            { elem.focus();
    //             elem.selectionStart = caretPos 
    //             elem.selectionEnd = caretPos+1
    //             debugger
    //           }
    //     }
    // } else {
    //   debugger
    // }

    var el = document.getElementById("editable")
    var range = document.createRange()
    var sel = window.getSelection()

    if (el.childNodes[0].textContent.length < this.state.caretPos + data.length) {
      range.setStart(el.childNodes[0], el.childNodes[0].textContent.length - 1)
    } else {
      range.setStart(el.childNodes[0], this.state.caretPos + data.length)
    }
    range.collapse(true)

    sel.removeAllRanges()
    sel.addRange(range)
    this.setState({ caretPos: this.state.caretPos + data.length })
  }

  handleCalc(value, tokenText) {
    const temp = value.split(" ");
    const tagged_tgt = tokenText.tagged_tgt.split(" ");
    const tagged_src = tokenText.tagged_src.split(" ");
    const tgt = tokenText.target && tokenText.target.split(" ");
    const src = tokenText.src && tokenText.src.split(" ");
    const resultArray = [];
    let index;
    temp.map(item => {
      if (item !== " ") {
        const ind = tgt.indexOf(item, resultArray.length);
        const arr = [item, `${item},`, `${item}.`];
        let src_ind = -1;
        arr.map((el, i) => {
          if (src_ind === -1) {
            src_ind = src.indexOf(el);
            index = i;
          }
          return true;
        });
        if (ind !== -1) {
          resultArray.push(tagged_tgt[ind]);
        } else if (src_ind !== -1) {
          if (index > 0) {
            if (src_ind > tagged_src.length - 1) {
              src_ind = tagged_src.length - 1
            }
            const tem = tagged_src[src_ind];
            resultArray.push(tem.slice(0, tem.length - 1));
          } else {
            resultArray.push(tagged_src[src_ind]);
          }
        } else {
          resultArray.push(item);
        }
      } else {
        resultArray.push(item);
      }
      return true;
    });
    return resultArray.join(" ");
  }

  fetchTokenizedSentence(sentence, isSpaceRequired, senIndex) {
    if (sentence.tokenized_sentences && Array.isArray(sentence.tokenized_sentences) && sentence.tokenized_sentences.length > 0) {
      let sentenceArray = [];
      if (this.props.paperType === "source") {

        sentence.tokenized_sentences.map(tokenText => {
          if (tokenText.status !== "DELETED" && tokenText.src) {
            let color = "";
            let textColor = "";
            if (this.props.selectedMergeSentence && Array.isArray(this.props.selectedMergeSentence) && this.props.selectedMergeSentence.length > 0) {
              this.props.selectedMergeSentence.map(sentenceText => {
                if (
                  sentence._id + "_" + tokenText.sentence_index === sentenceText.startNode ||
                  sentence._id + "_" + tokenText.sentence_index === sentenceText.endNode
                ) {
                  color = "red";
                  textColor = "white";
                }
                return true;
              });
            }

            let bgColor = !this.props.isPreview
              ? this.props.hoveredSentence === sentence._id + "_" + tokenText.sentence_index
                ? "yellow"
                : color
                  ? color
                  : this.props.selectedSentenceId === sentence._id + "_" + tokenText.sentence_index
                    ? "#4dffcf"
                    : ""
              : "";
            if (bgColor === "yellow" || bgColor === "#4dffcf") {
              textColor = "black";
            }
            sentenceArray.push(
              <div style={this.props.contentEditableId === sentence._id + "_" + tokenText.sentence_index ? { border: '1px solid #1C9AB7', padding: '1%', backgroundColor: "#F4FDFF" } : {}}>

              <span key={sentence._id + "_" + tokenText.sentence_index}>
                {" "}
                <span
                  id={sentence._id + "_" + tokenText.sentence_index}
                  key={sentence._id + "_" + tokenText.sentence_index}
                  style={
                    sentence.text_pending && this.props.selectedSourceId !== sentence._id + "_" + tokenText.sentence_index
                      ? { border: "1px solid #aaa", padding: "7px 49.5%", borderColor: "orange" }
                      : {
                        fontWeight: sentence.is_bold ? "bold" : "normal",
                        textDecorationLine: sentence.underline ? "underline" : "",
                        backgroundColor: !this.props.contentEditableId ? bgColor : "",
                        color: textColor ? textColor : ""
                      }
                  }
                  ref={sentence._id + "_" + tokenText.sentence_index + "_" + this.props.paperType}
                  key={sentence._id + "_" + tokenText.sentence_index}
                  onDoubleClick={event => this.props.handleonDoubleClick(sentence._id + "_" + tokenText.sentence_index, tokenText.text, event)}
                  onClick={event => {
                    sentence.text_pending
                      ? this.props.handleonDoubleClick(sentence._id + "_" + tokenText.sentence_index, tokenText.text)
                      : this.handleOnClick(sentence._id + "_" + tokenText.sentence_index, sentence.page_no);
                  }}
                  onMouseEnter={() => this.hoverOn(sentence._id + "_" + tokenText.sentence_index, sentence.page_no)}
                  onMouseLeave={() => this.hoverOff()}
                >
                  {this.props.selectedSourceId === sentence._id + "_" + tokenText.sentence_index ? (
                    <ContentEditable
                      html={this.props.selectedSourceText}
                      disabled={false}
                      onBlur={this.props.handleCheck}
                      onChange={this.props.handleSourceChange}
                      style={{
                        border: "1px dashed #aaa",
                        padding: "5px"
                      }}
                    />
                  ) : (
                      tokenText.text
                    )}
                </span>
                {isSpaceRequired ? <span>&nbsp;</span> : <span></span>}
              </span></div>
            );
            return true;
          } else {
            return true;
          }
        });
        return sentenceArray;
      }
      if (this.props.paperType === "target") {
        sentence.tokenized_sentences.map((tokenText, tokenIndex) => {
          if (tokenText.status !== "DELETED") {
            let id = sentence._id + "_" + tokenText.sentence_index + "_editable"
            sentenceArray.push(
              <div style={this.state.contentEditableId === sentence._id + "_" + tokenText.sentence_index && this.state.editable ? { border: '1px solid #1C9AB7', padding: '1%', backgroundColor: "#F4FDFF" } : {}}>
                <span
                  id={this.state.contentEditableId === sentence._id + "_" + tokenText.sentence_index ? "editable" : sentence._id + "_" + tokenText.sentence_index}

                  ref={sentence._id + "_" + tokenText.sentence_index + "_" + this.props.paperType}
                  style={{
                    fontWeight: sentence.is_bold ? "bold" : "normal",
                    textDecorationLine: sentence.underline ? "underline" : "",
                    outline: 'none',
                    backgroundColor:
                      (this.props.hoveredSentence === sentence._id + "_" + tokenText.sentence_index && this.state.contentEditableId !== sentence._id + "_" + tokenText.sentence_index && !this.state.contentEditableId)
                        ? "yellow"
                        : (this.props.selectedSentenceId === sentence._id + "_" + tokenText.sentence_index && this.state.contentEditableId !== sentence._id + "_" + tokenText.sentence_index && !this.state.contentEditableId)
                          ? "#4dffcf"
                          : ""
                  }}
                  contentEditable={this.state.contentEditableId === sentence._id + "_" + tokenText.sentence_index && this.state.editable ? true : false}
                  onKeyDown={(event) => this.handleTargetChange(sentence._id + "_" + tokenText.sentence_index + "_" + this.props.paperType, event, sentence, tokenText, tokenIndex, senIndex)}
                  // onBlur={this.handleTargetChange.bind(this)}
                  onClick={(e) => {
                    this.handleOnClickTarget(e, sentence._id + "_" + tokenText.sentence_index, sentence.page_no, sentence._id + "_" + tokenText.sentence_index + "_" + this.props.paperType)
                  }}
                  key={this.state.contentEditableId ? id : sentence._id + "_" + tokenText.sentence_index}
                  // onClick={() => this.handleOnClick(sentence._id + "_" + tokenText.sentence_index, sentence.page_no)}
                  onMouseEnter={() => this.hoverOn(sentence._id + "_" + tokenText.sentence_index, sentence.page_no)}
                  onDoubleClick={event => {
                    this.setState({ contentEditableId: sentence._id + "_" + tokenText.sentence_index, editable: true });
                      this.handleOnDoubleClickTarget(event, sentence._id + "_" + tokenText.sentence_index, sentence.page_no, sentence._id + "_" + tokenText.sentence_index + "_" + this.props.paperType)
                    // this.props.handleonDoubleClick(sentence._id + "_" + tokenText.sentence_index, tokenText.target, event, null, 'target')
                  }}
                  onMouseLeave={() => this.hoverOff()}
                >
                  {tokenText.target}
                </span>
                {isSpaceRequired ? <span>&nbsp;</span> : <span></span>}
              </div>
            );
          }
          return true;
        });
        return sentenceArray;
      }
    }
  }

  fetchSentence(sentence, prevSentence, index, noOfPage) {
    let align = sentence.align === "CENTER" ? "center" : sentence.align === "RIGHT" ? "right" : "left";
    let pageNo = sentence.page_no;

    if (!sentence.is_footer && !sentence.is_table) {
      let printPageNo = false;
      let isFirst = false;
      if (index === 0) {
        printPageNo = true;
        isFirst = true;
      } else if (prevSentence && sentence.page_no !== prevSentence.page_no) {
        printPageNo = true;
      }

      if (sentence.is_ner && !sentence.is_new_line) {
        if (align === "left") {
          return (
            <div>
              {printPageNo ? (
                <div ref={pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small" }}>
                  <div>&nbsp;</div>
                  {!isFirst ? <hr /> : ""}Page: {pageNo}/{noOfPage}
                  <div>&nbsp;</div>
                </div>
              ) : (
                  <div></div>
                )}
              <div
                key={sentence._id}
                ref={sentence._id + "_" + this.props.paperType}
                style={{
                  width: "60%",
                  float: align,
                  textAlign: align,
                  display: "inline-block",
                  fontWeight: sentence.is_bold ? "bold" : "normal",
                  textDecorationLine: sentence.underline ? "underline" : ""
                }}
                onMouseUp={this.getSelectionText.bind(this)}
                onKeyUp={this.getSelectionText.bind(this)}
              >
                {this.fetchTokenizedSentence(sentence, false, index)}
                <sup>{this.fetchSuperScript(sentence.sup_array)}</sup>
              </div>
            </div>
          );
        } else {
          return (
            <div>
              {printPageNo ? (
                <div ref={pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small" }}>
                  <div>&nbsp;</div>
                  {!isFirst ? <hr /> : ""}Page: {pageNo}/{noOfPage}
                  <div>&nbsp;</div>
                </div>
              ) : (
                  <div></div>
                )}
              <div
                key={sentence._id}
                ref={sentence._id + "_" + this.props.paperType}
                style={{
                  float: align,
                  textAlign: align,
                  display: "inline-block",
                  fontWeight: sentence.is_bold ? "bold" : "normal",
                  textDecorationLine: sentence.underline ? "underline" : ""
                }}
                onMouseUp={this.getSelectionText.bind(this)}
                onKeyUp={this.getSelectionText.bind(this)}
              >
                {this.fetchTokenizedSentence(sentence, false, index)}
                <sup>{this.fetchSuperScript(sentence.sup_array)}</sup>
              </div>
            </div>
          );
        }
      } else if (sentence.is_ner) {
        return (
          <div>
            {printPageNo ? (
              <div ref={pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small" }}>
                <div>&nbsp;</div>
                {!isFirst ? <hr /> : ""}Page: {pageNo}/{noOfPage}
                <div>&nbsp;</div>
              </div>
            ) : (
                <div></div>
              )}
            <div key={sentence._id} style={{ textAlign: "justify" }}>
              <div
                ref={sentence._id + "_" + this.props.paperType}
                key={sentence._id}
                style={{
                  textAlign: align,
                  fontWeight: sentence.is_bold ? "bold" : "normal",
                  textDecorationLine: sentence.underline ? "underline" : ""
                }}
                onMouseUp={this.getSelectionText.bind(this)}
                onKeyUp={this.getSelectionText.bind(this)}
              >
                {this.fetchTokenizedSentence(sentence, false, index)}
                <sup>{this.fetchSuperScript(sentence.sup_array)}</sup>
              </div>{" "}
              <div style={{ width: "100%" }}>
                <br />
                &nbsp;
                <br />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            {printPageNo ? (
              <div ref={pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small" }}>
                <div>&nbsp;</div>
                {!isFirst ? <hr /> : ""}Page: {pageNo}/{noOfPage}
                <div>&nbsp;</div>
              </div>
            ) : (
                <div></div>
              )}
            <div
              key={sentence._id}
              style={{
                textAlign: align,
                right: 0,
                fontWeight: sentence.is_bold ? "bold" : "normal",
                textDecorationLine: sentence.underline ? "underline" : ""
              }}
              onMouseUp={this.getSelectionText.bind(this)}
              onKeyUp={this.getSelectionText.bind(this)}
            >
              <div style={{ textAlign: "justify" }}>
                {this.fetchTokenizedSentence(sentence, true, index)}
                {sentence.sup_array ? (
                  <sup>
                    <span>{this.fetchSuperScript(sentence.sup_array)}</span>
                  </sup>
                ) : (
                    ""
                  )}
                <br />
                <br />
              </div>
            </div>
          </div>
        );
      }
    } else if (sentence.is_table) {
      // return this.fetchTable(sentence._id, sentence.table_items, prevSentence, index, pageNo, noOfPage)
      return (
        <CustomTable
          id={sentence._id}
          tableItems={sentence.table_items}
          isPreview={this.props.isPreview}
          hoveredTableId={this.props.hoveredTableId}
          selectedTableId={this.props.selectedTableId}
          scrollToId={this.props.scrollToId}
          scrollToPage={this.props.scrollToPage}
          prevSentence={prevSentence}
          tableIndex={index}
          pageNo={pageNo}
          noOfPage={noOfPage}
          paperType={this.props.paperType}
          handleOnMouseEnter={this.tableHoverOn.bind(this)}
          handleOnMouseLeave={this.tableHoverOff.bind(this)}
          handleTableCellClick={this.handleTableOnCLick.bind(this)}
          handleAddCell={this.props.handleAddCell}
          handleDialog={this.props.handleDialog}
          sentence={sentence}
          handleSourceChange={this.props.handleSourceChange}
          selectedSourceText={this.props.selectedSourceText}
          selectedSourceId={this.props.selectedSourceId}
          handleonDoubleClick={this.handleonDoubleClick.bind(this)}
          handleCheck={this.props.handleCheck}
          handleDeleteTable={this.props.handleDeleteTable}
          handleAddNewTable={this.props.handleAddNewTable}
          handleAddTableCancel={this.props.handleAddTableCancel}
          handleAddNewSentence={this.props.handleAddNewSentence}
          parent={this.props.parent}
          popOver={this.props.popOver}
          handlePopUp={this.props.handlePopUp}
          contentEditableId={this.state.contentEditableId}
        ></CustomTable>
      );
    } else {
      return <div></div>;
    }
  }
  hoverOn(e, pageNo) {
    if (!this.props.isPreview) {
      this.props.handleOnMouseEnter(e, this.props.paperType, pageNo);
    }
  }

  hoverOff() {
    if (!this.props.isPreview) {
      this.props.handleOnMouseEnter("");
    }
  }

  tableHoverOn(sentenceId, tableId, pageNo, paragraph) {
    if (!this.props.isPreview) {
      this.props.handleTableHover(sentenceId, tableId, this.props.paperType, pageNo, paragraph);
    }
  }

  tableHoverOff() {
    if (!this.props.isPreview) {
      this.props.handleTableHover("", "");
    }
  }

  handleonDoubleClick(id, value, row, cell) {
    this.props.handleonDoubleClick(id, value, row, cell);
  }

  handleOnClick(id, pageNo) {
    if (!this.props.isPreview) {
      if (id) {
        this.props.handleSentenceClick(id, true, this.props.paperType, pageNo);
      }
    }
    this.props.handleEditor(id, this.props.paperType)
    this.setState({
      contentEditableId: id,
      open: false,
      showLoader: false
    })
  }

  handleOnClickTarget(e, id, pageNo, ref) {
    // if (!this.props.isPreview) {
    //   if (id) {
    //     this.props.handleSentenceClick(id, true, this.props.paperType, pageNo);
    //   }
    // }
    this.setState({
      // contentEditableId: id,
      open: false,
      showLoader: false,
      topValue: e.clientY + 15,
      leftValue: e.clientX + 5
    })

    this.refs[ref].focus()
  }

  handleOnDoubleClickTarget(e, id, pageNo, ref) {
    // if (!this.props.isPreview) {
    //   if (id) {
    //     this.props.handleSentenceClick(id, true, this.props.paperType, pageNo);
    //   }
    // }
    this.props.handleEditor(id, this.props.paperType)
    this.setState({
      // contentEditableId: id,
      open: false,
      showLoader: false,
    })
    setTimeout(() => { this.refs[ref].focus() }, 100)
  }

  handleTableOnCLick(id, blockId, clisckedCell, value, parent, pageNo, next_previous) {
    this.props.handleTableCellClick(id, blockId, clisckedCell, value, parent, pageNo, next_previous);
  }

  render() {
    let { sentences, header, footer } = this.props;
    // if (this.state.sentences) {
    //   sentences = this.state.sentences
    // }
    let sArray = []
    let elems = []
    return (
      <div onClick={() => this.setState({
        open: false,
        showLoader: false
      })}
        style={{
          maxHeight: window.innerHeight - 300,
          overflowY: this.state.contentEditableId || this.props.contentEditableId ? 'hidden' : 'scroll',
          paddingRight: "24px"
        }}>
        {header ? (
          <div style={{ color: "grey", fontSize: "small" }}>
            <Grid container>
              <Grid item xs={12} sm={8} lg={6} xl={6}>
                {header}
              </Grid>
              {/* <Grid item sm={4} lg={6} xl={6}>{"test"}
                            </Grid> */}
            </Grid>
            <br />
          </div>
        ) : (
            <div></div>
          )}
        <div style={{ paddingLeft: "20px" }}>
          {this.props.fileDetails && (this.props.fileDetails.api_version === 2 || this.props.fileDetails.api_version === 3)
            ? sentences &&
            Array.isArray(sentences) &&
            sentences.length > 0 &&
            sentences.map((sentence, index) => {

              sArray.push(sentence)
              let fontValue = Number(sentence.class_style['font-size'].split('px')[0])
              // if ((index !== sentences.length - 1 && sentences[index + 1].y !== sentence.y) || index === sentences.length - 1) {
              if ((index !== sentences.length - 1 && ((fontValue + Number(sentence.y_end) < Number(sentences[index + 1].y) || sentence.page_no != sentences[index + 1].page_no))) || index === sentences.length - 1) {
                let a = this.newFetchSentence(sentence, sentences[index - 1], index, sentences[sentences.length - 1].page_no, sArray);
                sArray = []
                elems.push(a);
              }
              if (index == sentences.length - 1 || sentence.page_no != sentences[index + 1].page_no) {
                let elemArray = elems
                elems = []
                return <div><p>{this.renderPageNumber(sentence.page_no, sentences[sentences.length - 1].page_no)}</p><div style={{ columnCount: this.state.columns }}><p>{elemArray}</p></div></div>
              }

              // }



            })
            : sentences &&
            Array.isArray(sentences) &&
            sentences.length > 0 &&
            sentences.map((sentence, index) => {
              return this.fetchSentence(sentence, sentences[index - 1], index, sentences[sentences.length - 1].page_no);
            })}
          <Popover isOpen={this.state.open} containerNode={this.state.anchorEl} placementStrategy={placeBelow}>
            {this.state.autoCompleteText ? this.state.autoCompleteText.map((at, index) => {
              return <Typography
                title={"Press enter to select the text"}

                style={{
                  padding: '2%',
                  display: 'block',
                  maxWidth: '450px',
                  wordWrap: 'break-word', cursor: 'not-allowed', fontSize: '15px', zIndex: 999, backgroundColor: this.state.selectedIndex == index ? '#ECEFF1' : 'white'
                }} selected={true}>{at.substring(this.state.caretPos)}</Typography>
            })
              : <div></div>
            }

          </Popover>
          {this.state.openContextMenu && this.props.paperType === "target" && this.state.autoCompleteText && <Popover1
            isOpen={this.state.openContextMenu}
            topValue={this.state.topValue}
            leftValue={this.state.leftValue}
            anchorEl={this.state.anchorEl}
            handleOnClick={this.handleDataSave.bind(this)}
            handlePopOverClose={this.handlePopOverClose.bind(this)}
            tableItems={this.state.tableItems}
            tableValues={this.state.tableTitles}
            handlePopUp={this.props.handlePopUp}
            caretPos={this.state.caretPos}
            options={this.state.autoCompleteText}
            paperType={this.props.paperType}
            targetVal={this.state.targetVal}
          >

          </Popover1>}
          <Popover isOpen={this.state.showLoader} containerNode={this.state.anchorEl} placementStrategy={placeRight} >
            <CircularProgress
              disableShrink
              size={18}
              thickness={8}
              style={{ marginLeft: "15px" }}
            />
          </Popover>
        </div>
        {footer ? (
          <div>
            <hr></hr>
            <div style={{ color: "grey" }}>
              <Grid container>
                <Grid item xs={12} sm={8} lg={6} xl={6}>
                  {footer}
                </Grid>
              </Grid>
            </div>
          </div>
        ) : (
            <div></div>
          )}

      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  intractiveTrans: state.intractiveTrans
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

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(EditorPaper)));