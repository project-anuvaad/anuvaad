import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/BlockStyles"
import Paper from "@material-ui/core/Paper";
import ChevronLeftIcon from "@material-ui/icons/DoubleArrow";
import Merge from '@material-ui/icons/CallMerge';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from "@material-ui/core/Grid";
import Save from '@material-ui/icons/CheckCircleOutline';
import Split from '@material-ui/icons/CallSplit';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
class Block extends Component {
  constructor() {
    super();
    this.state = {
    
    };
  }

  render() {
    const { classes,sentence } = this.props;
    return (
        <Paper variant="outlined" style={{margin: "10px", minHeight: "90px", padding: "1%"}} onClick={() => this.props.handleSentenceClick(this.props.sentence)}>
          <Grid
              container
              spacing={2}
              
            >
              <Grid item xs={11} sm={11} lg={11} xl={11}>
            <div onClick={() => this.props.handleSentenceClick(sentence)}>{sentence.src}</div>
            <hr style={{border: "1px dashed #00000014"}} />
            <div>{sentence.tgt}</div> 
            </Grid>
            <Grid item xs={1} sm={1} lg={1} xl={1} style ={{display: "flex",
  flexDirection: "column", paddingLeft:"4%"}}>
                <Tooltip title="Go to validation mode">
        <IconButton aria-label="validation mode">
                <ArrowBackIcon fontSize="medium" className={classes.Icons}/>
                </IconButton>
                </Tooltip>
                <Tooltip title="Spit sentence">
        <IconButton aria-label="Split">
                <Split fontSize="medium"/>
                </IconButton>
                </Tooltip>
                <Tooltip title="Merge Sentence">
        <IconButton aria-label="merge">
                <Merge fontSize="medium"/>
                </IconButton>
                </Tooltip>
                <Tooltip title="Save">
        <IconButton aria-label="save">
                <Save fontSize="medium"/>
                </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
        </Paper>
    );
  }
}

export default withStyles(Styles)(Block);