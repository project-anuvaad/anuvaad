import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/MachineTranslationStyle"
import Typography from '@material-ui/core/Typography';

class MachineTranslation extends Component {
  constructor() {
    super();
    this.state = {
    
    };
  }

  render() {
    const { classes, sentence } = this.props;
    return (
        <Paper className={classes.paper} >
            <div>
            <Typography variant="h5" gutterBottom style={{ color: '#000000', marginLeft: "30px", textAlign: "left" }} >Machine Translation</Typography>
          </div>
           
            <hr/>
            <div className={classes.div} >{sentence && sentence.src}</div>
            <hr/>
            <div>{sentence&& sentence.tgt}</div>
        </Paper>
    );
  }
}

export default withStyles(Styles)(MachineTranslation);
