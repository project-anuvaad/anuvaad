import React from "react";
import PopOver from "./EditorPopover";
import Dialog from "../../../components/web/common/SimpleDialog";

class EditorTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openContextMenu: false,
      anchorEl: null,
      selectedRow: "",
      selectedColumn: "",
      topValue: "",
      leftValue: "",
      selectedTable: "",
      openDialog: false,
      dialogMessage: "",
      operationType: ""
    };
  }

  fetchBlockData(data) {
    if (data && data.length > 0) {
      return (
        <div>
          {data.map((textObj, i) => {
            return (
              //
              <div
                key={i}
                style={{ top: textObj.text_top + "px", left: textObj.text_left + "px", width: textObj.text_width + "px" }}
              >
                {textObj.text}
              </div>
            );
          })}
        </div>
      );
    }
  }

  fetchTableContent(sentences) {
    let col = [];

    if (sentences && sentences.children && Array.isArray(sentences.children) && sentences.children.length > 0) {
      sentences.children.map((tableData, i) => {
        if (Array.isArray(tableData.text)) {
          col.push(
            <div
              key={i}
              id={this.props.tableId + "_" + tableData.index[0] + "_" + tableData.index[1] + this.props.pageNo}
              style={{
                zIndex: 1,
                border: "1px solid black",
                borderCollapse: "collapse",
                position: 'absolute',
                zIndex: 1,
                top: tableData.text_top + "px",
                left: tableData.text_left + "px",
                width: tableData.text_width + "px",
                height: tableData.text_height + "px",
                // lineHeight: tableData.children && parseInt(tableData.text_height / tableData.children.length) + 'px',
                backgroundColor: this.props.hoveredTableId === this.props.tableId + "_" + tableData.index[0] + "_" + tableData.index[1] + "_" + this.props.pageNo ? "yellow" : ""
              }}
              onMouseEnter={() => this.props.handleTableHover(this.props.tableId + "_" + tableData.index[0] + "_" + tableData.index[1] + "_" + this.props.pageNo)}
              onMouseLeave={() => this.props.handleTableHover("")}
              onContextMenu={e => {
                e.preventDefault();
                this.handleMenu(e, tableData.index, tableData.text_top, tableData.text_left);
                this.setState({ selectedTable: this.props.tableId + "_" + tableData.index[0] + "_" + tableData.index[1] + "_" + this.props.pageNo })
                return false;
              }}
            >
              {tableData.text.map((textObj, i) => {
                return (

                  <div
                    key={i}

                    style={{ fontSize: textObj.font_size + "px", fontWeight: textObj.font_family && textObj.font_family.includes("Bold") && 'bold' }}
                  >
                    {textObj.text}
                  </div>
                );
              })}
            </div>
          );
        }
      });

      return col;
    }
  }

  handleMenu(e, index, top, left) {
    this.props.handlePopUp()
    this.setState({
      openContextMenu: true,
      anchorEl: e.currentTarget,
      selectedRow: index[0],
      selectedColumn: index[1],
      topValue: e.clientY - 4,
      leftValue: e.clientX - 2
    });
  }

  handleOnClick() {
    if (this.state.operationType === "Delete Table") {
      this.props.handleDeleteTable(this.state.selectedTable, this.props.currentPage)
    }
    this.setState({ openContextMenu: false, anchorEl: null, leftValue: "", topValue: "", openDialog: false });
  }

  handlePopOverClose() {
    this.setState({ openContextMenu: false, anchorEl: null, leftValue: "", topValue: "" });
  }

  handleClose = () => {
    this.setState({
      openDialog: false,
      operation_type: "",
      dialogMessage: "",
      openContextMenu: false
    });
  };

  handleDialog(sentence, operationType, message) {
    this.setState({openContextMenu: false, openDialog: true, operationType: operationType, dialogMessage: message})
  }

  render() {
    const { table } = this.props;
    return (
      <div>
        <div>
          {this.fetchTableContent(table)}
        </div>
        {this.state.openContextMenu && (
          <PopOver
            id={this.props.tableId}
            isOpen={this.state.openContextMenu}
            topValue={this.state.topValue}
            leftValue={this.state.leftValue}
            anchorEl={this.state.anchorEl}
            handleOnClick={this.handleDialog.bind(this)}
            handlePopOverClose={this.handlePopOverClose.bind(this)}
            tableItems={this.state.tableItems}
            tableValues={this.state.tableTitles}
            handleAddNewTable={this.props.handleAddNewTable}
            handleAddTableCancel={this.props.handleAddTableCancel}
            handleAddNewSentence={this.props.handleAddNewSentence}
            handlePopUp={this.props.handlePopUp}
            handleDeleteTable={this.props.handleDeleteTable}
            handleDeleteBlock={this.props.handleDeleteBlock}

          ></PopOver>
        )}
         {this.state.openDialog && (
          <Dialog
            message={this.state.dialogMessage}
            handleSubmit={this.handleOnClick.bind(this)}
            handleClose={this.handleClose.bind(this)}
            open
            title={this.state.operationType}
          />
        )}
      </div>
    );
  }
}

export default EditorTable;
