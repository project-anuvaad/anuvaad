import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";
import TextField from '@material-ui/core/TextField'
import SENTENCE_ACTION from "./SentenceActions";
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import DoneIcon from '@material-ui/icons/Done';
import PropTypes from 'prop-types';
import history from "../../../../web.history";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { currentPageUpdate } from "../../../../flux/actions/apis/document_translate/pagiantion_update";
import { clearHighlighBlock } from '../../../../flux/actions/users/translator_actions';
import fetchpercent from '../../../../flux/actions/apis/view_digitized_document/fetch_slider_percent';
import fetchfontpixel from '../../../../flux/actions/apis/view_digitized_document/fetch_slider_pixel';
import { IconButton } from "@material-ui/core";
import ConfirmBox from "../../../components/web/common/ConfirmBox";
import UpdateGranularStatus from "../../../../flux/actions/apis/document_translate/update_granular_status";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";

const PAGE_OPS = require("../../../../utils/page.operations");


function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

class InteractivePagination extends React.Component {
  constructor(props) {
    super(props);
    this.pageInputRef = React.createRef(null);
    this.state = { offset: 1, gotoValue: 1, isInputActive: false, showCompleteConfirmBox: false };
  }
  handleClick = (offset, value) => {
    this.props.currentPageUpdate(value);
    this.setState({ offset: value, gotoValue: value });
  };

  componentDidMount() {
    this.props.currentPageUpdate(1);
    window.addEventListener("keydown", (event) => {
      if (this.state.isInputActive && event.key === "Enter") {
        event.preventDefault()
        // this.pageInputRef.current.blur();
        // this.setState({isInputActive: false})
        this.handlePageClick();
      }
    })
  }

  componentWillUnmount(){
    this.props.onAction(SENTENCE_ACTION.END_MODE_MERGE, this.state.offset);
  }

  sentenceCount = () => {
    let sentenceCount = PAGE_OPS.get_sentence_count(
      this.props.data,
      this.state.offset
    );
    return sentenceCount;
  };

  sentenceProgress = () => {
    let sentenceProgressCount = PAGE_OPS.get_total_sentence_count(
      this.props.job_details,
      this.props.match.params.inputfileid
    );
    return sentenceProgressCount;
  };

  /**
   * Merge mode user action handlers
   */
  processMergeButtonClicked = () => {
    this.props.clearHighlighBlock();
    this.props.onAction(SENTENCE_ACTION.START_MODE_MERGE, this.state.offset);
  };

  processMergeNowButtonClicked = () => {
    if (this.props.onAction) {
      this.props.onAction(SENTENCE_ACTION.SENTENCE_MERGED, this.state.offset);
    }
  };

  handlePageClick = () => {
    this.handleClick("", parseInt(this.state.gotoValue))
    this.setState({ offset: parseInt(this.state.gotoValue) })
  }

