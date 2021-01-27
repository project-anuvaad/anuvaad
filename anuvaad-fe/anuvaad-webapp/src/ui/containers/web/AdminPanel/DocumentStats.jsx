import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { translate } from "../../../../assets/localisation";
import Spinner from "../../../components/web/common/Spinner";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import ClearContent from "../../../../flux/actions/apis/document_translate/clearcontent";
import { showPdf, clearShowPdf } from '../../../../flux/actions/apis/document_translate/showpdf';
import { contentUpdateStarted, clearFetchContent } from '../../../../flux/actions/users/translator_actions';
import { update_sentences, update_blocks } from '../../../../flux/actions/apis/document_translate/update_page_content';
import { editorModeClear, editorModeNormal, editorModeMerge } from '../../../../flux/actions/editor/document_editor_mode';
import { clearHighlighBlock } from '../../../../flux/actions/users/translator_actions';
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import FileContent from "../../../../flux/actions/apis/document_translate/fetchcontent";
import UserReportHeader from "./UserReportHeader"


const TELEMETRY = require('../../../../utils/TelemetryManager')

class DocumentStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roles"),
      data: []
    };
  }

  componentDidMount = () => {
    const apiObj = new FileContent(this.props.match.params.recordId, "0", "0");
    fetch(apiObj.apiEndPoint(), {
      method: 'get',
      headers: apiObj.getHeaders().headers
    })
      .then(async res => {
        if (res) {
          const data = await res.json()
          const sentence = this.processSentenceInfo(data)
          this.setState({ data: sentence, loading: false })
        }
      })
  }

  processSentenceInfo(data) {
    let sentence = []
    data.data.map(data => {
      data.text_blocks.map(token => {
        token.tokenized_sentences.map(val => {
          if (val.save) {
            let h, m, s;
            let time_spent_ms;
            if (val.time_spent_ms) {
              h = Math.floor(val.time_spent_ms / 1000 / 60 / 60);
              m = Math.floor((val.time_spent_ms / 1000 / 60 / 60 - h) * 60);
              s = Math.floor(((val.time_spent_ms / 1000 / 60 / 60 - h) * 60 - m) * 60);
              s < 10 ? s = `0${s}` : s = `${s}`
              m < 10 ? m = `0${m}` : m = `${m}`
              h < 10 ? h = `0${h}` : h = `${h}`
              time_spent_ms = `${h}:${m}:${s}`
            } else {
              time_spent_ms = '-'
            }
            sentence.push({
              s0_src: val.s0_src,
              s0_tgt: val.s0_tgt,
              tgt: val.tgt,
              bleu_score: val.bleu_score ? Math.round(val.bleu_score * 100) / 100 : '-',
              time_spent: time_spent_ms
            })
          }
        })
      })
    })
    return sentence
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          padding: '3px 10px 3px',
        },
      },
      MUIDataTableHeadCell: {
        fixedHeader: {
          paddingLeft: '1.2%'
        }
      }
    }
  })


  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   TELEMETRY.pageLoadStarted('document-stats')
  //   /**
  //    * getSnapshotBeforeUpdate() must return null
  //    */
  //   return null;
  // }



  processTableClickedNextOrPrevious = (page) => {
    if (this.state.currentPageIndex < page) {
      // this.processFetchBulkUserDetailAPI(this.state.limit + this.state.offset, this.state.limit, true, false)
      this.setState({
        currentPageIndex: page,
        offset: this.state.offset + this.state.limit
      });
    }
  };

  render() {
    const columns = [
      {
        name: "s0_src",
        label: 'Source',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        name: "s0_tgt",
        label: "Machine Translation",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "tgt",
        label: 'Proof Read',
        options: {
          filter: false,
          sort: true,
        }
      },

      {
        name: "bleu_score",
        label: "Bleu Score",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "time_spent",
        label: "Time Spent",
        options: {
          filter: false,
          sort: false,
        }
      },
    ];


    const options = {
      textLabels: {
        body: {
          noMatch: !this.state.loading && "Loading...."
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        },
        options: { sortDirection: 'desc' }
      },
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.processTableClickedNextOrPrevious(tableState.page)
            break;
          default:
        }
      },
      count: this.props.count,
      rowsPerPageOptions: [10],
      filterType: "checkbox",
      download: true,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: 'registered_time',
        direction: 'desc'
      },
      page: this.state.currentPageIndex
    };

    return (
      <div style={{
        height: window.innerHeight,
        overflow: 'auto'
      }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <UserReportHeader />
          {
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={this.props.match.params.fname}
                columns={columns} options={options}
                data={this.state.data} />
            </MuiThemeProvider>
          }
        </div>
        { ((this.state.showLoader && this.props.userinfo.data.length < 1) || this.state.status) && < Spinner />}
        {
          this.state.isenabled &&
          this.processSnackBar()
        }

      </div >
    );
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
  fetchContent: state.fetchContent,
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
    clearHighlighBlock,
    editorModeNormal, editorModeMerge, editorModeClear,
    showPdf,
    clearShowPdf,
    FileContent,
  },
  dispatch
);
export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(DocumentStats)));
