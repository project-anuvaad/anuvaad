import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";

class MenuClass extends React.Component {

  findWord(word){
    let splitWord = word.split(' ');
    let resultArray=[];
    let result = word;
    if(splitWord.length>3){
      resultArray = [...splitWord.slice(0, 3)," ... "]
      result =resultArray.join(" ");

    }
    return result;
  }
  render() {

    const { topValue, leftValue, isOpen, splitValue } = this.props;
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
        { this.props.operation_type === "merge" && (
          <Button
            style={{ textTransform: "none", width: "100%", justifyContent: "left" }}
            onClick={() =>
               this.props.operation_type === "merge" ?this.props.handleDialog( "Merge", "Do you want to merge the sentence ?"):this.props.handleDialog( "Split", "Do you want to split the sentence ?")
            }
          >
            {" "}
            {this.props.operation_type === "merge" || this.props.operation_type === "merge-individual" ? "Merge Block" : "Split"}
          </Button>
          
        )}

<Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleDialog( "Dictionary")}>
              {" "}
              lookup dictionary <span style={{fontWeight:"bold", paddingLeft:"5px"}}>{this.findWord(this.props.selectedText)}</span>
            </Button>
          
            {!this.props.targetDict &&
          <div>
            <Button
            style={{  width: "100%", justifyContent: "left" }}
            onClick={() =>
               this.props.handleDialog( "Split sentence")
            }
          >
            {" "}
            {this.props.operation_type === "Merge Sentence" ? "Merge Sentence" : "Split sentence"}
          </Button>

          <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleCopy()}>
            {" "}
            Copy
          </Button>

         
            <br />
            {/* <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleDialog( "Create", "Do you want to add the sentence ?")}>
              {" "}
              Create Block
            </Button>
            <br />
          
           <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleDialog( "Duplicate", "Do you want to duplicate the sentence ?")}>
           {" "}
           Duplicate Block
         </Button>
         <br />
         <Button style={{ textTransform: "none", width: "100%", justifyContent: "left" }} onClick={() => this.props.handleDialog( "Delete", "Do you want to delete the sentence ?")}>
           {" "}
           Delete Block
         </Button> */}
         <br />
       </div>
  }

        </div>
        {splitValue}
      </Popover>
    );
  }
}

export default MenuClass;
