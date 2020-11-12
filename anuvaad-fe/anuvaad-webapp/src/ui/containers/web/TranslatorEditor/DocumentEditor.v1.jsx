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
import FetchContentUpdate from "../../../../flux/actions/apis/v1_fetch_content_update";

import Spinner from "../../../components/web/common/Spinner";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Typography from "@material-ui/core/Typography";
import Snackbar from "../../../components/web/common/Snackbar";
import WorkFlowAPI from "../../../../flux/actions/apis/fileupload";
import TextButton from '@material-ui/core/Button';
import LanguageCodes from "../../../components/web/common/Languages.json"
import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PDFRenderer from './PDFRenderer';
import SaveSentenceAPI from '../../../../flux/actions/apis/savecontent';
import SentenceCard from './SentenceCard';
import PageCard from "./PageCard";
import SENTENCE_ACTION from './SentenceActions'
import DocumentConverterAPI from "../../../../flux/actions/apis/documentconverter";

// import PAGE_OPS from "../../../../utils/page.operations";
// import BLOCK_OPS from "../../../../utils/block.operations";
// import TELEMETRY from '../../../../utils/TelemetryManager';

import { sentenceActionApiStarted, sentenceActionApiStopped, contentUpdateStarted, clearFetchContent } from '../../../../flux/actions/users/translator_actions';
import { update_sentences, update_blocks } from '../../../../flux/actions/apis/update_page_content';
import { editorModeClear, editorModeNormal, editorModeMerge } from '../../../../flux/actions/editor/document_editor_mode';

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
            isShowSnackbar: false,
            isModeMerge: false,
            mergeModePages: []
        }
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
    }

    componentDidUpdate(prevProps) {
      if (prevProps.document_contents.content_updated !== this.props.document_contents.content_updated) {
        if (this.props.document_contents.content_updated) {
          this.props.sentenceActionApiStopped()
        }
      }

      // if (prevProps.sentence_highlight !== this.props.sentence_highlight && this.props.sentence_highlight && this.props.sentence_highlight && this.props.sentence_highlight.sentence_id) {
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
      console.log(`fetching document content, start_page: ${start_page}, end_page: ${end_page}`);

      const apiObj      = new FileContent(this.props.match.params.jobid, start_page, end_page);
      this.props.APITransport(apiObj);
    }

    makeAPICallFetchContentPerPage = (start_page) => {
      console.log(`fetching modified document content, start_page: ${start_page}, end_page: ${start_page}`);

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

      let apiObj      = new WorkFlowAPI("WF_S_TR", updated_blocks.blocks, this.props.match.params.jobid, this.props.match.params.locale, 
                                          '', '', parseInt(this.props.match.params.modelId))
      const apiReq    = fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
          if (!response.ok) {
            this.props.sentenceActionApiStopped()
            return Promise.reject('');
          } else {
            this.props.contentUpdateStarted();
            this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
            this.processEndMergeMode(pageNumber)
          }
      }).catch((error) => {
          console.log('api failed because of server or network', error)
          this.props.sentenceActionApiStopped()
          this.processEndMergeMode(pageNumber)
      });
    }

    async makeAPICallSaveSentence(sentence, pageNumber) {
      
      let apiObj      = new SaveSentenceAPI(sentence)
      const apiReq    = fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
          if (!response.ok) {
            this.props.sentenceActionApiStopped()
            return Promise.reject('');
          } else {
            this.props.contentUpdateStarted()
            this.props.update_sentences(pageNumber, rsp_data.data);
          }
      }).catch((error) => {
          console.log('api failed because of server or network')
          this.props.sentenceActionApiStopped()
      });
    }

    async makeAPICallSplitSentence(sentence, pageNumber, startIndex, endIndex) {
      let updated_blocks = BLOCK_OPS.do_sentence_splitting_v1(this.props.document_contents.pages, sentence.block_identifier, sentence, startIndex, endIndex);
      TELEMETRY.splitSentencesEvent(sentence.src, updated_blocks.splitted_sentences)

      let apiObj      = new WorkFlowAPI("WF_S_TR", updated_blocks.blocks, this.props.match.params.jobid, this.props.match.params.locale, 
                                                '', '', parseInt(this.props.match.params.modelId))
      const apiReq    = fetch(apiObj.apiEndPoint(), {
          method: 'post',
          body: JSON.stringify(apiObj.getBody()),
          headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
          if (!response.ok) {
            this.props.sentenceActionApiStopped()
            return Promise.reject('');
          } else {
            this.props.contentUpdateStarted();
            this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
          }
      }).catch((error) => {
          console.log('api failed because of server or network')
          this.props.sentenceActionApiStopped()
      });
    }

    async makeAPICallSourceSaveSentence(sentence, pageNumber) {

      let apiObj = new WorkFlowAPI("WF_S_TKTR", sentence, this.props.match.params.jobid, this.props.match.params.locale,
        '', '', parseInt(this.props.match.params.modelId))
      const apiReq = fetch(apiObj.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
        if (!response.ok) {
          this.props.sentenceActionApiStopped()
          return Promise.reject('');
        } else {
          this.props.contentUpdateStarted()
          this.props.update_blocks(pageNumber, rsp_data.output.textBlocks);
        }
      }).catch((error) => {
        console.log('api failed because of server or network')
        this.props.sentenceActionApiStopped()
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
          this.props.sentenceActionApiStopped()
          return Promise.reject('');
        } else {
          let fileName = rsp_data && rsp_data.translated_document && rsp_data.translated_document ? rsp_data.translated_document : ""
          console.log(fileName)
          if (fileName) {
            let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${fileName}`
            window.open(url, "_self")
          }
          this.props.sentenceActionApiStopped()
  
        }
      }).catch((error) => {
        console.log('api failed because of server or network')
        this.props.sentenceActionApiStopped()
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

      console.log('processSentenceAction', action, pageNumber, sentences, startIndex, endIndex)
      switch(action) {
        case SENTENCE_ACTION.SENTENCE_SAVED: {
          this.props.sentenceActionApiStarted(sentences[0])
          this.makeAPICallSaveSentence(sentences[0], pageNumber)
          this.setMessages(SENTENCE_ACTION.SENTENCE_SAVED, "savedMessage")
         
          return;
        }

        case SENTENCE_ACTION.SENTENCE_SPLITTED: {
          
          this.props.sentenceActionApiStarted(null)
          this.makeAPICallSplitSentence(sentences[0], pageNumber, startIndex, endIndex);
          this.setMessages(SENTENCE_ACTION.SENTENCE_SPLITTED, "splittedMessage")
          return;
        }

        case SENTENCE_ACTION.SENTENCE_MERGED: {
          /**
           * make card busy as merge operation is started by it.
           */
          this.props.sentenceActionApiStarted(null)

          this.makeAPICallMergeSentence(this.props.sentence_action_operation.sentences, pageNumber);
          this.setMessages(SENTENCE_ACTION.SENTENCE_MERGED, "mergedMessage")
          return;
        }

        case SENTENCE_ACTION.SENTENCE_SOURCE_EDITED: {
          this.props.sentenceActionApiStarted(null)
          this.makeAPICallSourceSaveSentence(sentences, pageNumber)
          this.setMessages(SENTENCE_ACTION.SENTENCE_SOURCE_EDITED, "editedMessage")
          return;
        }

        case SENTENCE_ACTION.START_MODE_MERGE: {
          this.processStartMergeMode(pageNumber)
          
          return;
        }

        case SENTENCE_ACTION.END_MODE_MERGE: {
          this.processEndMergeMode(pageNumber)
          return;
        }
      }
    }

    setMessages = (pendingAction, completedAction) => {
        this.setState({snackBarMessage:translate(`common.page.label.${pendingAction}`), 
        snackBarSavedMessage:translate(`common.page.label.${completedAction}`), 
      })
    }

    snackBarMessage = () =>{
      return (
        <div>
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.props.sentence_action_operation.api_status}
            autoHideDuration={!this.props.sentence_action_operation.api_status && 2000}
            variant={this.props.sentence_action_operation.api_status ? "info" : "success"}
            message={this.props.sentence_action_operation.api_status ? this.state.snackBarMessage : this.state.snackBarSavedMessage}
          />
          </div>
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
     * render the toolbar
     */
    renderToolBar = () => {
        return (
            <Grid container
                spacing={2}
                style={{ marginTop: "-3px", padding: "10px 5px 0px 17px", width: "100%", position: "fixed", zIndex: 1000, background: "#F5F9FA" }}>
            
                <Grid item xs={12} sm={6} lg={2} xl={2} className="GridFileDetails">
                    <Button
                    // variant="outlined"
                    onClick={event => {
                        this.handleOnClose(event);
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
                            {/* {!this.state.apiCall ? (this.state.isModeSentences ? "Sentences" : "PDF") : "Saving....."} */}
                            { (this.state.isModeSentences ? "Sentences" : "PDF")}
                        </div>
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} lg={1} xl={1}>
                    <Button
                        onClick={() => { 
                          this.props.sentenceActionApiStarted(null);
                          this.handleTargetDownload();
                          this.setMessages("download", "downloadCompleted")}}
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
                        {this.state.isModeSentences ? "See PDF" : "See sentences"}
                        <ChevronRightIcon fontSize="large" />
                    </Button>
                </Grid>

            </Grid>
        )
    }

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
      console.log('DE render')
        return (
        <div>
            {/* {this.renderToolBar()} */}
            <Grid container spacing={2} style={{ padding: "0px 24px 0px 24px" }}>
                {this.renderDocumentPages()}
                {!this.props.show_pdf ? this.renderSentences() : this.renderPDFDocument()}
            </Grid>
            {(this.state.snackBarMessage || this.state.snackBarSavedMessage) && this.snackBarMessage()}
            {(this.props.document_contents.pages.length<1) && < Spinner />}
        </div>
        )
    }
}

const mapStateToProps = state => ({
    saveContent: state.saveContent,
    document_contents: state.document_contents,
    sentence_action_operation : state.sentence_action_operation,
    show_pdf: state.show_pdf.open
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
      sentenceActionApiStarted,
      sentenceActionApiStopped,
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
