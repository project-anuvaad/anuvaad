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
import LanguageCodes from "../../components/web/common/Languages.json"
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteOutlinedIcon from '@material-ui/icons/VerticalAlignBottom';
import InfoIcon from '@material-ui/icons/Info';
import Dialog from "../../components/web/common/SimpleDialog";
import Fab from '@material-ui/core/Fab';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
//import AddIcon from '@material-ui/icons/Add';
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
      name: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
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
    }

    TELEMETRY.pageLoadCompleted('view-document')
  }

  handleClick = rowData => {
    history.push(`${process.env.PUBLIC_URL}/interactive-document/${rowData[7]}/${rowData[17]}/${rowData[9]}/${rowData[4]}/${rowData[5]}/${rowData[6]}`, this.state);
    // history.push(`${process.env.PUBLIC_URL}/interactive-document/${rowData[4]}/${rowData[5]}`);
  };


  fetchUserDocuments(value, offset, limit, searchToken) {
    const { APITransport }  = this.props;
    const apiObj            = new FetchDocument(offset, limit);
    APITransport(apiObj);
  }

  getRecordIds = () => {
    let jobIds = []
    for (var i = this.state.currentPageIndex * this.state.limit; i < (this.state.currentPageIndex * this.state.limit) + this.state.limit; i++) {
      if (this.props.job_details.documents[i]['recordId']) {
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

  componentDidUpdate(prevProps) {
    if (prevProps.markInactive !== this.props.markInactive) {
      let resultArray = this.state.name;
      resultArray.map((element,i)=>{
        if(this.state.deleteId===element.job){
          resultArray.splice(i, 1);
        }
      })
      this.setState({name:resultArray, loaderDelete: false, open:true, count:this.state.count-1, message: this.state.deleteId + "deleted cuccessfully"})
      setTimeout(() => {
        this.setState({ open: false });
      }, 30000);
    }

    if (prevProps.job_details.documents !== this.props.job_details.documents) {
      /**
       * update job progress status only progress_updated is false
       */
      if (!this.props.job_details.progress_updated) {
        var jobArray = this.getRecordIds()  
        if (jobArray.length > 1) {
          const { APITransport }  = this.props;
          const apiObj            = new JobStatus(jobArray);
          APITransport(apiObj);
          this.setState({ showProgress: true, searchToken: false });
        }
      }
    }
  }

  processJobTimelinesClick(jobId, recordId) {
    console.log(this.getJobIdDetail(jobId))
    // this.setState({ showInfo: true, message: rowData })
  }

  handleDialogClose() {
    this.setState({ showInfo: false })
  }

  processDeleteJobClick = (jobId, recordId) => {
    const { APITransport }  = this.props;
    const apiObj            = new MarkInactive(jobId);
    APITransport(apiObj);
    // this.setState({deleteId:jobId, loaderDelete: true, deletedFile: fileName})
    // setTimeout(() => {
    //   this.setState({ loaderDelete: false });
    // }, 20000);
  }

  processViewDocumentClick = (jobId, recordId) => {

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


  renderUserDocuments = () => {
    const columns  = [
      { name: "filename", label: translate("viewCorpus.page.label.fileName"), options: { filter: true, sort: true,} },
    ]
  }

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
          sort: false,
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
          noMatch: this.state.count > 0 && this.state.count >this.state.offset ? "Loading...." : translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
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
  corp: state.corp,
  fetchDocument: state.fetchDocument,
  jobStatus: state.jobStatus,
  markInactive: state.markInactive,
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
