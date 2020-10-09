import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/BlockStyles"
import Paper from "@material-ui/core/Paper";
import ChevronLeftIcon from "@material-ui/icons/DoubleArrow";

class Block extends Component {
  constructor() {
    super();
    this.state = {
    
    };
  }

  render() {
    const { classes,sentence } = this.props;
    return (
        <Paper variant="outlined" style={{margin: "10px", minHeight: "80px", padding: "1%"}} onClick={() => this.props.handleSentenceClick(this.props.sentence)}>
            <div onClick={() => this.props.handleSentenceClick(sentence)}>{sentence.src}</div>
            <hr style={{border: "1px dashed #00000014"}} />
            {/* <div>{sentence.tgt}</div> */}
        </Paper>
    );
  }
}

export default withStyles(Styles)(Block);