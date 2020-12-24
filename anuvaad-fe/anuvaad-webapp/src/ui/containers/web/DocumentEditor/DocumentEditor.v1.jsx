import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InfiniteScroll from "react-infinite-scroll-component";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

import { translate } from "../../../../assets/localisation";
import history from "../../../../web.history";
import Spinner from "../../../components/web/common/Spinner";
import LanguageCodes from "../../../components/web/common/Languages.json"
import PDFRenderer from './PDFRenderer';
import SentenceCard from './SentenceCard';
import PageCard from "./PageCard";
import InteractivePagination from './InteractivePagination';
import SENTENCE_ACTION from './SentenceActions'
import InteractiveDocToolBar from "./InteractiveDocHeader"

import WorkFlowAPI from "../../../../flux/actions/apis/common/fileupload";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import ClearContent from "../../../../flux/actions/apis/document_translate/clearcontent";
import FileContent from "../../../../flux/actions/apis/document_translate/fetchcontent";
import FetchContentUpdate from "../../../../flux/actions/apis/document_translate/v1_fetch_content_update";
import SaveSentenceAPI from '../../../../flux/actions/apis/document_translate/savecontent';
import JobStatus from "../../../../flux/actions/apis/view_document/v1_jobprogress";
import FetchModel from "../../../../flux/actions/apis/common/fetchmodel";
import { showPdf, clearShowPdf } from '../../../../flux/actions/apis/document_translate/showpdf';
import { contentUpdateStarted, clearFetchContent } from '../../../../flux/actions/users/translator_actions';
import { update_sentences, update_blocks } from '../../../../flux/actions/apis/document_translate/update_page_content';
import { editorModeClear, editorModeNormal, editorModeMerge } from '../../../../flux/actions/editor/document_editor_mode';
import { Button } from "@material-ui/core";

