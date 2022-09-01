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
import FetchUserDetails from "../../../../flux/actions/apis/user/userdetails";
import ActivateDeactivateUser from "../../../../flux/actions/apis/user/activate_exisiting_user";
import Switch from '@material-ui/core/Switch';
import Snackbar from "../../../components/web/common/Snackbar";
import ResetPassword from "./ResetPasswordModal";
import Modal from '@material-ui/core/Modal';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SetPasswordApi from "../../../../flux/actions/apis/user/setpassword";
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import history from "../../../../web.history";
import clearStatus from '../../../../flux/actions/apis/admin/clear_job_status';
import DataTable from "../../../components/web/common/DataTable";


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
      username: '',
      showLoader: false

    };

  }


  processFetchBulkUserDetailAPI = (offset, limit, updateExisiting = false, updateUserDetail = false, userIDs = [], userNames = [], roleCodes = []) => {
    const token = localStorage.getItem("token");
    const orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
    const orgCode = [];
    const skipPagination = this.state.role === "SUPERADMIN" ? true : false;
    orgID && orgCode.push(orgID);
    const userObj = new FetchUserDetails(offset, limit, token, updateExisiting, updateUserDetail, userIDs, userNames, roleCodes, orgCode, skipPagination)
    this.props.APITransport(userObj)
  }
  /**
   * life cycle methods
   */
  componentDidMount() {
    TELEMETRY.pageLoadCompleted('user-details');
    this.setState({ showLoader: true, })
    this.props.clearStatus();
    this.processFetchBulkUserDetailAPI(this.state.offset, this.state.limit)
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userinfo.data !== this.props.userinfo.data) {
      this.setState({ showLoader: false, isenabled: false, status: false })
    }
    else if (prevProps.userinfo.data === undefined && this.props.userinfo.data !== undefined) {
      this.setState({ showLoader: false, isenabled: false, status: false })
    }
    else if (this.state.showLoader && prevProps.apistatus.message !== undefined && this.props.apistatus.message === prevProps.apistatus.message) {
      this.setState({ showLoader: false, status: false })
    } else if (this.state.message === "Organization is currently inactive" && !this.state.isenabled) {
      setTimeout(() => {
        this.setState({ isenabled: true })
      }, 1000)
    }
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


  getSnapshotBeforeUpdate(prevProps, prevState) {
    TELEMETRY.pageLoadStarted('user-details')
    /**
     * getSnapshotBeforeUpdate() must return null
     */
    return null;
  }



  toggleChecked = (userId, userName, roleCodes, currentState) => {
    const token = localStorage.getItem("token");
    const userObj = new ActivateDeactivateUser(userName, !currentState, token);
    this.setState({ showLoader: true, status: true });
    fetch(userObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(userObj.getBody()),
      headers: userObj.getHeaders().headers
    })
      .then(async res => {
        if (res.ok) {
          this.processFetchBulkUserDetailAPI(null, null, false, true, [userId], [userName], roleCodes.split(','));
          if (currentState) {
            TELEMETRY.userActivateOrDeactivate(userId, userName, "ACTIVATE")
            setTimeout(() => {
              this.setState({ isenabled: true, variantType: 'success', message: `${userName} is deactivated successfully` })
            }, 2000)
          } else {
            TELEMETRY.userActivateOrDeactivate(userId, userName, "DEACTIVATE")
            setTimeout(() => {
              this.setState({ isenabled: true, variantType: 'success', message: `${userName} is activated successfully` })
            }, 2000)
          }
        } else {
          const message = await res.json()
          TELEMETRY.log("user-activate-or-deactivate", res)
          this.setState({ isenabled: true, variantType: 'error', message: `${message.message}`, status: false }, () => {
            setTimeout(() => {
              this.setState({ isenabled: false })
            }, 2000)
          })
        }
      })
  }
  processSnackBar = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={this.state.isenabled}
        autoHideDuration={3000}
        onClose={this.handleClose}
        variant={this.state.variantType}
        message={this.state.message}
      />
    );
  }

  processSwitch = (userId, userName, roleCodes, isactive) => {
    return (
      <Tooltip title="Active/Inactive" placement="left">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" >
          <Switch
            checked={isactive}
            color="primary"
            onChange={() => this.toggleChecked(userId, userName, roleCodes, isactive)} />
        </IconButton>
      </Tooltip>
    );
  }

  processUserView = (id, name) => {
    return (
      <Tooltip title="View User Details" placement="right">
        <IconButton style={{ color: '#233466', padding: '5px' }}
          component="a"
          onClick={() => this.handleUserViewClick(id, name)} >
          <AssessmentOutlinedIcon />
        </IconButton>
      </Tooltip>
    );
  }

  handleUserViewClick = (id, name) => {
    history.push(`${process.env.PUBLIC_URL}/user-report/${id}/${name}`)
  }

  openModal = (userName) => {
    this.setState({ isModalOpen: true, username: userName })
  }

  handleClose = () => {
    this.setState({ isModalOpen: false })
  }

  processSuccess = () => {
    return this.setState({ loading: true, message: "Password resetted successfully", variantType: 'success' })
  }

  processSubmitButton = (username, password) => {
    const resetObj = new SetPasswordApi(username, '', password);
    fetch(resetObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(resetObj.getBody()),
      headers: resetObj.getHeaders().headers
    })
      .then(async res => {
        if (res.status === 200) {
          const successMsg = await res.json().then(obj => obj.why)
          this.setState({ isModalOpen: false, isenabled: true, message: successMsg, variantType: 'success' })
        }
        else {
          const errMsg = await res.json().then(obj => obj.message)
          throw new Error(errMsg)
        }
      })
      .catch(err => {
        this.setState({ isModalOpen: false, isenabled: true, message: err.message, variantType: 'error' })
      });
    setTimeout(() => {
      this.setState({ isenabled: false })
    }, 5000);
  }

  processModal = (username) => {
    return (
      <Tooltip title="Reset Password" placement="right">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.openModal(username)} >
          <LockOpenIcon />
        </IconButton>
      </Tooltip>
    );
  }

  render() {
    const columns = [
      {
        name: "userID",
        label: "User ID",
        options: {
          filter: false,
          sort: false,
          display: "exclude",
        }
      },
      {
        name: "userName",
        label: "User Name",
        options: {
          filter: false,
          sort: false,
          // display: "exclude"
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
        name: "email",
        label: translate("common.page.label.email"),
        options: {
          filter: false,
          sort: true,
          display: "exclude"
        }
      },
      {
        name: "roles",
        label: translate("common.page.label.role"),
        options: {
          filter: false,
          sort: true,
        }
      },

      {
        name: "orgId",
        label: "Organization",
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
                  {tableMeta.rowData[6]}
                </div>
              )
            }
          }
        }
      },
      {
        name: "is_active",
        label: translate('common.page.label.action'),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  {this.processSwitch(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[4], tableMeta.rowData[7])}
                  {this.processModal(tableMeta.rowData[1])}
                  {this.processUserView(tableMeta.rowData[0], tableMeta.rowData[2])}
                </div>
              );
            }
          }
        }
      },
      // {
      //   name: "reset-password",
      //   label: translate('userProfile.page.placeholder.resetPassword'),
      //   options: {
      //     filter: true,
      //     sort: true,
      //     empty: true,
      //     customBodyRender: (value, tableMeta, updateValue) => {
      //       if (tableMeta.rowData) {
      //         return (
      //           this.processModal(tableMeta.rowData[1]) //userId, userName, roleCodes, isactive
      //         );
      //       }
      //     }
      //   }
      // },
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
      count: this.props.count,
      rowsPerPageOptions: [10, 20, 50],
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none"
    };

    return (
      <div style={{ maxHeight: window.innerHeight, height: window.innerHeight - 10, overflow: "auto" }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <ToolBar />
          {
            (!this.state.showLoader || this.props.count) &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <DataTable title={translate("common.page.title.userdetails")}
                columns={columns} options={options} data={this.props.userinfo.data} />
            </MuiThemeProvider>
          }
        </div>
        {((this.state.showLoader && this.props.userinfo.data.length < 1) || this.state.status) && < Spinner />}
        {
          this.state.isenabled &&
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

      </div >
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  userinfo: state.userinfo,
  count: state.userinfo.count,
  job_details: state.job_details,
  activateuser: state.activateuser,
  apistatus: state.apistatus,

});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearJobEntry,
      APITransport,
      CreateCorpus: APITransport,
      clearStatus
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(UserDetails)));
