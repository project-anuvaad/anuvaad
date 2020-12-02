import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../assets/localisation";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { clearJobEntry } from '../../../../flux/actions/users/async_job_management';
import ToolBar from "../AdminPanel/AdminPanelHeader"
import FetchUserDetails from "../../../../flux/actions/apis/userdetails";

const TELEMETRY = require('../../../../utils/TelemetryManager')

class UserDetails extends React.Component {
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
      variant: "info",
      open: false
    };
  }

  /**
   * life cycle methods
   */
  componentDidMount() {
    TELEMETRY.pageLoadCompleted('user-details');
    const token = localStorage.getItem("token");
    const userObj = new FetchUserDetails(token);
    console.log('User Object', userObj, this.props)
    this.props.APITransport(userObj);
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
    TELEMETRY.pageLoadStarted('user-details')
    /**
     * getSnapshotBeforeUpdate() must return null
     */
    return null;
  }
  handleMessageClear = () => {
    this.setState({ open: true });
  }

  render() {
    const columns = [
      {
        name: "name",
        label: 'Name',
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
        name: "email_id",
        label: translate("common.page.label.email"),
        options: {
          filter: false,
          sort: false,
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
      {
        name: "court",
        label: translate('userDirectory.page.label.courtName'),
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
        }
      },
      {
        name: "active",
        label: translate('common.page.label.active'),
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
              <MUIDataTable title={translate("common.page.title.userdetails")}
                columns={columns} options={options} />
            </MuiThemeProvider>}
        </div>
      </div>

    );
  }
}

const mapStateToProps = state => ({
  // user: state.login,
  userinfo: state.userinfo,
  // apistatus: state.apistatus,
  job_details: state.job_details,
  // async_job_status: state.async_job_status
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

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(UserDetails)));
