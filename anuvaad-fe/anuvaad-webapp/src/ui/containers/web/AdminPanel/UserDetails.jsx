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
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Spinner from "../../../components/web/common/Spinner";
import { clearJobEntry } from '../../../../flux/actions/users/async_job_management';
import ToolBar from "../AdminPanel/AdminPanelHeader"
import FetchUserDetails from "../../../../flux/actions/apis/userdetails";
import ActivateUser from "../../../../flux/actions/apis/activate_exisiting_user";
import DeactivateUser from "../../../../flux/actions/apis/deactivate_exisiting_user";
import Switch from '@material-ui/core/Switch';
import Snackbar from "../../../components/web/common/Snackbar";



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
      open: false,
      isenabled: false,
      variantType: '',
      message: ''
    };

  }


  processFetchUserDetailAPI = () => {
    const token = localStorage.getItem("token");
    const userObj = new FetchUserDetails(token);
    this.props.APITransport(userObj);
  }
  /**
   * life cycle methods
   */
  componentDidMount() {
    TELEMETRY.pageLoadCompleted('user-details');
    this.setState({ showLoader: true })
    this.processFetchUserDetailAPI();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userinfo.data !== this.props.userinfo.data) {
      this.setState({ showLoader: false, isenabled: false })
    }
    else if (prevProps.userinfo.data === undefined && this.props.userinfo.data !== undefined) {
      this.setState({ showLoader: false })
    }
    if (prevProps.activateuser !== this.props.activateuser || prevProps.deactivateuser !== this.props.deactivateuser) {
      this.processFetchUserDetailAPI();
    }
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          padding: '3px 10px 3px',
          marginLeft: '-2%'
        },
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


  toggleChecked = async (e, userName, userID, currentState) => {
    const token = localStorage.getItem("token");
    if (currentState) {
      const deactivate_exisiting_user = new DeactivateUser(userName, token);
      this.setState({ isenabled: true, variantType: 'info', message: 'Please wait, deactivating the user' });
      fetch(deactivate_exisiting_user.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(deactivate_exisiting_user.getBody()),
        headers: deactivate_exisiting_user.getHeaders().headers
      }).then(res => {
        if (res.ok) {
          this.setState({ isenabled: true, variantType: 'success', message: `${userName} deactivated successfully` })
        } else {
          this.setState({ isenabled: true, variantType: 'error', message: 'Something went wrong' })
        }
      })
    } else {
      const activate_exisiting_user = new ActivateUser(userName, userID, token);
      this.setState({ isenabled: true, variantType: 'info', message: 'Please wait, activating the user' });
      fetch(activate_exisiting_user.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(activate_exisiting_user.getBody()),
        headers: activate_exisiting_user.getHeaders().headers
      }).then(res => {
        if (res.ok) {
          this.setState({ isenabled: true, variantType: 'success', message: `${userName} activated successfully` })
        } else {
          this.setState({ isenabled: true, variantType: 'error', message: 'Something went wrong, please try again later' })
        }
      })
    }
  }

  processTableClickedNextOrPrevious = (page) => {
    if (this.state.currentPageIndex < page) {
      this.setState({
        currentPageIndex: page,
      });
    }
  };

  processSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.isenabled}
        autoHideDuration={10000}
        onClose={this.handleClose}
        variant={this.state.variantType}
        message={this.state.message}
      />
    );
  }

  processSwitch = (userId, userName, isactive) => {
    return (<div>
      <Tooltip title="Active/Inactive" placement="left">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" >
          <Switch
            checked={isactive}
            onChange={(e) => this.toggleChecked(e, userName, userId, isactive)} />
        </IconButton>
      </Tooltip>
    </div>);
  }

  render() {
    const columns = [
      {
        name: "userID",
        label: "userID",
        options: {
          filter: false,
          sort: false,
          display: "exclude"
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
        label: 'Name',
        options: {
          filter: false,
          sort: true,
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
        name: "registered_time",
        label: translate("common.page.label.timeStamp"),
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  {tableMeta.rowData[5]}
                </div>
              )
            }
          }
        }
      },
      {
        name: "is_active",
        label: translate('common.page.table.status'),
        options: {
          filter: true,
          sort: true,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                this.processSwitch(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[6]) //userId, userName, isactive
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
      onChangePage: (pageNumber) => {
        this.processTableClickedNextOrPrevious(pageNumber);
      },
      count: this.props.job_details.count,
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
      <div style={{ height: window.innerHeight }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <ToolBar />
          {
            !this.state.showLoader &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={translate("common.page.title.userdetails")}
                columns={columns} options={options} data={this.props.userinfo.data} />
            </MuiThemeProvider>
          }
        </div>
        {(this.state.showLoader || this.state.loaderDelete) && < Spinner />}
        {this.state.isenabled &&
          this.processSnackBar()
        }
      </div>

    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  userinfo: state.userinfo,
  job_details: state.job_details,
  activateuser: state.activateuser,
  deactivateuser: state.deactivateuser
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
