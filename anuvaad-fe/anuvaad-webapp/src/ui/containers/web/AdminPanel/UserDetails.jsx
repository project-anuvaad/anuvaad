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
import ActivateDeactivateUser from "../../../../flux/actions/apis/activate_exisiting_user";
import Switch from '@material-ui/core/Switch';
import Snackbar from "../../../components/web/common/Snackbar";
import ResetPassword from "./ResetPasswordModal";
import Modal from '@material-ui/core/Modal';
import SetPasswordApi from "../../../../flux/actions/apis/setpassword";



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
      message: '',
      status: false,
      isModalOpen: false,
      username: ''
    };

  }


  processFetchBulkUserDetailAPI = (offset, limit, updateExisiting = false, updateUserDetail = false, userIDs = [], userNames = [], roleCodes = []) => {
    const token = localStorage.getItem("token");
    const userObj = new FetchUserDetails(offset, limit, token, updateExisiting, updateUserDetail, userIDs, userNames, roleCodes);
    this.props.APITransport(userObj);
  }
  /**
   * life cycle methods
   */
  componentDidMount() {

    TELEMETRY.pageLoadCompleted('user-details');
    this.setState({ showLoader: true })
    this.processFetchBulkUserDetailAPI(this.state.offset, this.state.limit)

  }

  componentDidUpdate(prevProps) {
    if (prevProps.userinfo.data !== this.props.userinfo.data) {
      this.setState({ showLoader: false, isenabled: false, status: false })
    }
    else if (prevProps.userinfo.data === undefined && this.props.userinfo.data !== undefined) {
      this.setState({ showLoader: false, isenabled: false, status: false })
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



  toggleChecked = (userId, userName, roleCodes, currentState) => {
    const { APITransport } = this.props;
    const token = localStorage.getItem("token");
    const userObj = new ActivateDeactivateUser(userName, !currentState, token);
    this.setState({ showLoader: true, status: true });
    fetch(userObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(userObj.getBody()),
      headers: userObj.getHeaders().headers
    })
      .then(res => {
        if (res.ok) {
          this.processFetchBulkUserDetailAPI(null, null, false, true, [userId], [userName], roleCodes.split(','));
          if (currentState) {
            setTimeout(() => {
              this.setState({ isenabled: true, variantType: 'success', message: `${userName} is deactivated successfully` })
            }, 2000)
          } else {
            setTimeout(() => {
              this.setState({ isenabled: true, variantType: 'success', message: `${userName} is activated successfully` })
            }, 2000)
          }
        }
      })
  }

  processTableClickedNextOrPrevious = (page) => {
    if (this.state.currentPageIndex < page) {
      this.processFetchBulkUserDetailAPI(this.state.limit + this.state.offset, this.state.limit, true, false)
      this.setState({
        currentPageIndex: page,
        offset: this.state.offset + this.state.limit
      });
    }
  };

  processSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.isenabled}
        autoHideDuration={3000}
        onClose={this.handleClose}
        variant={this.state.variantType}
        message={this.state.message}
      />
    );
  }

  processSwitch = (userId, userName, roleCodes, isactive) => {
    return (<div>
      <Tooltip title="Active/Inactive" placement="left">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" >
          <Switch
            checked={isactive}
            onChange={() => this.toggleChecked(userId, userName, roleCodes, isactive)} />
        </IconButton>
      </Tooltip>
    </div>);
  }

  openModal = (userName) => {
    this.setState({ isModalOpen: true, username: userName })
  }

  handleClose = () => {
    this.setState({ isModalOpen: false })
  }

  processSubmitButton = (username, password) => {
    const resetObj = new SetPasswordApi(username, '', password);
    fetch(resetObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(resetObj.getBody()),
      headers: resetObj.getHeaders().headers
    })
      .then(res => {
        if (res.ok) {

          this.setState({ isenabled: true, message: 'Password resetted successfully' })
        }
        else {
          throw new Error(res)
        }
      })
      .catch(err => {
        this.setState({ isModalOpen: false, isenabled: true, message: 'Oops! Something went wrong, please try after sometime' })
      })
  }

  processModal = (username) => {
    return (
      <div>
        <button onClick={() => this.openModal(username)}>
          Reset Password
        </button>
      </div>
    );
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
        name: "userName",
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
                this.processSwitch(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[4], tableMeta.rowData[6]) //userId, userName, roleCodes, isactive
              );
            }
          }
        }
      },
      {
        name: "reset-password",
        label: translate('userProfile.page.placeholder.resetPassword'),
        options: {
          filter: true,
          sort: true,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                this.processModal(tableMeta.rowData[1]) //userId, userName, roleCodes, isactive
              );
            }
          }
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
      <div style={{ height: window.innerHeight }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <ToolBar />
          {
            (!this.state.showLoader || this.props.count) &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={translate("common.page.title.userdetails")}
                columns={columns} options={options} data={this.props.userinfo.data} />
            </MuiThemeProvider>
          }
        </div>
        {((this.state.showLoader && this.props.userinfo.data.length < 1) || this.state.status) && < Spinner />}
        {this.state.isenabled &&
          this.processSnackBar()
        }
        {
          this.state.isModalOpen &&
          <Modal
            open={this.state.isModalOpen}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            <ResetPassword onClose={this.handleClose} username={this.state.username} handleSubmit={this.processSubmitButton} />
          </Modal>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  userinfo: state.userinfo,
  count: state.userinfo.count,
  job_details: state.job_details,
  activateuser: state.activateuser,
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
