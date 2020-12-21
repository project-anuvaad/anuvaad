import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Snackbar from "../../../components/web/common/Snackbar";
import DeleteIcon from '@material-ui/icons/Delete';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import ToolBar from "./ViewDocHeader"
import ProgressBar from "../../../components/web/common/ProgressBar";
import Dialog from "../../../components/web/common/SimpleDialog";
import Spinner from "../../../components/web/common/Spinner";
import { translate } from "../../../../assets/localisation";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import history from "../../../../web.history";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";
import MarkInactive from "../../../../flux/actions/apis/view_document/markinactive";
import JobStatus from "../../../../flux/actions/apis/view_document/translation.progress";
import { clearJobEntry } from '../../../../flux/actions/users/async_job_management';
import DownloadFile from "../../../../flux/actions/apis/download/download_file"

const TELEMETRY = require('../../../../utils/TelemetryManager')

class ViewDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roles"),
      showInfo: false,
      offset: 0,
      limit: 10,
      currentPageIndex: 0,
      dialogMessage: null,
      timeOut: 3000,
      variant: "info"
    };
  }

  /**
   * life cycle methods
   */
  componentDidMount() {
    this.timerId = setInterval(this.checkInprogressJobStatus.bind(this), 10000);
    if (this.props.job_details.documents.length < 1) {
      this.makeAPICallJobsBulkSearch(this.state.offset, this.state.limit, false, false)
      this.setState({ showLoader: true })
    }
    else if (this.props.async_job_status.job) {
      /**
       * a job got started, fetch it status
       */
      this.makeAPICallJobsBulkSearch(this.state.offset, this.state.limit, [this.props.async_job_status.job.jobID], true, false)
      
    }
    this.makeAPICallDocumentsTranslationProgress()

    TELEMETRY.pageLoadCompleted('view-document')
  }

  componentWillUnmount() {
    clearInterval(this.timerId);
  }

  componentDidUpdate(prevProps) {


    if (prevProps.job_details.documents.length !== this.props.job_details.documents.length) {
      /**
       * update job progress status only progress_updated is false
       */
      if (!this.props.job_details.progress_updated) {
        this.makeAPICallDocumentsTranslationProgress()
        this.setState({ showLoader: false })
      }

      if (this.props.job_details.document_deleted) {
        this.setState({ dialogMessage: "Deleted successfully ", variant: 'success', timeOut: 3000 })
      }
      this.props.clearJobEntry()

    }
    else if (prevProps.job_details.documents.length === 0 && this.props.job_details.documents.length === 0 && !this.props.apistatus.progress && this.state.showLoader) {
      this.setState({ showLoader: false })
    }
    
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

  /**
   * API calls
   */
  checkInprogressJobStatus = () => {
    let inprogressJobIds = this.props.job_details.documents.filter(job => (job.status === 'INPROGRESS')).map(job => job.jobID)
    if (inprogressJobIds.length > 0) {
      this.makeAPICallJobsBulkSearch(this.state.offset, this.state.limit, inprogressJobIds, false, false, true)
    }
  }

  makeAPICallJobsBulkSearch(offset, limit, jobIds = [''], searchForNewJob = false, searchNextPage = false, updateExisting = false) {
    const { APITransport } = this.props;
    console.log(offset, limit, jobIds, searchForNewJob, searchNextPage, updateExisting);
    const apiObj = new FetchDocument(offset, limit, jobIds, searchForNewJob, searchNextPage, updateExisting);
    APITransport(apiObj);
  }

  makeAPICallJobDelete(jobId) {
    const { APITransport } = this.props;
    const apiObj = new MarkInactive(jobId);

    APITransport(apiObj);
    this.setState({ showProgress: true, searchToken: false, dialogMessage: " Selected document is deleting, please wait...!", timeOut: null });

  }

  makeAPICallDocumentsTranslationProgress(jobIds) {
    var recordIds = this.getRecordIds()
    if (recordIds.length > 0) {
      const { APITransport } = this.props;
      const apiObj = new JobStatus(recordIds);
      APITransport(apiObj);
      this.setState({ showProgress: true, searchToken: false });
    }
  }

  /**
   * helper methods
   */
  getJobsSortedByTimestamp = () => {
    let jobs = this.props.job_details.documents.sort((a, b) => {
      if (a.created_on < b.created_on) {
        return 1
      }
      return -1
    })
    return jobs;
  }

  getJobsAsPerPageAndLimit = (page, limit) => {
    return this.getJobsSortedByTimestamp().slice(page * limit, page * limit + limit);
  }

  getRecordIds = () => {
    return this.getJobsAsPerPageAndLimit(this.state.currentPageIndex, this.state.limit).map(job => job.recordId)
  }

  getJobIdDetail = (jobId) => {
    return this.getJobsSortedByTimestamp().filter(job => job.jobID === jobId)[0]
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

  /**
   * handlers to process user clicks
   */

  processJobTimelinesClick(jobId, recordId) {
    let taskDetails = this.getJobIdDetail(jobId)
    this.setState({ showInfo: true, message: taskDetails })

  }

  handleDialogClose() {
    this.setState({ showInfo: false })
  }

  processDeleteJobClick = (jobId, recordId) => {
    this.makeAPICallJobDelete(jobId);
  }

  processViewDocumentClick = (jobId, recordId, status) => {
    let job = this.getJobIdDetail(jobId);
    if (status === "COMPLETED") {
      history.push(`${process.env.PUBLIC_URL}/interactive-document/${job.source_language_code}/${job.target_language_code}/${job.target_language_code}/${job.recordId}/${job.converted_filename}/${job.model_id}/${job.filename}`, this.state);
    }
    else if (status === "INPROGRESS") {
      this.setState({ dialogMessage: "Please wait process is Inprogress!", timeOut: 3000, variant: 'info' })
      this.handleMessageClear()
    }
    else {
      this.setState({ dialogMessage: "Document conversion failed!", timeOut: 3000, variant: 'info' })
      this.handleMessageClear()
    }
  }

  handleMessageClear = () => {
    setTimeout(() => {
      this.setState({ dialogMessage: "" });
    }, 3000)
  }

  snackBarMessage = () => {
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={!this.state.timeOut}
          autoHideDuration={this.state.timeOut}
          variant={this.state.variant}
          message={this.state.dialogMessage}
        />
      </div>
    )
  }

  processDownloadInputFileClick = (jobId, recordId) => {
    this.setState({ dialogMessage: "Downloading file...", timeOut: null, variant: "info" })
    let job = this.getJobIdDetail(jobId);
    let user_profile = JSON.parse(localStorage.getItem('userProfile'));

    let obj = new DownloadFile(job.converted_filename, user_profile.userID)

    const apiReq1 = fetch(obj.apiEndPoint(), {
      method: 'get',
      headers: obj.getHeaders().headers
    }).then(async response => {
      if (!response.ok) {
        this.setState({ dialogMessage: "Failed to download file...", timeOut: 3000, variant: "info"})
        console.log("api failed")
      } else {
        const buffer = new Uint8Array(await response.arrayBuffer());
        let res = Buffer.from(buffer).toString('base64')

        fetch("data:image/jpeg;base64," + res)
          .then(res => res.blob())
          .then(blob => {
            let a = document.createElement('a');
            let url = URL.createObjectURL(blob);
            a.href = url;
            a.download = job.converted_filename;
            this.setState({dialogMessage: null})
            a.click();
          });
        
      }
    }).catch((error) => {
      this.setState({ dialogMessage: "Failed to download file...", timeOut: 3000, variant: "info" })
      console.log('api failed because of server or network', error)
    });

  }

  processTableClickedNextOrPrevious = (page, sortOrder) => {
    if (this.state.currentPageIndex < page) {
      /**
       * user wanted to load next set of records
       */
      this.makeAPICallJobsBulkSearch(this.state.offset + this.state.limit, this.state.limit, false, false,true)
      this.setState({
        currentPageIndex: page,
        offset: this.state.offset + this.state.limit
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
          sort: true,
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
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="View document" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.processViewDocumentClick(tableMeta.rowData[1], tableMeta.rowData[2], tableMeta.rowData[5])}>
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
        },
        options: { sortDirection: 'desc' }
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

      <div style={{ height: window.innerHeight }}>
        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <ToolBar />
          {
            !this.state.showLoader &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={translate("common.page.title.document")}
                data={this.getJobsSortedByTimestamp()}
                columns={columns} options={options} />
            </MuiThemeProvider>}
        </div>
        {this.state.showInfo &&
          <Dialog message={this.state.message}
            type="info"
            handleClose={this.handleDialogClose.bind(this)}
            open
            title="File Process Information" />
        }

        {(this.state.showLoader || this.state.loaderDelete) && < Spinner />}
        {this.state.dialogMessage && this.snackBarMessage()}
      </div>

    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  job_details: state.job_details,
  async_job_status: state.async_job_status
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearJobEntry,
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(ViewDocument)));
