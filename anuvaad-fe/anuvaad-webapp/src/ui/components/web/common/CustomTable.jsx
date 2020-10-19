import React from "react";
import ContentEditable from "react-contenteditable";
import PopOver from "./Popover";

class CustomTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openContextMenu: false,
      anchorEl: null,
      selectedRow: "",
      selectedColumn: "",
      topValue: "",
      leftValue: ""
      // tableItems:['add-row','add-column','delete-row','delete-column','delete-table'],
      // tableTitles:[translate("intractive_translate.page.preview.insertNewRow"), translate("intractive_translate.page.preview.insertNewColumn"),translate("intractive_translate.page.preview.deleteRow"),translate("intractive_translate.page.preview.deleteColumn"),translate("intractive_translate.page.preview.deleteTable")]
    };
    this.handleMenu = this.handleMenu.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.scrollToId !== this.props.scrollToId) {
      let sid = this.props.scrollToId.split("_")[0];
      if (this.refs[sid + "_" + this.props.scrollToId.split("_")[1] + "_" + this.props.paperType] && this.props.paperType !== this.props.parent) {
        if (!(this.props.contentEditableId || this.props.contentEditableId)) {
        this.refs[sid + "_" + this.props.scrollToId.split("_")[1] + "_" + this.props.paperType].scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
      } else if (this.refs[sid + "_" + this.props.paperType] && this.props.paperType !== this.props.parent) {
        if (!(this.props.contentEditableId || this.props.contentEditableId)) {
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
    }
  }

  fetchTable(id, sentences, prevSentence, tableIndex, pageNo) {
    let tableRow = [];
    let index = 0;

    for (let row in sentences) {
      let col = [];
      let isHeightRequired = false;
      for (let block in sentences[row]) {
        if (sentences[row][block].status !== "DELETED") {
          let blockData = this.props.paperType === "source" ? sentences[row][block].text : sentences[row][block].target;
          let blockId = id + "_" + sentences[row][block].sentence_index;
          let bgColor = !this.props.isPreview
            ? this.props.hoveredTableId === blockId
              ? "yellow"
              : this.props.selectedTableId === blockId
              ? "#4dffcf"
              : ""
            : "";

          if (!blockData) {
            isHeightRequired = true;
          }
          col.push(
            <td
              id={blockId + "_" + row + "_" + block}
              key={blockId + "_" + row + "_" + block}
              ref={blockId + "_" + row + "_" + block}
              onContextMenu={e => {
                e.preventDefault();
                this.handleMenu(e);
                return false;
              }}
              onClick={() => this.props.handleTableCellClick(id, blockId, sentences[row][block], "true", this.props.paperType, pageNo)}
              onMouseEnter={() => this.props.handleOnMouseEnter(id, blockId, pageNo, this.props.sentence)}
              onMouseLeave={() => this.props.handleOnMouseLeave()}
              onDoubleClick={() => this.props.paperType === "source" && this.props.handleonDoubleClick(blockId, blockData, row, block)}
              style={{ backgroundColor: bgColor, padding: "8px", border: "1px solid black", borderCollapse: "collapse", minWidth: "25px" }}
            >
              {this.props.selectedSourceId === blockId && this.props.paperType === "source" ? (
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
                blockData
              )}
            </td>
          );
        }
      }

      if (!isHeightRequired) {
        tableRow.push(<tr key={index}>{col}</tr>);
      } else {
        tableRow.push(
          <tr style={{ height: "36px" }} key={index}>
            {col}
          </tr>
        );
      }
      index++;
    }
    return tableRow;
  }

  handleMenu(e) {
    let row = e.target.id.split("_")[2];
    let column = e.target.id.split("_")[3];
    this.props.handlePopUp()
    this.setState({
      openContextMenu: true,
      anchorEl: e.currentTarget,
      selectedRow: row,
      selectedColumn: column,
      topValue: e.clientY - 4,
      leftValue: e.clientX - 2
    });
  }

  handleOnClick(sentence, operationType) {
    if (this.state.openContextMenu && (operationType === "add-column" || operationType === "add-row")) {
        this.props.handleDialog(sentence,"", operationType);
    } else if (
      this.state.openContextMenu &&
      (operationType === "delete-row" || operationType === "delete-column" || operationType === "delete-table")
    ) {
      if (this.state.selectedRow && this.state.selectedColumn) {
        let cellData = sentence.table_items[this.state.selectedRow][this.state.selectedColumn];
        this.props.handleDialog(sentence, cellData, operationType);
      }
    }
    this.setState({ openContextMenu: false, anchorEl: null, leftValue: "", topValue: "" });
  }

  handlePopOverClose() {
    this.setState({ openContextMenu: false, anchorEl: null, leftValue: "", topValue: "" });
  }

  render() {
    let printPageNo = false;
    if (this.props.tableIndex === 0) {
      printPageNo = true;
    } else if (this.props.prevSentence && this.props.tableItems[0][0].page_no !== this.props.prevSentence.page_no) {
      printPageNo = true;
    }

    let sentence = this.props.sentence;
    return (
      <div>
        {printPageNo ? (
          <div ref={this.props.pageNo + "_" + this.props.paperType} style={{ textAlign: "right", color: "grey", fontSize: "small" }}>
            {!this.props.isFirst ? <hr /> : ""}Page: {this.props.pageNo}/{this.props.noOfPage}
            <div>&nbsp;</div>
          </div>
        ) : (
          <div></div>
        )}
        <table
          id={this.props.id}
          key={this.props.id}
          ref={this.props.id + "_" + this.props.paperType}
          style={{ marginBottom: "20px", border: "1px solid black", borderCollapse: "collapse", width: "100%" }}
        >
          <tbody>{this.fetchTable(this.props.id, this.props.tableItems, this.props.prevSentence, this.props.tableIndex, this.props.pageNo)}</tbody>
        </table>
        {this.props.paperType === "source" && this.state.topValue && this.state.leftValue && this.props.popOver && (
          <PopOver
            id={this.props.id}
            sentence={sentence}
            isOpen={this.state.openContextMenu}
            topValue={this.state.topValue}
            leftValue={this.state.leftValue}
            anchorEl={this.state.anchorEl}
            handleOnClick={this.handleOnClick.bind(this)}
            handlePopOverClose={this.handlePopOverClose.bind(this)}
            tableItems={this.state.tableItems}
            tableValues={this.state.tableTitles}
            handleAddNewTable={this.props.handleAddNewTable}
            handleAddTableCancel={this.props.handleAddTableCancel}
            handleAddNewSentence={this.props.handleAddNewSentence}
            handlePopUp={this.props.handlePopUp}
          ></PopOver>
        )}
      </div>
    );
  }
}

export default CustomTable;
