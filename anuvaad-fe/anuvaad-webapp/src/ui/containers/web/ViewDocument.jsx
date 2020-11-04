import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
//import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import MUIDataTable from "mui-datatables";
import Toolbar from "@material-ui/core/Toolbar";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import history from "../../../web.history";
import FetchDocument from "../../../flux/actions/apis/fetch_document";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";
import ProgressBar from "../../components/web/common/ProgressBar";
import Spinner from "../../components/web/common/Spinner";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import Dialog from "../../components/web/common/SimpleDialog";
import Fab from '@material-ui/core/Fab';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Snackbar from "../../components/web/common/Snackbar";
import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import MarkInactive from "../../../flux/actions/apis/markinactive";
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import JobStatus from "../../../flux/actions/apis/job-status";

const TELEMETRY = require('../../../utils/TelemetryManager')

class ViewDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: JSON.parse(localStorage.getItem("roles")),
      showInfo: false,
      offset: 0,
      limit: 10,
      currentPageIndex: 0
    };
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          padding: '3px 10px 3px'
        }
      },
    }
  })

  getSnapshotBeforeUpdate(prevProps, prevState) {
    TELEMETRY.pageLoadStarted('view-document')
    /**
     * getSnapshotBeforeUpdate() must return null
     */
    return null;
  }

  componentDidMount() {
    if (this.props.job_details.documents.length < 1) {
      this.fetchUserDocuments(true, this.state.offset, this.state.limit, true)
      this.setState({showLoader:true})
    }

    TELEMETRY.pageLoadCompleted('view-document')
  }

  fetchUserDocuments(value, offset, limit, searchToken) {
    const { APITransport }  = this.props;
    const apiObj            = new FetchDocument(offset, limit);
    APITransport(apiObj);
  }

  deleteUserDocuments(jobId) {
    const { APITransport }  = this.props;
    const apiObj            = new MarkInactive(jobId);
    APITransport(apiObj);
    this.setState({ showProgress: true, searchToken: false });
  }

  fetchUserDocumentsProgressStatus(jobIds) {
    var recordIds = this.getRecordIds()  
    if (recordIds.length > 1) {
      const { APITransport }  = this.props;
      const apiObj            = new JobStatus(recordIds);
      APITransport(apiObj);
      this.setState({ showProgress: true, searchToken: false });      
    }
  }

  getRecordIds = () => {
    let jobIds = []
    for (var i = this.state.currentPageIndex * this.state.limit; i < (this.state.currentPageIndex * this.state.limit) + this.state.limit; i++) {
      if (this.props.job_details.documents.hasOwnProperty("recordId") && this.props.job_details.documents[i]['recordId']) {
        jobIds.push(this.props.job_details.documents[i]['recordId'])
      }
    }
    return jobIds;
  }

  getJobIdDetail = (jobId) => {
    for (var i = this.state.currentPageIndex * this.state.limit; i < (this.state.currentPageIndex * this.state.limit) + this.state.limit; i++) {
      if (this.props.job_details.documents[i]['jobID'] === jobId) {
        return this.props.job_details.documents[i]
      }
    }
  }

  getDateTimeFromTimestamp = (t) => {
    let date = new Date(t);
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  showProgressIndicator = () => {
    return (
      <div >
        <ProgressBar token={true} val={1000} eta={2000 * 1000}></ProgressBar>
      </div>
    )
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.job_details)
    if (prevProps.job_details.documents !== this.props.job_details.documents) {
      /**
       * update job progress status only progress_updated is false
       */
      if (!this.props.job_details.progress_updated) {
        this.fetchUserDocumentsProgressStatus()
        this.setState({showLoader:false})
      }

      if (!this.props.job_details.document_deleted) {
      }
    }
  }

  processJobTimelinesClick(jobId, recordId) {
    console.log(this.getJobIdDetail(jobId))
  }

  handleDialogClose() {
    this.setState({ showInfo: false })
  }

  processDeleteJobClick = (jobId, recordId) => {
    this.deleteUserDocuments(jobId);
  }

  processViewDocumentClick = (jobId, recordId) => {
    let job = this.getJobIdDetail(jobId);
    history.push(`${process.env.PUBLIC_URL}/interactive-document/${job.source_language_code}/${job.target_language_code}/${job.target_language_code}/${job.recordId}/${job.converted_filename}/${job.model_id}`, this.state);
  }

  processDownloadInputFileClick = (jobId, recordId) => {
    let job = this.getJobIdDetail(jobId);
    let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${
      job.converted_filename ? job.converted_filename : ""
      }`
      window.open(url, "_self")
  }

  processTableClickedNextOrPrevious = (page, sortOrder) => {
    if(this.state.currentPageIndex < page) {
      /**
       * user wanted to load next set of records
       */
      this.fetchUserDocuments(false, this.state.offset + 10, this.state.limit, true)
      this.setState({
        currentPageIndex:page,
        offset: this.state.offset+10
      });
    }
  };

  render() {
    const columns = [
      {
        name: "filename",
        label: 'Filename',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "jobID",
        label: 'JobID',
        options: {
          display: "excluded"
        }
      },
      {
        name: "recordId",
        label: 'RecordId',
        options: {
          display: "excluded"
        }
      },
      {
        name: "source_language_code",
        label: translate("common.page.label.source"),
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "target_language_code",
        label: translate("common.page.label.target"),
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "status",
        label: translate('common.page.table.status'),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div >
                {(tableMeta.rowData[5] !== 'COMPLETED' && tableMeta.rowData[1] !== 'FAILED') ? (<div>IN PROGRESS</div>) : (<div>COMPLETED</div>)}
              </div>
            )
          }
        }
      },
      {
        name: "progress",
        label: "Progress",
        options: {
          filter: true,
          sort: false,
          empty: true,
        }
      },
      {
        name: "created_on",
        label: translate("common.page.label.timeStamp"),
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                {this.getDateTimeFromTimestamp(tableMeta.rowData[7])}
                </div>
              )
            }
          }
        }
      },
      {
        name: "Action",
        label: translate('common.page.label.action'),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {

              return (
                <div >

                  <Tooltip title="Info" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.processJobTimelinesClick(tableMeta.rowData[1], tableMeta.rowData[2])}>
                      <InfoIcon/>
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="View document" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.processViewDocumentClick(tableMeta.rowData[1], tableMeta.rowData[2])}>
                      <LibraryBooksIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete job" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.processDeleteJobClick(tableMeta.rowData[1], tableMeta.rowData[2])}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download input file" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.processDownloadInputFileClick(tableMeta.rowData[1], tableMeta.rowData[2])}>
                      <CloudDownloadIcon />
                    </IconButton>
                  </Tooltip>
                  
                  

                </div>
              );
            }
          }
        }
      },
    ];

    const options = {
      textLabels: {
        body: {
          noMatch: this.props.job_details.count > 0 && this.props.job_details.count > this.props.job_details.documents.length ? "Loading...." : translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        }
      },

      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.processTableClickedNextOrPrevious(tableState.page, tableState.sortOrder);
            break;
          default:
        }
      },
      count: this.props.job_details.count,
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: 'timestamp',
        direction: 'desc'
      },
      page: this.state.currentPageIndex
    };

    return (
      <div>
        <Toolbar style={{ marginLeft: "-5.4%", marginRight: "1.5%", marginTop: "20px" }}>
          <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
          {this.state.role.includes("dev") || this.state.role.includes("grader") || this.state.role.includes("user") || this.state.role.includes("interactive-editor") ? (
            <Fab color="primary"
              variant="extended"
              aria-label="Add"
              style={{
                marginRight: 0,
                textTransform: 'none'
              }}

              onClick={() => {
                history.push(`${process.env.PUBLIC_URL}/document-upload`);
              }}>
              <PublishIcon fontSize="small" />
              {translate("common.page.button.upload")}
            </Fab>
          ) : (
              ""
            )}
        </Toolbar>
        <div style={{ margin: '2% 3% 3% 3%' }}>
          {!this.state.showLoader && <MuiThemeProvider theme={this.getMuiTheme()}> <MUIDataTable title={translate("common.page.title.document")} data={this.props.job_details.documents} columns={columns} options={options} /></MuiThemeProvider>}
        </div>
        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={3000}
            variant="success"
            message={this.state.message}
          />
        )}
        {this.state.showInfo &&
          <Dialog message={this.state.message}
            type="info"
            handleClose={this.handleDialogClose.bind(this)}
            open
            title="File Process Information" />
        }
        {(this.state.showLoader || this.state.loaderDelete) && < Spinner />}
      </div>

    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  job_details: state.job_details
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(ViewDocument)));
