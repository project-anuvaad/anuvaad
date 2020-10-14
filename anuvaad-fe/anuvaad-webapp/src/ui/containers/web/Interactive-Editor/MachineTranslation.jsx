import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/MachineTranslationStyle"
import Typography from '@material-ui/core/Typography';

class MachineTranslation extends Component {
  constructor() {
    super();
    this.state = {
      status: ["merge","mergeSaved","split","apiCalled",""]
    };
  }

  render() {
    const { classes, sentence, buttonStatus } = this.props;
    return (
      <Paper className={!this.state.status.includes(buttonStatus) ? classes.paper: classes.paper2} >
        <div>
          <Typography variant="h5" gutterBottom className={classes.header} >Machine Translation</Typography>
        </div>
      {!this.state.status.includes(buttonStatus) && sentence &&
      <div>
        <hr style={!this.state.status.includes(buttonStatus) ? { border: "1px solid #00000014" }: { border: "1px solid grey" }} />
        <div className={classes.div} >
          <div>
            {sentence && sentence.s0_src}
          </div>
        </div>
        {sentence && <hr style={{ border: "1px solid #00000014" }} />}
        <div className={classes.div}>
          <div>
            {sentence && sentence.s0_tgt}
          </div>
          </div>
          
        </div>
  } 
      </Paper>
    );

  }
}

export default withStyles(Styles)(MachineTranslation);
