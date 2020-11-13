import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Grid from "@material-ui/core/Grid";
import { translate } from "../../../../assets/localisation";
import history from "../../../../web.history";
import ClearContent from "../../../../flux/actions/apis/clearcontent";
import FileContent from "../../../../flux/actions/apis/fetchcontent";
import FetchContentUpdate from "../../../../flux/actions/apis/v1_fetch_content_update";

import Spinner from "../../../components/web/common/Spinner";
import Paper from "@material-ui/core/Paper";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import WorkFlowAPI from "../../../../flux/actions/apis/fileupload";
import LanguageCodes from "../../../components/web/common/Languages.json"
import PDFRenderer from './PDFRenderer';
import SaveSentenceAPI from '../../../../flux/actions/apis/savecontent';
import SentenceCard from './SentenceCard';
import PageCard from "./PageCard";
import SENTENCE_ACTION from './SentenceActions'
import DocumentConverterAPI from "../../../../flux/actions/apis/documentconverter";

// import PAGE_OPS from "../../../../utils/page.operations";
// import BLOCK_OPS from "../../../../utils/block.operations";
// import TELEMETRY from '../../../../utils/TelemetryManager';

import { contentUpdateStarted, clearFetchContent } from '../../../../flux/actions/users/translator_actions';
import { update_sentences, update_blocks } from '../../../../flux/actions/apis/update_page_content';
import { editorModeClear, editorModeNormal, editorModeMerge } from '../../../../flux/actions/editor/document_editor_mode';

import InteractiveDocToolBar from "./InteractiveDocHeader"

const PAGE_OPS = require("../../../../utils/page.operations");
const BLOCK_OPS = require("../../../../utils/block.operations");
const TELEMETRY = require('../../../../utils/TelemetryManager')

class DocumentEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModeSentences: true,
            currentPageIndex: 1,
            apiInProgress: false,
            snackBarMessage: '',
        }
        this.forMergeSentences = []
    }

    /**
     * life cycle methods
     */
    componentDidMount() {
      TELEMETRY.pageLoadCompleted('document-editor')
      let recordId  = this.props.match.params.jobid;
      let jobId     = recordId ? recordId.split("|")[0] : ""

      localStorage.setItem("recordId", recordId);
      localStorage.setItem("inputFile", this.props.match.params.inputfileid)
  
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
      this.makeAPICallFetchContent();
      window.addEventListener('popstate',this.handleOnClose);
      window.addEventListener('beforeunload',this.handleOnClose);
    }

    componentDidUpdate(prevProps) {
     if (prevProps.sentence_highlight !== this.props.sentence_highlight) {
        this.handleSourceScroll(this.props.sentence_highlight.sentence_id)
      }
    }

    componentWillUnmount() {
      localStorage.setItem("recordId", "");
      localStorage.setItem("inputFile", "");

      let recordId  = this.props.match.params.jobid;
      let jobId     = recordId ? recordId.split("|")[0] : ""
      TELEMETRY.endTranslatorFlow(jobId)
      this.props.clearFetchContent()
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

    makeAPICallFetchContent =  () => {
      let start_page    = this.props.document_contents.pages.length + 1;
      let end_page      = start_page + 1;
      

      const apiObj      = new FileContent(this.props.match.params.jobid, start_page, end_page);
      this.props.APITransport(apiObj);
    }

    makeAPICallFetchContentPerPage = (start_page) => {
      

      const apiObj      = new FetchContentUpdate(this.props.match.params.jobid, start_page, start_page);
      this.props.APITransport(apiObj);
    }

    async makeAPICallMergeSentence(sentences, pageNumber) {
      let sentence_ids   = sentences.map(sentence => sentence.s_id)
      let updated_blocks = BLOCK_OPS.do_sentences_merging_v1(this.props.document_contents.pages, sentence_ids);

      /**
       * telemetry information.
       */
      let initial_sentences = sentences.map(sentence => sentence.src);
      let final_sentence    = updated_blocks['blocks'][0].tokenized_sentences.src;
      TELEMETRY.mergeSentencesEvent(initial_sentences, final_sentence)

      this.informUserProgress(translate('common.page.label.SENTENCE_MERGED'))
      let apiObj      = new WorkFlowAPI("WF_S_TR", updated_blocks.blocks, this.props.match.params.jobid, this.props.match.params.locale, 
                                          '', '', parseInt(this.props.match.params.modelId))
      const apiReq    = fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
          if (!response.ok) {
            this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_FAILED'), false)
            return Promise.reject('');
          } else {
            this.props.contentUpdateStarted();
            this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
            this.processEndMergeMode(pageNumber)
            this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_SUCCESS'), true)
          }
      }).catch((error) => {
          this.informUserStatus(translate('common.page.label.SENTENCE_MERGED_FAILED'), false)
          this.processEndMergeMode(pageNumber)
      });
    }

    async makeAPICallSaveSentence(sentence, pageNumber) {
      this.informUserProgress(translate('common.page.label.SENTENCE_SAVED'))

      let apiObj      = new SaveSentenceAPI(sentence)
      const apiReq    = fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
          if (!response.ok) {
            this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_FAILED'), false)
            return Promise.reject('');
          } else {
            this.props.contentUpdateStarted()
            this.props.update_sentences(pageNumber, rsp_data.data);
            this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_SUCCESS'), true)
          }
      }).catch((error) => {
        this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_FAILED'), false)
      });
    }

    async makeAPICallSplitSentence(sentence, pageNumber, startIndex, endIndex) {
      let updated_blocks = BLOCK_OPS.do_sentence_splitting_v1(this.props.document_contents.pages, sentence.block_identifier, sentence, startIndex, endIndex);
      TELEMETRY.splitSentencesEvent(sentence.src, updated_blocks.splitted_sentences)

      this.informUserProgress(translate('common.page.label.SENTENCE_SPLITTED'))
      let apiObj      = new WorkFlowAPI("WF_S_TR", updated_blocks.blocks, this.props.match.params.jobid, this.props.match.params.locale, 
                                                '', '', parseInt(this.props.match.params.modelId))
      const apiReq    = fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
          if (!response.ok) {
            this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_FAILED'), false)
            return Promise.reject('');
          } else {
            this.props.contentUpdateStarted();
            this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
            this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_SUCCESS'), true)
          }
      }).catch((error) => {
        this.informUserStatus(translate('common.page.label.SENTENCE_SPLITTED_FAILED'), false)
      });
    }

    async makeAPICallSourceSaveSentence(sentence, pageNumber) {
      this.informUserProgress(translate('common.page.label.SOURCE_SENTENCE_SAVED'))
      let apiObj = new WorkFlowAPI("WF_S_TKTR", sentence, this.props.match.params.jobid, this.props.match.params.locale,
        '', '', parseInt(this.props.match.params.modelId))
      const apiReq = fetch(apiObj.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
        if (!response.ok) {
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

    handleTargetDownload() {
      let recordId = this.props.match.params.jobid
      let user_profile = JSON.parse(localStorage.getItem('userProfile'))
  
      let apiObj = new DocumentConverterAPI(recordId, user_profile.id)
      const apiReq = fetch(apiObj.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
        if (!response.ok) {
          this.informUserStatus(translate('common.page.label.FILE_DOWNLOAD_FAILED'), false)
          return Promise.reject('');
        } else {
          let fileName = rsp_data && rsp_data.translated_document && rsp_data.translated_document ? rsp_data.translated_document : ""
          if (fileName) {
            let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${fileName}`
            window.open(url, "_self")
          }
        }
      }).catch((error) => {
        this.informUserStatus(translate('common.page.label.FILE_DOWNLOAD_FAILED'), false)
      });
    }

    /**
     * workhorse functions
     */
    processStartMergeMode(pageNumber) {
      if (pageNumber === 1) {
        this.props.editorModeMerge([], [pageNumber, pageNumber+1])
      } else {
        this.props.editorModeMerge([], [pageNumber-1, pageNumber, pageNumber+1])
      }
    }

    processEndMergeMode(pageNumber) {
      if (pageNumber === 1) {
        this.props.editorModeNormal([], [pageNumber, pageNumber+1])
      } else {
        this.props.editorModeNormal([], [pageNumber-1, pageNumber, pageNumber+1])
      }
      /**
       * hack :- clear off the eligible page to avoid further checking and then re-render
       *        in SentenceCard
       */
      setTimeout(() => { this.props.editorModeClear()}, 50)
    }

    processSentenceAction = (action, pageNumber, sentences, startIndex, endIndex) => {

      
      
      switch(action) {
        case SENTENCE_ACTION.SENTENCE_SAVED: {
          this.makeAPICallSaveSentence(sentences[0], pageNumber)
          return;
        }

        case SENTENCE_ACTION.SENTENCE_SPLITTED: {
          if(startIndex === endIndex) {
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
          this.forMergeSentences  = []
          return;
        }

        case SENTENCE_ACTION.SENTENCE_SOURCE_EDITED: {
          this.makeAPICallSourceSaveSentence(sentences, pageNumber)
          return;
        }

        case SENTENCE_ACTION.START_MODE_MERGE: {
          this.forMergeSentences  = []
          this.processStartMergeMode(pageNumber)
          
          return;
        }

        case SENTENCE_ACTION.END_MODE_MERGE: {
          this.processEndMergeMode(pageNumber)
          this.forMergeSentences  = []
          return;
        }
        case SENTENCE_ACTION.ADD_SENTENCE_FOR_MERGE: {
          this.forMergeSentences  = [...this.forMergeSentences, ...sentences]
          return;
        }
        case SENTENCE_ACTION.REMOVE_SENTENCE_FOR_MERGE: {
          this.forMergeSentences  = this.forMergeSentences.filter(sent => sent.s_id !== sentences[0].s_id)
          return;
        }
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
            this.setState({showStatus: false})}}
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
      let recordId  = this.props.match.params.jobid;
      let jobId     = recordId ? recordId.split("|")[0] : ""
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
      return (
        <Grid item xs={12} sm={6} lg={6} xl={6}>
          <Paper>
            <PDFRenderer parent='document-editor' filename={this.props.match.params.inputfileid} pageNo={this.state.currentPageIndex} />
          </Paper>
        </Grid>
      )
    }

    /**
     * render Document pages
     */
    renderDocumentPages = () => {
      let pages = PAGE_OPS.get_pages_children_information(this.props.document_contents.pages);
      if (pages.length < 1) {
        return(
            <div></div>
        )
      }
      return(
        <Grid item xs={12} sm={6} lg={6} xl={6}>
          <InfiniteScroll  height={1200} style={{
            maxHeight: window.innerHeight - 80,
            overflowY: "auto",
          }}
            next={this.makeAPICallFetchContent}
            hasMore={(this.props.document_contents.count > this.props.document_contents.pages.length) ? true : false }
            dataLength={pages.length}
            loader={<div style={{ textAlign: "center" }}> <CircularProgress size={20} style={{zIndex: 1000}}/></div>}
            endMessage={ <div style={{ textAlign: "center" }}><b>You have seen it all</b></div> }
          >
            {pages.map((page, index) => <PageCard key={index} page={page} onAction={this.processSentenceAction}/>)}
          </InfiniteScroll>
        </Grid>
      )
    }

    /***
     * render sentences
     */
    renderSentences = () => {
      let pages = PAGE_OPS.get_pages_children_information(this.props.document_contents.pages);
      if (pages.length < 1) {
        return(
            <div></div>
        )
      }
      return (
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            
            <InfiniteScroll  height={1200}  style={{
            maxHeight: window.innerHeight - 80,
            overflowY: "auto",
          }}
                next={this.makeAPICallFetchContent}
                hasMore={(this.props.document_contents.count > this.props.document_contents.pages.length) ? true : false }
                dataLength={pages.length}
                loader={<div style={{ textAlign: "center" }}> <CircularProgress size={20} style={{zIndex: 1000}}/></div>}
                endMessage={ <div style={{ textAlign: "center" }}><b>You have seen it all</b></div> }
            >
              {pages.map(page => page['translated_texts'].map((sentence, index) => <div key={index}  ref={sentence.s_id}><SentenceCard key={index} 
                                                                                  pageNumber={page.page_no} 
                                                                                  modelId={parseInt(this.props.match.params.modelId)}
                                                                                  word_locale={this.props.match.params.locale}
                                                                                  tgt_locale={this.props.match.params.tgt_locale}
                                                                                  sentence={sentence} 
                                                                                  onAction={this.processSentenceAction}/>
                                                                                  </div>))}
            </InfiniteScroll>
          </Grid>
        
      )
    }


    /**
     * render functions ends here
     */

    render() {
        return (
        <div style={{height: window.innerHeight}}>
            <InteractiveDocToolBar />
            <Grid container spacing={2} style={{ padding: "63px 24px 0px 24px" }}>
                {this.renderDocumentPages()}
                {!this.props.show_pdf ? this.renderSentences() : this.renderPDFDocument()}
            </Grid>

            {this.state.apiInProgress ? this.renderProgressInformation() : <div />}
            {this.state.showStatus ? this.renderStatusInformation() : <div />}

            {(this.props.document_contents.pages.length<1) && < Spinner />}
        </div>
        )
    }
}

const mapStateToProps = state => ({
    saveContent: state.saveContent,
    document_contents: state.document_contents,
    sentence_action_operation : state.sentence_action_operation,
    show_pdf: state.show_pdf.open,
    sentence_highlight  : state.sentence_highlight.sentence
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
      contentUpdateStarted,
      APITransport,
      update_sentences,
      update_blocks,
      ClearContent,
      clearFetchContent,
      editorModeNormal, editorModeMerge, editorModeClear
    },
    dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DocumentEditor));
