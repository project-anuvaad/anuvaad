import React from "react";
import Popover from "@material-ui/core/Popover";
import Button from "@material-ui/core/Button";

class MenuClass extends React.Component {
  findWord(word) {
    let splitWord = word.split(" ");
    let resultArray = [];
    let result = word;
    if (splitWord.length > 3) {
      resultArray = [...splitWord.slice(0, 3), " ... "];
      result = resultArray.join(" ");
    }
    return result;
  }
  render() {
    const { positionX, positionY } = this.props;
    let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID
    let role = localStorage.getItem("roles")
    return (
      <Popover
        id="menu-appbar"
        open={this.props.isopenMenuItems && this.props.enableActionButtons}
        anchorReference="anchorPosition"
        anchorPosition={{ top: positionY, left: positionX }}
        onClose={() => this.props.handleClose()}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div>
          <Button
            style={{
              textTransform: "none",
              width: "100%",
              justifyContent: "left",
            }}
            onClick={() => this.props.handleOperation(0)}
          >
            {" "}
            lookup dictionary{" "}
            <span style={{ fontWeight: "bold", paddingLeft: "5px" }}>
              {this.findWord(this.props.splitValue)}
            </span>
          </Button>

          {!this.props.targetDict && (
            <div>
              {!this.props.hideSplit &&
                <Button
                  style={{ width: "100%", justifyContent: "left" }}
                  onClick={() => this.props.handleOperation(1)}
                >
                  Split sentence
              </Button>
              }
              <Button
                style={{
                  textTransform: "none",
                  width: "100%",
                  justifyContent: "left",
                }}
                onClick={() => this.props.handleOperation(2)}
              >
                {" "}
                Copy
              </Button>
              {
                orgID !== 'NONMT' &&
                <>{role !== 'ANNOTATOR' &&
                  <Button
                    style={{
                      textTransform: "none",
                      width: "100%",
                      justifyContent: "left",
                    }}
                    onClick={() => this.props.handleOperation(3)}
                  >
                    {" "}
                    Add to glossary
                  </Button>
                }</>
              }
              {
                orgID !== 'NONMT' &&
                <>{role !== 'ANNOTATOR' &&
                  <Button
                    style={{
                      textTransform: "none",
                      width: "100%",
                      justifyContent: "left",
                    }}
                    onClick={() => this.props.handleOperation(4)}
                  >
                    {" "}
                    Suggest Glossary
                  </Button>
                }</>
              }
              <br />

              <br />

            </div>
          )}
        </div>

      </Popover>
    );
  }
}

export default MenuClass;
