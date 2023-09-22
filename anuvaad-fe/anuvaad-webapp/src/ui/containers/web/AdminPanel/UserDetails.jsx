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
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import SetPasswordApi from "../../../../flux/actions/apis/user/setpassword";
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import RateReviewIcon from '@material-ui/icons/RateReview';
import history from "../../../../web.history";
import clearStatus from '../../../../flux/actions/apis/admin/clear_job_status';
import DataTable from "../../../components/web/common/DataTable";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, TextField } from "@material-ui/core";
import CreateUsers from "../../../../flux/actions/apis/user/update_user";
import { CustomTableFooter } from "../../../components/web/common/CustomTableFooter";


const TELEMETRY = require('../../../../utils/TelemetryManager')

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.pageInputRef = React.createRef();
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
      showLoader: false,
      openSwitchBoxActionConfirmBox: false,
      selectedArrForSwitchAction: [],
      currentEditableUserDetails: {
        userName: "",
        userEmail: "",
        displayName: "",
        name: "",
        userId: ""
      } , 
      showEditUserModal: false,
      inputPageNumber: 1,
      isInputActive: false
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
    let roleArr = [];
    roleArr = this.state.role === "ADMIN" ? ["ANNOTATOR","TRANSLATOR", "REVIEWER"] : this.state.role === "REVIEWER" ? ["ANNOTATOR","TRANSLATOR"] : [];
    this.processFetchBulkUserDetailAPI(this.state.offset, this.state.limit, false, false, [], [], roleArr);
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
    // console.log("userId, userName, roleCodes, currentState", userId, userName, roleCodes, currentState);
    const token = localStorage.getItem("token");
    const userObj = new ActivateDeactivateUser(userName, !currentState, token);
    this.setState({ showLoader: true, status: true, openSwitchBoxActionConfirmBox:false });
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
            onChange={()=>this.setState({openSwitchBoxActionConfirmBox: true, selectedArrForSwitchAction: [userId, userName, roleCodes, isactive]})}
            // onChange={() => this.toggleChecked(userId, userName, roleCodes, isactive)} 
            />
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

  processUserDocReview = (id, name) => {
    return (
      <Tooltip title="View User Documents To Review" placement="right">
        <IconButton style={{ color: '#233466', padding: '5px' }}
          component="a"
          onClick={() => history.push(`${process.env.PUBLIC_URL}/review-user-docs/${id}/${name}`)} >
          <RateReviewIcon />
        </IconButton>
      </Tooltip>
    );
  }

  renderConfirmSwitchButtonActionBox = () => {
    // console.log("this.state.selectedArrForSwitchAction", this.state.selectedArrForSwitchAction);
    return(
      <div style={{ textAlign: "end", marginBottom: "1rem" }}>
        <Dialog
          open={this.state.openSwitchBoxActionConfirmBox && this.state.selectedArrForSwitchAction.length > 0}
          onClose={() => this.setState({ openSwitchBoxActionConfirmBox: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.state.selectedArrForSwitchAction[3] ? "De-Activate" : "Activate"} User</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to {this.state.selectedArrForSwitchAction[3] ? "De-Activate" : "Activate"} user {this.state.selectedArrForSwitchAction[1]} ({this.state.selectedArrForSwitchAction[2]}) ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              // this.handleDeleteGlossary(this.state.selectedArrForSwitchAction)
              this.toggleChecked(this.state.selectedArrForSwitchAction[0], this.state.selectedArrForSwitchAction[1], this.state.selectedArrForSwitchAction[2], this.state.selectedArrForSwitchAction[3])
            }
            }
              color="primary">
              Confirm
            </Button>
            <Button onClick={() => this.setState({ openSwitchBoxActionConfirmBox: false, selectedArrForSwitchAction: [] })} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }

  handleUserViewClick = (id, name) => {
    history.push(`${process.env.PUBLIC_URL}/user-report/${id}/${name}`)
  }

  openModal = (userName) => {
    this.setState({ isModalOpen: true, username: userName })
  }

  openEditUserModal = (userName, userEmail, name, userId) => {
    const currentEditableUserDetails = {...this.state.currentEditableUserDetails};
    currentEditableUserDetails.userName = userName;
    currentEditableUserDetails.userEmail = userEmail;
    currentEditableUserDetails.displayName = userName;
    currentEditableUserDetails.userId = userId;
    currentEditableUserDetails.name = name;
    this.setState({currentEditableUserDetails}, ()=> {this.setState({showEditUserModal: true})})
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

  processEditUserDetails = (userName, userEmail, name, userId) => {
    return(
      <Tooltip title="Edit User Info" placement="left">
        <IconButton 
          style={{ color: '#233466', padding: '5px' }} 
          component="a" 
          onClick={() => {
            this.openEditUserModal(userName, userEmail, name, userId);
          }} 
        >
          <EditOutlinedIcon />
        </IconButton>
      </Tooltip>
    )
  }

  onUserDetailsChange = (e) => {
    const currentEditableUserDetails = {...this.state.currentEditableUserDetails};
    currentEditableUserDetails[e.target.name] = e.target.value;
    this.setState({currentEditableUserDetails});
  }

  onUpdateUserDetailsClick = () => {
    const modifiedUserData = [
      {
        "userID": this.state.currentEditableUserDetails.userId,
        "email": this.state.currentEditableUserDetails.userEmail,
        "name": this.state.currentEditableUserDetails.name
      }
    ]
    const apiObj = new CreateUsers(modifiedUserData);

    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
    .then(response => response.json())
    .then(result => {
      console.log(result)
      if(result.ok){
        this.setState({isenabled: true, variantType: 'info', message: `User Details Updated!`, showEditUserModal: false});
        let roleArr = [];
        roleArr = this.state.role === "ADMIN" ? ["ANNOTATOR","TRANSLATOR", "REVIEWER"] : this.state.role === "REVIEWER" ? ["ANNOTATOR","TRANSLATOR"] : [];
        this.processFetchBulkUserDetailAPI(this.state.offset, this.state.limit, false, false, [], [], roleArr);
      } else {
        this.setState({isenabled: true, variantType: 'error', message: `Failed To Updated User Details!`, showEditUserModal: false});
      }
    })
    .catch(err=>{
      this.setState({isenabled: true, variantType: 'error', message: `Failed To Updated User Details!`, showEditUserModal: false});
    })
  }

  renderEditUserDetailsModal = () => {
    const selectedUserDetails = {...this.state.currentEditableUserDetails};
    return(
      <Dialog open={this.state.showEditUserModal} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">Edit {selectedUserDetails.displayName}'s Details - </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="userName"
            defaultValue={this.state.currentEditableUserDetails.userName} 
            onChange={(e)=>this.onUserDetailsChange(e)}
            type="text"
            disabled
            fullWidth
            label="User Name"
          />
          <div style={{margin: 30}}></div>
          <TextField
            margin="dense"
            name="name"
            defaultValue={this.state.currentEditableUserDetails.name} 
            onChange={(e)=>this.onUserDetailsChange(e)}
            type="text"
            disabled
            fullWidth
            label="Name"
          />
          <div style={{margin: 30}}></div>
          <TextField
            margin="dense"
            name="userEmail"
            defaultValue={this.state.currentEditableUserDetails.userEmail}   
            onChange={(e)=>this.onUserDetailsChange(e)}         
            type="text"
            fullWidth
            label="Email Id"
          />
        </DialogContent>
        <div style={{margin: 30}}></div>
        <DialogActions>
          <Button 
            color="primary"
            variant="contained"
            style={{borderRadius: 15}}
            onClick={()=>{this.setState({showEditUserModal: false})}}
          >
            Cancel
          </Button>
          <Button 
            color="primary"
            variant="contained"
            style={{borderRadius: 15}}
            onClick={this.onUpdateUserDetailsClick}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  handleInputPageChange = (event, totalPageCount) => {
    if (event.target.value <= totalPageCount) {
      this.setState({ inputPageNumber: event.target.value })
    } else if (event.target.value > totalPageCount) {
      this.setState({ inputPageNumber: totalPageCount })
    } else if (event.target.value == 0) {
      this.setState({ inputPageNumber: 1 })
    } else if (event.target.value < 0) {
      this.setState({ inputPageNumber: 1 })
    }
  }

  onChangePageMAnually = () => {
    // console.log("offset", 0);
    // console.log("limit (Number(this.state.inputPageNumber)-1)*10 ---> ", this.props.job_details.count);
    // this.makeAPICallJobsBulkSearch(0, (Number(this.state.inputPageNumber)-1)*10, false, false, true)
    this.tableRef.current.changePage(Number(this.state.inputPageNumber) - 1);
    this.setState({ currentPageIndex: this.state.inputPageNumber - 1 }, () => {
      this.makeAPICallDocumentsTranslationProgress();
    });
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
          viewColumns: false,
          // display: "exclude"
        }
      },
      {
        name: "name",
        label: 'Name',
        options: {
          filter: false,
          sort: true,
          viewColumns: false,
        }
      },
      {
        name: "email",
        label: translate("common.page.label.email"),
        options: {
          filter: false,
          sort: true,
          viewColumns: false,
          // display: "exclude"
        }
      },
      {
        name: "roles",
        label: translate("common.page.label.role"),
        options: {
          filter: false,
          sort: true,
          viewColumns: false,
        }
      },

      {
        name: "orgId",
        label: "Organization",
        options: {
          filter: false,
          sort: false,
          viewColumns: false,
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
          download: false,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  {this.processSwitch(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[4], tableMeta.rowData[7])}
                  {this.processEditUserDetails(tableMeta.rowData[1], tableMeta.rowData[3], tableMeta.rowData[2],  tableMeta.rowData[0])}
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
      count: this.props.userinfo.data?.length,
      rowsPerPageOptions: [10, 20, 50],
      filterType: "checkbox",
      download: true,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      page: this.state.currentPageIndex,
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage
      ) => {
        const startIndex = page * rowsPerPage;
        const endIndex = (page + 1) * rowsPerPage;
        const totalPageCount = Math.ceil(this.props.userinfo.data?.length / 10);
        return (
          <CustomTableFooter
            renderCondition={totalPageCount > 0}
            countLabel={"Total Records"}
            totalCount={this.props.userinfo.data?.length}
            pageInputRef={this.pageInputRef}
            inputValue={this.state.inputPageNumber}
            onInputFocus={()=>this.setState({ isInputActive: true })}
            onInputBlur={()=>this.setState({ isInputActive: false })}
            handleInputChange={this.handleInputPageChange}
            totalPageCount={totalPageCount}
            onGoToPageClick={this.onChangePageMAnually}
            onBackArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex - 1 })
              this.tableRef.current.changePage(Number(this.state.currentPageIndex - 1))
            }
            }
            onRightArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex + 1 })
              this.tableRef.current.changePage(Number(this.state.currentPageIndex + 1))
            }
            }
            backArrowTabIndex={this.state.currentPageIndex - 1}
            backArrowDisable={this.state.currentPageIndex == 0}
            rightArrowTabIndex={this.state.currentPageIndex + 1}
            rightArrowDisable={this.state.currentPageIndex == (totalPageCount-1)}
            pageTextInfo={`Page ${parseInt(this.state.currentPageIndex + 1)} of ${parseInt(totalPageCount)}`}
          />
        );
      }
    };

    return (
      <div style={{}}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "2%" }}>
          <ToolBar />
          {
            (!this.state.showLoader || this.props.count) &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <DataTable title={translate("common.page.title.userdetails")}
                columns={columns} options={options} data={this.props.userinfo.data} innerRef={this.tableRef} />
            </MuiThemeProvider>
          }
        </div>
        {((this.state.showLoader && !this.props.apistatus.error && this.props.userinfo?.data?.length < 1) || this.state.status) && < Spinner />}
        {
          this.state.isenabled &&
          this.processSnackBar()
        }
        {
          this.renderEditUserDetailsModal()
        }
        {
          this.renderConfirmSwitchButtonActionBox()
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
