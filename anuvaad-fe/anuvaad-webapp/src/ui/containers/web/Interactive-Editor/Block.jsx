import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Styles from "../../../styles/web/BlockStyles";
import Paper from "@material-ui/core/Paper";
import ChevronLeftIcon from "@material-ui/icons/DoubleArrow";
import Merge from "@material-ui/icons/CallMerge";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Grid from "@material-ui/core/Grid";
import Save from "@material-ui/icons/CheckCircleOutline";
import Split from "@material-ui/icons/CallSplit";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import AutoComplete from "../../../components/web/common/AutoComplete1"

class Block extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleChangeEvent = event => {
    this.props.handleSourceChange(event, this.props.sentence);
  };

  render() {
    const { classes, sentence, selectedBlock } = this.props;
  
    return (
      <Paper
        variant="outlined"
        style={{ margin: "10px", minHeight: "90px", padding: "1%", border: selectedBlock && sentence && sentence.s_id === selectedBlock.s_id ? "1px solid #1C9AB7" : "1px solid #D6D6D6", }}
        onClick={() => { this.props.handleSentenceClick(this.props.sentence) }}
      >
        <Grid container spacing={2}>
          <Grid item xs={8} sm={9} lg={11} xl={11}>
            <div style={{ minHeight: '45px' }}>
              {sentence.src}
            </div>
            <hr style={{ border: "1px dashed #00000014" }} />
            <div style={{ minHeight: '45px' }}>
               <AutoComplete
                aId={sentence.s_id}
                refId={sentence.s_id}
                block_identifier_with_page={sentence.block_identifier + "_" + this.props.pageNo}
                style={{
                  width: "100%",
                  resize: "none",
                  zIndex: 1111,
                  borderRadius: "4px",
                  backgroundColor: "#F4FDFF",
                  border: this.props.selectedTargetId === sentence.s_id ? '1px dotted #1C9AB7' : ""
                }}
                tokenIndex={this.props.tokenIndex}
                value={this.props.selectedTargetId === sentence.s_id ? sentence.tgt : ""}
                sentence={sentence}
                sourceText={sentence.src}
                page_no={this.props.page_no}
                handleChangeEvent={this.handleChangeEvent.bind(this)}
                fetchSuggestions={this.props.fetchSuggestions}
                autoCompleteText={this.props.autoCompleteText}
                autoCompleteTextTaggetTgt={this.props.autoCompleteTextTaggetTgt}
                handleSuggestion={this.props.handleSuggestion}
                heightToBeIncreased={sentence.font_size}
                handleBlur={this.props.handleBlur}
                showSuggestions={this.props.showSuggestions}
                handleSuggestionClose={this.props.handleSuggestionClose}
                // handleClickAway={this.props.handleClickAway.bind(this)}
                // tokenObject={text}
                showTargetLang={this.props.selectedTargetId === sentence.s_id && true}
              />
            </div>
          </Grid>
          <Grid
            item
            xs={4}
            sm={3}
            lg={1}
            xl={1}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "4%",
              }}
            >
              <Tooltip title="Get machine translated sentence">
                <IconButton aria-label="validation mode" onClick={() => { this.props.showTargetData(sentence.s_id) }}>
                  <ArrowBackIcon fontSize="medium" className={classes.Icons} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save">
                <IconButton aria-label="save">
                  <Save fontSize="medium" />
                </IconButton>
              </Tooltip>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                paddingLeft: "4%",
              }}
            >
              <Tooltip title="Spit sentence">
                <IconButton aria-label="Split">
                  <Split fontSize="medium" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Merge Sentence">
                <IconButton aria-label="merge">
                  <Merge fontSize="medium" />
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

export default withStyles(Styles)(Block);
