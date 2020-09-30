import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";
import { translate } from "../../../../assets/localisation";

class MenuClass extends React.Component {
  render() {

    const { topValue, leftValue, isOpen } = this.props;
    return (
      <Popover
        id="menu-appbar"
        open={isOpen}
        anchorReference="anchorPosition"
        anchorPosition={{ top: topValue, left: leftValue }}
        onClose={() => this.props.handleClose()}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
      >
        <div>
          <Button
            style={{ textTransform: "none", width: "100%", justifyContent: "left" }}
            onClick={() =>
              this.props.operation_type === "merge-individual" && this.props.addSentence ? this.props.handleDialog( "Merge", translate("intractive_translate.page.message.mergeDifferentSentenceQuestion")) : this.props.operation_type === "merge" ?this.props.handleDialog( "Merge", "Do you want to merge the sentence ?"):this.props.handleDialog( "Split", "Do you want to split the sentence ?")
            }
          >
            {" "}
            {this.props.operation_type === "merge" || this.props.operation_type === "merge-individual" ? translate("intractive_translate.page.preview.mergeSentence") : translate("intractive_translate.page.preview.splitSentence")}
          </Button>
          <br />
        </div>

        {this.props.mergeSentence.length < 2 && this.props.operation_type === "split" && (
          <div>
            <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleAddSentence()}>
              {" "}
              {translate("intractive_translate.page.preview.addAnotherSentence")}
            </Button>
            <br />
          </div>
        )}
        {this.props.startParagraph._id === this.props.endParagraph._id && (
          <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleDialog( "Delete Sentence", "Do you want to delete the sentence ? ")}>
            {" "}
            {translate("intractive_translate.page.preview.deleteSentence")}
          </Button>
        )}
        <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleCopy()}>
            {" "}
            Copy
          </Button>
        <hr style={{ color: 'grey', opacity: '0.4' }} />

        <div><Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() =>this.props.handleDialog( "Add new paragraph above", "Do you want to add new paragraph above? ") }>
          {" "}
          {translate("intractive_translate.page.preview.addNewSentenceAbove")}
        </Button><br /></div>

        <div> <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleDialog( "Add new paragraph below", "Do you want to add new paragraph below? ")}>
          {" "}
          {translate("intractive_translate.page.preview.addNewSentenceBelow")}
        </Button><br /></div>
        <div> <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleAddNewTable("next")}>
          {" "}
          {translate("intractive_translate.page.preview.addNewTableAbove")}
        </Button><br /></div>
        <div> <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleAddNewTable("previous")}>
          {" "}
          {translate("intractive_translate.page.preview.addNewTableBelow")}
        </Button><br /></div>
      </Popover>
    );
  }
}

export default MenuClass;