  updateGranularity(status) {
    let recordId = this.props.match.params.jobid;
    let jobId = recordId ? recordId.split("|")[0] : ""
    const apiObj = new UpdateGranularStatus(jobId, status);

    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      // console.log("rsp_data ---- ", rsp_data);
      if (rsp_data?.status == "SUCCESS") {
        const { APITransport } = this.props;
        const apiObj = new FetchDocument(
          0,
          this.props.job_details.count,
          [],
          false,
          false,
          false
        );
        APITransport(apiObj);
        history.push(`${process.env.PUBLIC_URL}/view-document`);
      }

    }).catch(err => {
      console.log(err);
    })

  }

  onConfirmCompleteClick = () => {
    this.setState({ showCompleteConfirmBox: false })
    let statusArr;
    if(this.props.updateManualStartTime){
      statusArr = ["manualEditingStartTime", "manualEditingEndTime"];
    } else {
      statusArr = ["manualEditingEndTime"];
    }
    this.updateGranularity(statusArr)
  }

  renderNormaModeButtons = () => {
    return (
      <div>
        <IconButton
          onClick={this.processMergeButtonClicked}
          variant="contained" color="secondary"
          title="Merge"
          style={{ backgroundColor: "#2C2799" }}
        >
          <MergeTypeIcon />
        </IconButton>
        <IconButton
          onClick={() => this.setState({ showCompleteConfirmBox: true })}
          variant="contained"
          color="secondary"
          title="Complete"
          disabled={!this.props.enableCompleteButton}
          style={{ backgroundColor: !this.props.enableCompleteButton ? "#F5F5F5" : "green", marginLeft: 5 }}
        >
          <DoneIcon />
        </IconButton>
      </div>
    );
  };


  renderMergeModeButtons = () => {
    return (
      <div>
        <Button
          style={{ marginRight: "10px" }}
          onClick={this.processMergeNowButtonClicked}
          variant="outlined"
          color="primary"
        >
          MERGE NOW
        </Button>
        <Button
          onClick={this.processMergeCancelButtonClicked}
          variant="outlined"
          color="primary"
        >
          CANCEL MERGE
        </Button>
      </div>
    );
  };

  processMergeCancelButtonClicked = () => {
    this.props.onAction(SENTENCE_ACTION.END_MODE_MERGE, this.state.offset);
  };

  handleTextValueChange = (event) => {
    if (event.target.value <= this.props.count) {
      this.setState({ gotoValue: event.target.value })
    } else if (event.target.value > this.props.count) {
      this.setState({ gotoValue: this.props.count })
    }
  }

  setConfPercentage = (event) => {
    console.log(event.target.value)
  }

  adjustFontPixel = (event, pixel) => {
    this.props.fetchfontpixel(pixel)
  }

  footer = () => {
    return (
      <AppBar
        position={"fixed"}
        style={{
          top: 'auto',
          bottom: 0,
          // marginTop: "13px"
        }}
        color="secondary"
      >
        <Toolbar
          disableGutters={!this.props.open_sidebar}
          style={{ height: "65px" }}
        >
          {this.props.document_editor_mode.mode === "EDITOR_MODE_MERGE" ? (
            <div style={{ position: "absolute", right: "30px" }}>
              {this.renderMergeModeButtons()}
            </div>
          ) : (
            <>
              {this.props.processZoom()}
              <Pagination
                count={this.props.count}
                page={this.state.offset}
                onChange={this.handleClick}
                color="primary"
                size={"large"}
                style={{ marginLeft: "-10%" }}
                siblingCount={0} boundaryCount={1}
              />
              <TextField
                type="number"
                style={{ width: "40px" }}
                ref={this.pageInputRef}
                onFocus={() => this.setState({ isInputActive: true })}
                onBlur={() => this.setState({ isInputActive: false })}
                InputProps={{

                  inputProps: {
                    style: { textAlign: "center" },
                    max: this.props.count, min: 1
                  }
                }}
                onChange={(event) => { this.handleTextValueChange(event) }}
                value={this.state.gotoValue}
              />
              <Button
                onClick={this.handlePageClick}
                style={{ marginLeft: '6px' }}
                variant="outlined"
                color="primary"
                disabled={(this.state.offset === Number(this.state.gotoValue) || !this.state.gotoValue) ? true : false}
              >
                GO
              </Button>
              {(!this.props.show_pdf && !this.props.hideMergeBtn) &&
                <>
                  {this.sentenceCount() && (
                    <div style={{ position: "absolute", marginLeft: "50%" }}>
                      <Typography variant="subtitle1" component="h2">
                        Page Sentences
                      </Typography>

                      <div style={{ textAlign: "center" }}>
                        {this.sentenceCount()}
                      </div>
                    </div>
                  )}

                  {this.props.job_status && this.props.job_status.word_status && <div style={{ position: "absolute", marginLeft: "65%" }}>
                    <Typography variant="subtitle1" component="h2">
                      Total Word Count
                    </Typography>

                    <div style={{ textAlign: "center" }}>
                      {this.props.job_status.word_status && this.props.job_status.word_status}
                    </div>
                  </div>}

                  {this.props.job_status && this.props.job_status.status &&
                    <div style={{ position: "absolute", marginLeft: "80%" }}>
                      <Typography variant="subtitle1" component="h2">
                        Total Sentences
                      </Typography>

                      <div style={{ textAlign: "center" }}>
                        {this.props.job_status.status && this.props.job_status.status}
                      </div>
                    </div>}

                  <div style={{ position: "absolute", right: "15px" }}>
                    {this.renderNormaModeButtons()}
                  </div>
                </>
              }
              {/* {
                  this.props.showConfSlider &&
                  <div style={{ display: 'grid', marginTop: '1%', width: '20%', gridTemplateColumns: 'repeat(1,40% 80%)' }}>
                    <Typography style={{ marginLeft: '15%', color: 'black' }} id="discrete-slider-always" gutterBottom>
                      Confidence Score
                    </Typography>
                    <Slider
                      ValueLabelComponent={ValueLabelComponent}
                      aria-label="custom thumb label"
                      defaultValue={80}
                      onChange={this.handleSliderChange}
                    />
                  </div>
                } */}
              {
                this.props.showFontAdjuster &&
                <div style={{ display: 'grid', marginTop: '1%', width: '20%', gridTemplateColumns: 'repeat(1,40% 80%)' }}>
                  <Typography style={{ marginLeft: '15%', color: 'black' }} id="discrete-slider-always" gutterBottom>
                    Adjust Font
                  </Typography>
                  <Slider
                    ValueLabelComponent={ValueLabelComponent}
                    aria-label="custom thumb label"
                    defaultValue={this.props.fontSize}
                    onChange={this.adjustFontPixel}
                  />
                </div>
              }
              <ConfirmBox
                open={this.state.showCompleteConfirmBox}
                onClose={() => this.setState({ showCompleteConfirmBox: false })}
                title="Complete Editing"
                contentText={<><span>Are you sure you want to complete document editing?</span> <br /> <span>You won't be able to edit/upload this document anymore.</span></>}
                onConfirm={() => this.onConfirmCompleteClick()}
              />
            </>
          )}

        </Toolbar>
      </AppBar>
    )
  }

  render() {

    return (
      this.footer()
    );
  }
}

const mapStateToProps = (state) => ({
  document_editor_mode: state.document_editor_mode,
  job_details: state.job_details,
  show_pdf: state.show_pdf.open,
  job_status: state.job_status,
  fontSize: state.fetch_slider_pixel.percent
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      currentPageUpdate,
      APITransport,
      clearHighlighBlock,
      fetchpercent,
      fetchfontpixel,
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InteractivePagination)
);
