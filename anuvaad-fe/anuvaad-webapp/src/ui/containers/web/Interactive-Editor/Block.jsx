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
    const { classes } = this.props;
    return (
        <Paper style={{margin: "20px", minHeight: "80px", padding: "2%"}} onClick={() => this.props.handleSentenceClick(this.props.sentence)}>
            <div onClick={() => this.props.handleSentenceClick(this.props.sentence)}>{this.props.sentence}</div>
            <hr style={{border: "1px dashed #00000014"}} />
            <div>{this.props.sourceText}</div>
        </Paper>
    );
  }
}

export default withStyles(Styles)(Block);