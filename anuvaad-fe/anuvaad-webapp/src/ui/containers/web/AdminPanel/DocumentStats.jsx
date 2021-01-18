import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import ToolBar from "../AdminPanel/AdminPanelHeader"
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




const TELEMETRY = require('../../../../utils/TelemetryManager')

class DocumentStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roles"),
    };
  }

  componentDidMount = () => {
    const apiObj = new FileContent(this.props.match.params.recordId, "0", "0");
    this.props.APITransport(apiObj);
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
      this.processFetchBulkUserDetailAPI(this.state.limit + this.state.offset, this.state.limit, true, false)
      this.setState({
        currentPageIndex: page,
        offset: this.state.offset + this.state.limit
      });
    }
  };

  render() {
    console.log()
    const columns = [
      {
        name: "userID",
        label: "userID",
        options: {
          filter: false,
          sort: false,
          display: "exclude",
        }
      },
      {
        name: "userName",
        label: "userName",
        options: {
          filter: false,
          sort: false,
          display: "exclude"
        }
      },
      {
        name: "name",
        label: 'Source Sentence',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        name: "userName",
        label: "Target Sentence",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "name",
        label: 'Target',
        options: {
          filter: false,
          sort: true,
        }
      },
      
      {
        name: "roles",
        label: translate("common.page.label.role"),
        options: {
          filter: false,
          sort: false,
        }
      },
    ];


    const options = {
      textLabels: {
        body: {
          noMatch: this.props.count > 0 && this.props.count > this.props.userinfo.data.length ? "Loading...." : translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
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
      download: false,
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
        height: window.innerHeight
      }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <ToolBar />
          {
            (!this.state.showLoader || this.props.count) &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={this.props.match.params.fname}
                columns={columns} options={options} />
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
    clearShowPdf
  },
  dispatch
);
export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(DocumentStats)));
