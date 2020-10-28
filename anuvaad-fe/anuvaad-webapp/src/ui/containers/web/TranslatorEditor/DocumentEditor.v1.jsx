import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Fab";
import { translate } from "../../../../assets/localisation";
import history from "../../../../web.history";
import ClearContent from "../../../../flux/actions/apis/clearcontent";
import FileContent from "../../../../flux/actions/apis/fetchcontent";
import Spinner from "../../../components/web/common/Spinner";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import Snackbar from "../../../components/web/common/Snackbar";
import WorkFlow from "../../../../flux/actions/apis/fileupload";
import TextButton from '@material-ui/core/Button';
import LanguageCodes from "../../../components/web/common/Languages.json"
import DownloadIcon from "@material-ui/icons/ArrowDownward";

import TranslateView from "../Interactive-Editor/DocumentTranslator";
import SourceView from '../Interactive-Editor/SourceView';
import PDFRenderer from './PDFRenderer';

const BLOCK_OPS = require("../../../../utils/block.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

class DocumentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModeTranslation: false,
            currentPageIndex: 1
        }
    }

    /**
     * life cycle methods
     */
    componentDidMount() {
      TELEMETRY.pageLoadCompleted('document-editor')
      let recordId  = this.props.match.params.jobid;
      let jobId     = recordId ? recordId.split("|")[0] : ""
  
      let langCodes = LanguageCodes
      let sourceLang = ''
      if (langCodes && Array.isArray(langCodes) && langCodes.length > 0) {
        langCodes.map(lang => {
          if (lang.language_code === this.props.match.params.locale) {
            sourceLang = lang.language_name
          }
          return true
        })
      }
      TELEMETRY.startTranslatorFlow(sourceLang, this.props.match.params.targetlang, this.props.match.params.inputfileid, jobId)
      this.setState({ showLoader: true });
      this.makeAPICallFetchContent(recordId);
    }

    /**
     * API methods
     */
    makeAPICallFetchContent =  (recordId) => {
        const apiObj              = new FileContent(recordId, 1, 2);
        this.props.APITransport(apiObj);
        let obj                   = {};
        obj.download_source_path  = this.props.match.params.inputfileid;
        this.setState({ fileDetails: obj, showLoader: true, buttonDisable: true, pdfPage: 1 });
    }

    /**
     * workhorse functions
     */
    handleSourceChange = (evt, blockValue) => {
    }
    saveUpdatedSentence(sentenceObj, pageNo) {
    }
    workFlowApi(workflow, blockDetails, update, type) {
    }
    fetchData() {
    }
    handleScroll() {
        this.setState({ scrollToTop: false });
    }
    moveToValidationMode(pageNo, blockId, sId) {
    }

    handleViewModeToggle = () => {
        this.setState({
            isModeTranslation: !this.state.isModeTranslation
        })
    }

    handleOnClose = () => {
      let recordId  = this.props.match.params.jobid;
      let jobId     = recordId ? recordId.split("|")[0] : ""
      TELEMETRY.endTranslatorFlow(jobId)
  
      history.push(`${process.env.PUBLIC_URL}/view-document`);
    }


    /**
     * all render functions starts here
     */

    /**
     * render the toolbar
     */
    renderToolBar = () => {
        return (
            <Grid container
                spacing={2}
                style={{ marginTop: "-10px", padding: "10px 5px 0px ", width: "100%", position: "fixed", zIndex: 1000, background: "#F5F9FA" }}>
            
                <Grid item xs={12} sm={6} lg={2} xl={2} className="GridFileDetails">
                    <Button
                    // variant="outlined"
                    onClick={event => {
                        this.handleOnClose();
                    }}
                    style={{ textTransform: "capitalize", width: "100%", minWidth: "150px", borderRadius: "30px", color: "#233466" }}
                    >
                    <ChevronLeftIcon fontSize="small" />
                    {translate("common.page.title.document")}
                    </Button>
                </Grid>

                <Grid item xs={12} sm={5} lg={7} xl={7} className="GridFileDetails">
                    <Button
                        color="primary"
                        // variant="outlined"
                        className="GridFileDetails"
                        style={{
                            textTransform: "capitalize",
                            justifyContent: "center",
                            height: "100%",
                            width: "100%",
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                            borderRadius: "30px"
                        }}
                        >
                        <div style={{ fontSize: "15px", fontWeight: "bold" }}>
                            {!this.state.apiCall ? (this.state.tokenized ? "You are in validation mode" : "You are in Translation mode") : "Saving....."}
                        </div>
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} lg={1} xl={1}>
                    <Button
                        onClick={() => this.handleTargetDownload()}
                        style={{
                        color: "#233466",
                        textTransform: "capitalize",
                        width: "100%",
                        minWidth: "110px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        borderRadius: "30px"
                        }}
                    >
                        <DownloadIcon fontSize="large" style={{ color: "#233466", fontSize: "x-large" }} />&nbsp;Download
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} lg={2} xl={2}>
                    <Button
                        // variant="contained"
                        // color="primary"
                        style={{
                        color: "#233466",
                        textTransform: "capitalize",
                        width: "100%",
                        minWidth: "110px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        borderRadius: "30px"
                        }}
                        disabled={this.state.apiCall ? true : false}
                        onClick={() => this.handleViewModeToggle()}
                    >
                        {this.state.tokenized ? "Go to Translational mode" : "Go to Validation mode"}
                        <ChevronRightIcon fontSize="large" />
                    </Button>
                </Grid>

            </Grid>
        )
    }

    /**
     * render the document view
     */
    renderValidationModeView = () =>  {
        return (
            <Grid container spacing={2} style={{ padding: "142px 24px 0px 24px" }}>
                <Grid item xs={12} sm={6} lg={6} xl={6}>
                  <Paper
                    elevation={this.state.edited ? 12 : 2}
                    style={{
                      // paddingBottom: "12px"
                    }}
                  >
                    <div
                      id="scrollableDiv"
                      style={
                        this.state.tokenized
                          ? {
                            maxHeight: window.innerHeight - 240,
                            overflowY: this.state.edited ? "hidden" : "scroll",
                            // overflowX: "auto"
                          }
                          : {}
                      }
                    >
                      <InfiniteScroll
                        next={this.fetchData.bind(this)}
                        hasMore={this.state.hasMoreItems}
                        dataLength={this.state.sentences ? this.state.sentences.length : 0}
                        loader={
                          <p style={{ textAlign: "center" }}>
                            <CircularProgress
                              size={20}
                              style={{
                                zIndex: 1000
                              }}
                            />
                          </p>
                        }
                        endMessage={
                          <p style={{ textAlign: "center" }}>
                            <b>You have seen it all</b>
                          </p>
                        }
                        // style={{ overflowY: "hidden" }}
                        scrollableTarget={this.state.tokenized ? "scrollableDiv" : null}
                        onScroll={() => this.handleScroll()}
                      >
                        {this.state.sentences &&
                          this.state.sentences.map((sentence, index) => {
                            return (
                              <div>
                                <SourceView
                                  block_identifier={this.state.block_identifier}
                                  sentences={this.state.sentences}
                                  has_sibling={this.state.has_sibling}
                                  paperType="source"
                                  isPreview={true}
                                  parent={this.state.parent}
                                  key={sentence.page_no + "_" + index}
                                  pageNo={sentence.page_no}
                                  sourceSentence={sentence}
                                  selectedSourceText={this.state.selectedSourceText}
                                  createBlockId={this.state.selectedBlockId}
                                  isEditable={this.state.isEditable}
                                  hoveredSentence={this.state.hoveredSentence}
                                  hoveredTableId={this.state.hoveredTableId}
                                  clear={this.state.clear}
                                  heightValue={this.state.height}
                                  popOver={this.state.popOver}
                                  selectedCell={this.state.selectedCell}
                                  scrollToPage={this.state.scrollToPage}
                                  scrollToTop={this.state.scrollToTop}
                                  yOffset={this.state.yOffset}
                                  workFlowApi={this.workFlowApi.bind(this)}
                                  handleOnMouseEnter={this.handleOnMouseEnter.bind(this)}
                                  handleOnMouseLeave={this.handleOnMouseLeave.bind(this)}
                                  handleSourceChange={this.handleSourceChange.bind(this)}
                                  handleEditor={this.handleEditor.bind(this)}
                                  handleCheck={this.handleCheck.bind(this)}
                                  handleSource={this.handleSource.bind(this)}
                                  handleTableHover={this.handleTableHover.bind(this)}
                                  handlePopUp={this.handlePopUp.bind(this)}
                                  handleBlur={this.handleBlur.bind(this)}
                                  handleSentenceOperation={this.handleSentenceOperation.bind(this)}
                                  tokenized={this.state.tokenized}
                                  handlePreviewPageChange={this.handlePreviewPageChange.bind(this)}
                                  mergeButton={this.state.mergeButton}
                                  updateContent={this.updateContent.bind(this)}
                                  editableId={this.state.editableId}
                                  handleAutoCompleteEditor={this.handleAutoCompleteEditor.bind(this)}
                                  targetSelected={this.state.targetSelected}
                                  scrollId={this.state.scrollId}
                                />
                              </div>
                            );
                          })}
                      </InfiniteScroll>
                    </div>
                  </Paper>
                </Grid>

                {this.renderPDFDocument()}
                
              </Grid>
        )
    }

    /**
     * renders PDF document
     */
    renderPDFDocument = () => {
      return (
        <Grid item xs={12} sm={6} lg={6} xl={6}>
          <Paper style={this.state.tokenized ? { paddingBottom: "12px", paddingTop: "12px",} : {}}>
            <PDFRenderer parent='document-editor' filename={this.props.match.params.inputfileid} pageNo={this.state.currentPageIndex} />
          </Paper>
        </Grid>
      )
    }

    /***
     * render translation view
     */
    renderTranslationModeView = () => {
        return (
            <Grid container spacing={2} style={{ padding: "122px 24px 0px 24px" }}>
                <TranslateView
                modelId={this.props.match.params.modelId}
                sentences={this.state.sentences}
                handleSourceChange={this.handleSourceChange.bind(this)}
                saveUpdatedSentence={this.saveUpdatedSentence.bind(this)}
                workFlowApi={this.workFlowApi.bind(this)}
                open={this.state.open}
                fetchData={this.fetchData.bind(this)}
                hasMoreItems={this.state.hasMoreItems}
                handleScroll={this.handleScroll.bind(this)}
                moveToValidationMode={this.moveToValidationMode.bind(this)}
                scroll={this.state.scroll}
                />
            </Grid>
        )
    }

    /**
     * render functions ends here
     */

    render() {
        return (
        <div>
            {this.renderToolBar()}
            {this.state.isModeTranslation ? this.renderTranslationModeView() : this.renderValidationModeView()}
        </div>
        )
    }
}

const mapStateToProps = state => ({
    fetchPdfSentence: state.fetchPdfSentence,
    fileUpload: state.fileUpload,
    documentDetails: state.documentDetails,
    fetchContent: state.fetchContent,
    workflowStatus: state.workflowStatus,
    documentconverter: state.documentconverter,
    saveContent: state.saveContent,
    document_contents: state.document_contents
});
  
const mapDispatchToProps = dispatch =>
bindActionCreators(
    {
    APITransport,
    ClearContent: ClearContent
    },
    dispatch
);
  
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentEditor));
  