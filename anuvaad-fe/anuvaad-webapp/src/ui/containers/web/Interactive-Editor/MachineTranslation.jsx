import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Styles from "./MachineTranslationStyle"

class MachineTranslation extends Component {
  constructor() {
    super();
    this.state = {
    
    };
  }

  render() {
    const { classes } = this.props;
    return (
        <Paper className={classes.paper} >
            <div className={classes.header}>Machine Translation</div>
            <hr/>
            <div>{this.props.sourceText}</div>
            <hr/>
            <div>{this.props.targetText}</div>
        </Paper>
    );
  }
}

export default withStyles(Styles)(MachineTranslation);
