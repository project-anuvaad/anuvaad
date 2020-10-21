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
import PublishIcon from '@material-ui/icons/Publish';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteJob from "../../../flux/actions/apis/markinactive";

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
      showInfo: false
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
    this.handleRefresh(true)
    TELEMETRY.pageLoadCompleted('view-document')
  }

  handleClick = rowData => {
    history.push(`${process.env.PUBLIC_URL}/interactive-document/${rowData[7]}/${rowData[14]}/${rowData[9]}/${rowData[4]}/${rowData[5]}/${rowData[6]}`, this.state);
    // history.push(`${process.env.PUBLIC_URL}/interactive-document/${rowData[4]}/${rowData[5]}`);
  };


  handleRefresh(value) {
    const { APITransport } = this.props;
    const apiObj = new FetchDocument();
    APITransport(apiObj);
    value && this.setState({ showLoader: true });
  }


  componentDidUpdate(prevProps) {
    if (prevProps.fetchDocument !== this.props.fetchDocument) {
      var arr = []

      this.props.fetchDocument && Array.isArray(this.props.fetchDocument) && this.props.fetchDocument.length>0 && this.props.fetchDocument.map((value, i) => {
        if (prevProps.fetchDocument && Array.isArray(prevProps.fetchDocument) && prevProps.fetchDocument.length > 0 && prevProps.fetchDocument[i] && prevProps.fetchDocument[i].status && prevProps.fetchDocument[i].status !== value.status && (value.status === "FAILED" || value.status === "COMPLETED")) {
          TELEMETRY.endWorkflow(value.jobID)
        }

        let date = value.startTime.toString()
        let timestamp = date.substring(0, 13)
        var d = new Date(parseInt(timestamp))
        let dateStr = d.toISOString()
        var myDate = new Date(dateStr);
        let createdAt = (myDate.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))
        let currentDate = new Date()

        let timeDiff = Math.floor((currentDate.getTime() - myDate.getTime()) / 60000)

        let taskData = {}
        taskData.status = (value.status === "INPROGRESS" && timeDiff > 300) ? "FAILED" : value.status;
        taskData.jobId = value.jobID
        let tasks = []

        value && value.taskDetails && Array.isArray(value.taskDetails) && value.taskDetails.length > 0 && value.taskDetails.map((task, i) => {
          let subTask = {}
          subTask.state = task.state
          subTask.status = task.status
          tasks.push(subTask)
          return null;
        })
        taskData.subTasks = tasks

        let sourceLangCode, targetLangCode, sourceLang, targetLang
        if (value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.source_language_code && value.input.files[0].model.target_language_code) {
          sourceLangCode = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.source_language_code
          targetLangCode = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.target_language_code

          let langCodes = LanguageCodes
          if (langCodes && Array.isArray(langCodes) && langCodes.length > 0) {
            langCodes.map(lang => {
              if (lang.language_code === sourceLangCode) {
                sourceLang = lang.language_name
              }
              if (lang.language_code === targetLangCode) {
                targetLang = lang.language_name
              }
              return null
            })
          }
        }

        var b = {}
        b["tgt_locale"] = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.target_language_code
        b["status"] = (value.status === "INPROGRESS" && timeDiff > 300) ? "FAILED" : value.status;
        b["job"] = value.jobID;
        b["name"] = value.input.jobName ? value.input.jobName : value.input.files[0].name;
        b["id"] = value.output && (value.output[0].hasOwnProperty('outputFilePath') ? value.output[0].outputFilePath : value.output[0].outputFile);
        b["inputFile"] = value.taskDetails && value.taskDetails.length > 0 && value.taskDetails[0].output && value.taskDetails[0].output.length > 0 && value.taskDetails[0].output[0].outputFile;
        b["modelId"] = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.model_id
        b["locale"] = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.source_language_code
        b["timestamp"] = createdAt
        b["source"] = sourceLang
        b["target"] = targetLang
        b["tasks"] = taskData

        arr.push(b)
        return null
      })
      this.setState({ name: arr, showLoader: false });
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

  handleDeleteJob(jobId) {
    const { APITransport } = this.props;
    const apiObj = new DeleteJob(jobId);
    APITransport(apiObj);
  }

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

                  {(tableMeta.rowData[1] !== 'COMPLETED' && tableMeta.rowData[1] !== 'FAILED') ? <ProgressBar token={true} val={1000} eta={2000 * 1000} handleRefresh={this.handleRefresh.bind(this)}></ProgressBar> : <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}><div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[1]}</div></div>}

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
          sort: true,
          // sortOrder: "asc",
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div onClick={() => tableMeta.rowData[1] === 'COMPLETED' && this.handleClick(tableMeta.rowData)}>
                  <div style={tableMeta.rowData[1] === 'COMPLETED' ? { cursor: "pointer" } : {}}>{tableMeta.rowData[11]}</div>
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
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.handleDialog(tableMeta.rowData[13])}>
                      <InfoIcon style={{ color: "#C6C6C6" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="info" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.handleDeleteJob(tableMeta.rowData[13])}>
                      <DeleteIcon style={{ color: "#C6C6C6" }} />
                    </IconButton>
                  </Tooltip>
                  {tableMeta.rowData[1] === 'COMPLETED' ? <Tooltip title={translate('viewTranslate.page.title.downloadSource')} placement="right"><IconButton style={{ color: '#233466' }} component="a" onClick={() => { this.setState({ fileDownload: true }); this.handleFileDownload(tableMeta.rowData[5]) }}><DeleteOutlinedIcon /></IconButton></Tooltip> : ''}
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
          noMatch: translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        }
      },
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
        {this.state.showInfo &&
          <Dialog message={this.state.message}
            type="info"
            handleClose={this.handleDialogClose.bind(this)}
            open
            title="File Process Information" />
        }
        {this.state.showLoader && < Spinner />}
      </div>

    );

  }

}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corp: state.corp,
  fetchDocument: state.fetchDocument
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