const PAGE_OPS = require("../../../../utils/page.operations");
const BLOCK_OPS = require("../../../../utils/block.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')
var jp = require('jsonpath')

class DocumentEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModeSentences: true,
      currentPageIndex: 1,
      apiInProgress: false,
      snackBarMessage: '',
      apiFetchStatus: false,
      docView: false,
      zoomPercent: 100,
      zoomInDisabled: false,
      zoomOutDisabled: false
    }
    this.forMergeSentences = []
  }

  /**
   * life cycle methods
   */
  componentDidMount() {
    TELEMETRY.pageLoadCompleted('document-editor')
    let recordId = this.props.match.params.jobid;
    let jobId = recordId ? recordId.split("|")[0] : ""

    localStorage.setItem("recordId", recordId);
    localStorage.setItem("inputFile", this.props.match.params.inputfileid)

    TELEMETRY.startTranslatorFlow(this.props.match.params.locale, this.props.match.params.targetlang, this.props.match.params.inputfileid, jobId)
    this.setState({ showLoader: true });
    this.makeAPICallFetchContent(1);
    this.makeAPICallDocumentsTranslationProgress();

    if (!this.props.fetch_models || !this.props.fetch_models.length > 0) {
      const apiModel = new FetchModel();
      this.props.APITransport(apiModel);
    }

    window.addEventListener('popstate', this.handleOnClose);
    // window.addEventListener('beforeunload',this.handleOnClose);

  }

  componentDidUpdate(prevProps) {
    if (prevProps.sentence_highlight !== this.props.sentence_highlight) {
      this.handleSourceScroll(this.props.sentence_highlight.sentence_id)
    }
    if (prevProps.active_page_number !== this.props.active_page_number) {
      this.makeAPICallFetchContent(this.props.active_page_number);


    }

    if (prevProps.document_contents !== this.props.document_contents) {
      this.setState({ apiFetchStatus: false })

    }

    if (prevProps.document_editor_mode !== this.props.document_editor_mode && this.props.document_editor_mode.mode === 'EDITOR_MODE_MERGE') {
      let nextPage = this.props.document_editor_mode.page_nos.slice(-1)[0];
      this.makeAPICallFetchContent(nextPage, true);
    }


  }

  componentWillUnmount() {
    localStorage.setItem("recordId", "");
    localStorage.setItem("inputFile", "");

    let recordId = this.props.match.params.jobid;
    let jobId = recordId ? recordId.split("|")[0] : ""
    TELEMETRY.endTranslatorFlow(jobId)
    this.props.clearFetchContent()
    this.props.clearShowPdf()
  }

  handleSourceScroll(id) {
    this.refs[id] && this.refs[id].scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  /**
   * API methods
   */

  makeAPICallFetchContent = (page_no, apiStatus) => {
    let startStatus = PAGE_OPS.page_status(this.props.document_contents.pages, page_no);
    let endStatus = PAGE_OPS.page_status(this.props.document_contents.pages, page_no + 1);
    if (startStatus && endStatus) {
      const apiObj = new FileContent(this.props.match.params.jobid, page_no, page_no + 1);
      this.props.APITransport(apiObj);
      !apiStatus && this.setState({ apiFetchStatus: true })
    }
    else if (startStatus) {
      const apiObj = new FileContent(this.props.match.params.jobid, page_no, page_no);
      this.props.APITransport(apiObj);
      !apiStatus && this.setState({ apiFetchStatus: true })
    }
    else if (endStatus) {
      const apiObj = new FileContent(this.props.match.params.jobid, page_no + 1, page_no + 1);
      this.props.APITransport(apiObj);
    }

  }

  makeAPICallDocumentsTranslationProgress() {
    const { APITransport } = this.props;
    const apiObj = new JobStatus([this.props.match.params.jobid]);
    APITransport(apiObj);

  }

  makeAPICallFetchContentPerPage = (start_page) => {


    const apiObj = new FetchContentUpdate(this.props.match.params.jobid, start_page, start_page);
    this.props.APITransport(apiObj);
  }

  async makeAPICallMergeSentence(sentences, pageNumber) {

    let sentence_ids = sentences.map(sentence => sentence.s_id)
    let updated_blocks = BLOCK_OPS.do_sentences_merging_v1(this.props.document_contents.pages, sentence_ids);

    /**
     * telemetry information.
     */
    let initial_sentences = sentences.map(sentence => sentence.src);
    let final_sentence = updated_blocks['blocks'][0].tokenized_sentences[0].src;
    TELEMETRY.mergeSentencesEvent(initial_sentences, final_sentence)
    let model = this.fetchModel(parseInt(this.props.match.params.modelId))
    this.informUserProgress(translate('common.page.label.SENTENCE_MERGED'))
    let apiObj = new WorkFlowAPI("WF_S_TR", updated_blocks.blocks, this.props.match.params.jobid, this.props.match.params.locale,
      '', '', model, sentence_ids)
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        TELEMETRY.log("merge", rsp_data.message)
        this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_FAILED'), false)
        return Promise.reject('');
      } else {
        this.props.contentUpdateStarted();
        this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
        this.processEndMergeMode(pageNumber)
        this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_SUCCESS'), true)
        this.makeAPICallDocumentsTranslationProgress();
      }
    }).catch((error) => {
      this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_FAILED'), false)
      this.processEndMergeMode(pageNumber)
    });
  }

  async makeAPICallSaveSentence(sentence, pageNumber) {
    this.informUserProgress(translate('common.page.label.SENTENCE_SAVED'))

    let apiObj = new SaveSentenceAPI(sentence)
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        TELEMETRY.log("save-translation", rsp_data.message)
        this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_FAILED'), false)
        return Promise.reject('');
      } else {
        this.props.contentUpdateStarted()
        this.props.update_sentences(pageNumber, rsp_data.data);
        this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_SUCCESS'), true)
        this.makeAPICallDocumentsTranslationProgress();
      }
    }).catch((error) => {
      this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_FAILED'), false)
    });
  }

  async makeAPICallSplitSentence(sentence, pageNumber, startIndex, endIndex) {

    let updated_blocks = BLOCK_OPS.do_sentence_splitting_v1(this.props.document_contents.pages, sentence.block_identifier, sentence, startIndex, endIndex);
    TELEMETRY.splitSentencesEvent(sentence.src, updated_blocks.splitted_sentences)
    let model = this.fetchModel(parseInt(this.props.match.params.modelId))
    this.informUserProgress(translate('common.page.label.SENTENCE_SPLITTED'))
    let apiObj = new WorkFlowAPI("WF_S_TR", updated_blocks.blocks, this.props.match.params.jobid, this.props.match.params.locale,
      '', '', model, updated_blocks.selected_sentence_ids)
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        TELEMETRY.log("split", rsp_data.message)
        this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_FAILED'), false)
        return Promise.reject('');
      } else {
        this.props.contentUpdateStarted();
        this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
        this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_SUCCESS'), true)
        this.makeAPICallDocumentsTranslationProgress();
      }
    }).catch((error) => {
      this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_FAILED'), false)
    });
  }

  async makeAPICallSourceSaveSentence(sentence, pageNumber) {
    this.informUserProgress(translate('common.page.label.SOURCE_SENTENCE_SAVED'))
    let model = this.fetchModel(parseInt(this.props.match.params.modelId))

    let apiObj = new WorkFlowAPI("WF_S_TKTR", sentence, this.props.match.params.jobid, this.props.match.params.locale,
      '', '', model)
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        TELEMETRY.log("save-sentence", rsp_data.message)
        this.informUserStatus(translate('common.page.label.SOURCE_SENTENCE_SAVED_FAILED'), false)
        return Promise.reject('');
      } else {
        this.props.contentUpdateStarted()
        this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
        this.informUserStatus(translate('common.page.label.SOURCE_SENTENCE_SAVED_SUCCESS'), true)
      }
    }).catch((error) => {
      this.informUserStatus(translate('common.page.label.SOURCE_SENTENCE_SAVED_FAILED'), false)
    });
  }

  fetchModel(modelId) {
    let model = ""

    let docs = this.props.fetch_models
    if (docs && docs.length > 0) {
      let condition = `$[?(@.model_id == '${modelId}')]`;
      model = jp.query(docs, condition)
    }

    return model.length > 0 ? model[0] : null
  }

  /**
   * workhorse functions
   */
  processStartMergeMode(pageNumber) {
    if (pageNumber === 1) {
      this.props.editorModeMerge([], [pageNumber, pageNumber + 1])
    } else {
      this.props.editorModeMerge([], [pageNumber - 1, pageNumber, pageNumber + 1])
    }
  }

  processEndMergeMode(pageNumber) {
    if (pageNumber === 1) {
      this.props.editorModeNormal([], [pageNumber, pageNumber + 1])
    } else {
      this.props.editorModeNormal([], [pageNumber - 1, pageNumber, pageNumber + 1])
    }
    /**
     * hack :- clear off the eligible page to avoid further checking and then re-render
     *        in SentenceCard
     */
    setTimeout(() => { this.props.editorModeClear() }, 50)
  }

  processSentenceAction = (action, pageNumber, sentences, startIndex, endIndex) => {

    switch (action) {
      case SENTENCE_ACTION.SENTENCE_SAVED: {
        this.makeAPICallSaveSentence(sentences[0], pageNumber)
        return;
      }

      case SENTENCE_ACTION.SENTENCE_SPLITTED: {
        if (startIndex === endIndex) {
          this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_INVALID_INPUT'), false)
          return;
        }
        this.makeAPICallSplitSentence(sentences[0], pageNumber, startIndex, endIndex);

        return;
      }

      case SENTENCE_ACTION.SENTENCE_MERGED: {
        if (this.forMergeSentences.length < 2) {
          this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_INVALID_INPUT'), false)
          this.processEndMergeMode(pageNumber)
          return;
        }
        this.makeAPICallMergeSentence(this.forMergeSentences, pageNumber);
        this.forMergeSentences = []
        return;
      }

      case SENTENCE_ACTION.SENTENCE_SOURCE_EDITED: {
        this.makeAPICallSourceSaveSentence(sentences, pageNumber)
        return;
      }

      case SENTENCE_ACTION.START_MODE_MERGE: {
        this.forMergeSentences = []
        this.processStartMergeMode(pageNumber)

        return;
      }

      case SENTENCE_ACTION.END_MODE_MERGE: {
        this.processEndMergeMode(pageNumber)
        this.forMergeSentences = []
        return;
      }
      case SENTENCE_ACTION.ADD_SENTENCE_FOR_MERGE: {
        this.forMergeSentences = [...this.forMergeSentences, ...sentences]
        return;
      }
      case SENTENCE_ACTION.REMOVE_SENTENCE_FOR_MERGE: {
        this.forMergeSentences = this.forMergeSentences.filter(sent => sent.s_id !== sentences[0].s_id)
        return;
      }
      default:
        return;
    }
  }

  /**
   * progress information for user from API
   */
  informUserProgress = (message) => {
    this.setState({
      apiInProgress: true,
      showStatus: false,
      snackBarMessage: message
    })
  }
  informUserStatus = (message, isSuccess) => {
    this.setState({
      apiInProgress: false,
      showStatus: true,
      snackBarMessage: message,
      snackBarVariant: isSuccess ? "success" : "error"
    })
  }

  renderProgressInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.apiInProgress}
        message={this.state.snackBarMessage}
      >
        <Alert elevation={6} variant="filled" severity="info">{this.state.snackBarMessage}</Alert>
      </Snackbar>
    )
  }

  renderStatusInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.showStatus}
        onClose={(e, r) => {
          this.setState({ showStatus: false })
        }}
      >
        <Alert elevation={6} variant="filled" severity={this.state.snackBarVariant}>{this.state.snackBarMessage}</Alert>
      </Snackbar>
    )
  }

  handleViewModeToggle = () => {
    this.setState({
      isModeSentences: !this.state.isModeSentences
    })
  }

  handleOnClose = (e) => {
    e.preventDefault()
    let recordId = this.props.match.params.jobid;
    let jobId = recordId ? recordId.split("|")[0] : ""
    TELEMETRY.endTranslatorFlow(jobId)
    this.props.ClearContent()
    history.push(`${process.env.PUBLIC_URL}/view-document`);
  }

  /**
   * all render functions starts here
   */


  /**
   * renders PDF document
   */
  renderPDFDocument = () => {
    if (!this.state.apiFetchStatus) {
      return (
        <Grid item xs={12} sm={6} lg={6} xl={6} style={{ marginLeft: "5px" }}>
          <Paper>
            <PDFRenderer parent='document-editor' filename={this.props.match.params.inputfileid} pageNo={this.props.active_page_number} />
          </Paper>
        </Grid>
      )
    }

  }

  handleDocumentView = () => {
    this.setState({ docView: !this.state.docView })
  }

  /**
   * util to get selected page
   */
  getPages = () => {
    let pages;
    if (this.props.document_editor_mode.mode === 'EDITOR_MODE_MERGE') {
      pages = PAGE_OPS.get_pages_children_information(this.props.document_contents.pages, this.props.active_page_number, this.props.document_editor_mode.page_nos.slice(-1)[0]);
    }
    else {
      pages = PAGE_OPS.get_pages_children_information(this.props.document_contents.pages, this.props.active_page_number);
    }
    return pages;
  }

  /**
   * render Document pages
   */
  renderDocumentPages = () => {
    let pages = this.getPages();

    if (pages.length < 1) {
      return (
        <div></div>
      )
    }
    return (
      <Grid item xs={12} sm={6} lg={6} xl={6} style={{ marginRight: "5px" }}>
        <InfiniteScroll height={window.innerHeight - 141} style={{
          maxHeight: window.innerHeight - 141,
          overflowY: "hidden",
        }}
          dataLength={pages.length}
        >
            {pages.map((page, index) => <PageCard zoomPercent={this.state.zoomPercent} key={index} page={page} onAction={this.processSentenceAction} />)}
        </InfiniteScroll>
      </Grid>
    )
  }
  processZoomIn = () => {
    if (this.state.zoomPercent < 140) {
      if (this.state.zoomPercent + 10 === 140) {
        this.setState({ zoomPercent: this.state.zoomPercent + 10, zoomInDisabled: !this.state.zoomInDisabled })
      }
      else {
        this.setState({ zoomPercent: this.state.zoomPercent + 10, zoomOutDisabled: false })
      }
    } else {
      this.setState({ zoomInDisabled: !this.state.zoomInDisabled })
    }
  }

  processZoomOut = () => {
    if (this.state.zoomPercent > 60) {
      if (this.state.zoomPercent - 10 === 60) {
        this.setState({ zoomPercent: this.state.zoomPercent - 10, zoomOutDisabled: !this.state.zoomOutDisabled })
      }
      else {
        this.setState({ zoomPercent: this.state.zoomPercent - 10, zoomInDisabled: false })
      }
    } else {
      this.setState({ zoomOutDisabled: !this.state.zoomOutDisabled })
    }
  }

  /***
   * render sentences
   */
  renderSentences = () => {

    let pages = this.getPages()
    if (pages.length < 1) {
      return (
        <div></div>
      )
    }
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginLeft: "5px" }}>

        <InfiniteScroll height={window.innerHeight - 141} style={{
          maxHeight: window.innerHeight - 141,
          overflowY: "auto",
        }}
          hasMore={(this.props.document_contents.count > this.props.document_contents.pages.length) ? true : false}
          dataLength={pages.length}
        >
          {pages.map(page => page['translated_texts'].map((sentence, index) => <div key={sentence.s_id} ref={sentence.s_id}><SentenceCard key={sentence.s_id}
            pageNumber={page.page_no}
            modelId={parseInt(this.props.match.params.modelId)}
            word_locale={this.props.match.params.locale}
            tgt_locale={this.props.match.params.tgt_locale}
            sentence={sentence}
            onAction={this.processSentenceAction} />
          </div>))}
        </InfiniteScroll>
      </Grid>

    )
  }


  /**
   * render functions ends here
   */
  processZoom = () => {
    return (
      <div style={{ marginLeft: '1%', marginRight: "2%" }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.processZoomIn}
          disabled={this.state.zoomInDisabled} >
          +
          </Button>
        <input
          style={{
            backgroundColor: 'white',
            border: 'none',
            borderBottom: '1px solid black',
            margin: '2%',
            textAlign: 'center',
            width: '15%',
            height: '40%',
            fontSize: '17px'
          }} value={`${this.state.zoomPercent}%`}
          disabled />
        <Button
          variant="outlined"
          color="primary"
          onClick={this.processZoomOut}
          disabled={this.state.zoomOutDisabled}
        >
          -
          </Button>
      </div >);
  }
  render() {
    return (
      <div style={{ height: window.innerHeight }}>
        <div style={{ height: "50px", marginBottom: "13px" }}> <InteractiveDocToolBar docView={this.state.docView} onAction={this.handleDocumentView} /></div>

        <div style={{ height: window.innerHeight - 141, maxHeight: window.innerHeight - 141, overflow: "hidden", padding: "0px 24px 0px 24px", display: "flex", flexDirection: "row" }}>
          {!this.state.docView && this.renderDocumentPages()}
          {!this.props.show_pdf ? this.renderSentences() : this.renderPDFDocument()}
        </div>
        <div style={{ height: "65px", marginTop: "13px", bottom: "0px", position: "absolute", width: "100%" }}>
          <InteractivePagination count={this.props.document_contents.count}
            data={this.props.document_contents.pages}
            zoomPercent={this.state.zoomPercent}
            processZoom={this.processZoom}
            zoomInDisabled={this.state.zoomInDisabled}
            zoomOutDisabled={this.state.zoomOutDisabled}
            onAction={this.processSentenceAction} />
        </div>
        {this.state.apiInProgress ? this.renderProgressInformation() : <div />}
        {this.state.showStatus ? this.renderStatusInformation() : <div />}
        {this.state.apiFetchStatus && <Spinner />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  saveContent: state.saveContent,
  document_contents: state.document_contents,
  sentence_action_operation: state.sentence_action_operation,
  show_pdf: state.show_pdf.open,
  sentence_highlight: state.sentence_highlight.sentence,
  active_page_number: state.active_page_number.page_number,
  document_editor_mode: state.document_editor_mode,
  fetchDocument: state.fetchDocument,
  fetch_models: state.fetch_models.models
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    contentUpdateStarted,
    APITransport,
    update_sentences,
    update_blocks,
    ClearContent,
    clearFetchContent,
    editorModeNormal, editorModeMerge, editorModeClear,
    showPdf,
    clearShowPdf
  },
  dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentEditor));
