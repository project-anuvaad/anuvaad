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
import MarkInactive from "../../../flux/actions/apis/markinactive";
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
      prevPage: 0
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
    this.handleRefresh(true, this.state.offset, this.state.limit)
    TELEMETRY.pageLoadCompleted('view-document')
  }

  handleClick = rowData => {
    history.push(`${process.env.PUBLIC_URL}/interactive-document/${rowData[7]}/${rowData[17]}/${rowData[9]}/${rowData[4]}/${rowData[5]}/${rowData[6]}`, this.state);
    // history.push(`${process.env.PUBLIC_URL}/interactive-document/${rowData[4]}/${rowData[5]}`);
  };


  handleRefresh(value, offset, limit) {
    const { APITransport } = this.props;
    const apiObj = new FetchDocument(offset, limit);
    APITransport(apiObj);
    value && this.setState({ showLoader: true });
    value && setTimeout(() => {
      this.setState({ open: false });
    }, 30000);
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
    if (prevProps.fetchDocument !== this.props.fetchDocument) {
      var jobArray = this.props.fetchDocument.result.jobIDs;

      //  if (prevProps.fetchDocument && Array.isArray(prevProps.fetchDocument) && prevProps.fetchDocument.length > 0 && prevProps.fetchDocument[i] && prevProps.fetchDocument[i].status && prevProps.fetchDocument[i].status !== value.status && (value.status === "FAILED" || value.status === "COMPLETED")) {
      //   TELEMETRY.endWorkflow(value.jobID)
      // }
      this.setState({ name: this.props.fetchDocument.result.jobs, count: this.props.fetchDocument.result.count, jobArray, showLoader: false });
      
      // if (jobArray.length > 1) {
      //   const { APITransport } = this.props;
      //   const apiObj = new JobStatus(jobArray);
      //   APITransport(apiObj);
      //   this.setState({ showProgress: true });
      // }
      

    }

    if (prevProps.jobStatus !== this.props.jobStatus) {
      var result = this.props.jobStatus;
      var arr = this.state.name;
      arr.length > 0 && arr.map(element => {
        if (this.state.jobArray.includes(element.id)) {
          result.map(value => {

            // console.log(value.record_id === element.id)
            if (value.record_id === element.id && !element.hasOwnProperty("completed_count") && !element.hasOwnProperty("total_count")) {
              element["completed_count"] = value.completed_count;
              element["total_count"] = value.total_count;
            }
          })
        }
      })
      this.setState({ name: arr, showLoader: false , showProgress: false});
    }


  }

  handleFileDownload(file) {
    let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${
      file ? file : ""
      }`
    window.open(url, "_self")
  }

  handleDialog(rowData) {
    this.setState({ showInfo: true, message: rowData })
  }

  handleDialogClose() {
    this.setState({ showInfo: false })
  }

  handleDeleteJob(jobId, fileName) {
    const { APITransport } = this.props;
    const apiObj = new MarkInactive(jobId);
    APITransport(apiObj);
    this.setState({deleteId:jobId, loaderDelete: true, deletedFile: fileName})
    setTimeout(() => {
      this.setState({ loaderDelete: false });
    }, 20000);
  }

  changePage = (page, sortOrder) => {

    if(this.state.prevPage<page){

      this.handleRefresh(false, this.state.offset + 10, this.state.limit)
      this.setState({
        prevPage:page,
        offset: this.state.offset+10
      });
    }
   
  };

  render() {
    const columns = [
      {
        name: "jobID",
        label: translate("common.page.label.basename"),
        options: {
          display: "excluded"
        }
      },
      {
        name: "status",
        label: translate("viewCorpus.page.label.fileName"),
        options: {

          display: "excluded"
        }
      },
      {
        name: "job",
        label: "Job ID",
        options: {
          filter: true,
          sort: true,
          // sortOrder: "asc",
          display: "excluded"

        }
      },

      {
        name: "name",
        label: "Filename",
        options: {
          filter: true,

          
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}>
                  <div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[3]}</div>
                </div>
              );
            }

          }
        }
      },

      {
        name: "id",
        label: "id",
        options: {
          display: "excluded"
        }
      },
      {
        name: "inputFile",
        label: "inputFile",
        options: {
          display: "excluded"
        },

      },
      {
        name: "modelId",
        label: "modelId",
        options: {
          display: "excluded"
        },


      },
      {
        name: "locale",
        label: "locale",
        options: {

          display: "excluded"
        }
      },

      {
        name: "source",
        label: translate("common.page.label.source"),
        options: {
          filter: false,
          sort: false,
          // sortDirection: "desc",
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}>
                  <div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[8]}</div>
                </div>
              );
            }

          }
        }
      },
      {
        name: "target",
        label: translate("common.page.label.target"),
        options: {
          filter: false,
          sort: false,
          // sortDirection: "desc",
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}>
                  <div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[9]}</div>
                </div>
              );
            }

          }
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
            if (tableMeta.rowData) {


              return (

                <div style={{ width: '120px' }}>

                  {(tableMeta.rowData[1] !== 'COMPLETED' && tableMeta.rowData[1] !== 'FAILED') ? <ProgressBar token={true} val={1000} eta={2000 * 1000} handleRefresh={this.handleRefresh.bind(this, false, 0, 10)}></ProgressBar> : <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}><div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[1]}</div></div>}

                </div>
              );
            }

          }
        }
      },
      {
        name: "completed_count",
        label: "completed_count",
        options: {
          display: "excluded"
        }
      },
      {
        name: "total_count",
        label: "total_count",
        options: {
          display: "excluded"
        }
      },

      {
        name: "status",
        label: "Progress",
        options: {
          filter: true,
          sort: false,
          empty: true,

          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {


              return (

                <div style={{ width: '120px' }}>
                  {tableMeta.rowData[1] === 'COMPLETED' && (( tableMeta.rowData[12]) ? (Math.round(Number(tableMeta.rowData[11]) / Number(tableMeta.rowData[12]) * 100) + '%') :this.state.showProgress ?"..." :"...")}

                </div>
              );
            }

          }
        }
      },

      {
        name: "timestamp",
        label: translate("common.page.label.timeStamp"),
        options: {
          filter: true,
          sort: false,
          // sortOrder: "asc",
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}>
                  <div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[14]}</div>
                </div>
              );
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
                  <Tooltip title="info" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.handleDialog(tableMeta.rowData[16])}>
                      <InfoIcon style={{ color: "#C6C6C6" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Job" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.handleDeleteJob(tableMeta.rowData[2], tableMeta.rowData[3])}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  {tableMeta.rowData[1] === 'COMPLETED' ? <Tooltip title={translate('viewTranslate.page.title.downloadSource')} placement="right">
                    <IconButton style={{ color: '#233466' }} component="a" onClick={() => { this.setState({ fileDownload: true }); this.handleFileDownload(tableMeta.rowData[5]) }}>
                      <DeleteOutlinedIcon />
                    </IconButton>
                  </Tooltip> : ''}
                </div>
              );
            }

          }
        }
      },
      {
        name: "tasks",
        label: "tasks",
        options: {
          display: "excluded"
        },
      },
      {
        name: "tgt_locale",
        label: "tgt_locale",
        options: {
          display: "excluded"
        }
      }


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

            
            
        // a developer could react to change on an action basis or
        // examine the state as a whole and do whatever they want

        switch (action) {
          case 'changePage':
            this.changePage(tableState.page, tableState.sortOrder);
            break;
          default:
        }
      },
      count: this.state.count,
      filterType: "checkbox",
      // onRowClick: rowData => (rowData[1] === "COMPLETED") && this.handleClick(rowData),
      download: false,
      // expandableRowsOnClick: true,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: 'timestamp',
        direction: 'desc'
      }
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
          {!this.state.showLoader && <MuiThemeProvider theme={this.getMuiTheme()}> <MUIDataTable title={translate("common.page.title.document")} data={this.state.name} columns={columns} options={options} /></MuiThemeProvider>}
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
  markInactive: state.markInactive
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
