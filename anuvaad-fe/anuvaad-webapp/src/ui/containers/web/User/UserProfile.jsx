import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Fab from "@material-ui/core/Fab";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { withStyles } from "@material-ui/core/styles";
import ConfirmBox from "../../../components/web/common/ConfirmBox";

// import MenuItem from "@material-ui/core/MenuItem";
// import Select from "@material-ui/core/Select";
// import OutlinedInput from "@material-ui/core/OutlinedInput";

import history from "../../../../web.history";
import MySnackbarContentWrapper from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import Updatepassword from "../../../../flux/actions/apis/user/updatepassword";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import ResetMFA from "../../../../flux/actions/apis/user/MFA_reset";

const styles = {
  root: {
    display: 'flex', flexDirection: 'column', flex: 1, textAlign: 'center'
  },
  paper: {
    marginLeft: "auto", marginRight: 'auto', width: "40%", marginTop: "3%", padding: '3%'
  },
  header: {
    color: '#003366', fontWeight: '549', textAlign: 'center', paddingBottom: "12px", paddingTop: "3%"
  },
  dataRow: {
    marginTop: '3%',
    display: 'flex',
    flexDirection: 'rows'
  }
};

class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldpassword: "",
      newpassword: "",
      repassword: "",
      status: "",
      open: false,
      messageSnack: "",
      // lang: localStorage.getItem(`lang${JSON.parse(localStorage.getItem("userProfile")).userID}`),
      lang: "English",
      userDetails: JSON.parse(localStorage.getItem("userProfile")),
      openResetMFAConfirmBox: false,
    };
  }

  componentDidMount() {
    this.setState({
      autoMlText: "",
      nmtText: [],
      nmtTextSP: [],
      message: ""
    });
  }

  handleResetMFA = () => {
    this.setState({ openResetMFAConfirmBox: true });
  }

  resetMFAClick = () => {
    const apiObj = new ResetMFA(this.state.userDetails.userName);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.ok) {
          // history.replace(`${process.env.PUBLIC_URL}/logout`);
          this.setState({ open: true, messageSnack: result.data.message, openResetMFAConfirmBox: false });
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleReset = () => {
    this.setState({ drawer: true });
  };

  handleCancel = () => {
    this.setState({
      message: ""
    });
    this.setState({ drawer: false });
  };

  handleClose = () => {
    history.push(`${process.env.PUBLIC_URL}/corpus`);
  };

  validateForm() {
    return this.state.oldpassword.length > 3 && this.state.newpassword.length > 5 && this.state.repassword === this.state.newpassword;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.updatePasswordstatus !== this.props.updatePasswordstatus) {
      if (this.props.updatePasswordstatus.http.status === 400) {
        this.setState({
          message: translate("userProfile.page.message.TryAgain"),
          status: this.props.updatePasswordstatus.http.status
        });
      } else if (this.props.updatePasswordstatus.http.status === 200) {
        this.setState({
          open: true,
          messageSnack: translate("userProfile.page.message.passwordChangeSuccessLogin"),
          status: this.props.updatePasswordstatus.http.status
        });

        setTimeout(() => {
          history.push(`${process.env.PUBLIC_URL}/logout`);
        }, 3000);
      }

      this.setState({
        status: this.props.updatePasswordstatus.why,
        oldpassword: "",
        newpassword: "",
        repassword: ""
      });
    }
  }

  handleSubmit = () => {
    if (this.state.oldpassword.length > 3) {
      if (this.state.newpassword.length > 5) {
        if (this.state.repassword === this.state.newpassword) {
          if (this.state.repassword !== this.state.oldpassword) {
            this.setState({
              message: ""
            });
            const apiObj = new Updatepassword(
              this.state.userDetails.userName,

              this.state.newpassword,
              this.state.oldpassword
            );
            this.props.APITransport(apiObj);
            this.setState({ showLoader: true });
            // setTimeout(()=>{history.push("{this.handleClose();history.push(`${process.env.PUBLIC_URL}/logout`)}")},200
          } else {
            this.setState({
              message: translate("userProfile.page.message.passwordMismatchAlert")
            });
          }
        } else {
          this.setState({
            message: translate("userProfile.page.message.passwordSameAlert")
          });
        }
      } else {
        this.setState({
          message: translate("userProfile.page.message.passwordTooShortAlert")
        });
      }
    } else {
      this.setState({
        message: translate("userProfile.page.message.enterCorrectPasswordAlert")
      });
    }
  };

  handleChangeLanguage(event) {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    localStorage.setItem(`lang${userProfile.userID}`, event.target.value);
    this.setState({
      lang: event.target.value
    });
    window.location.reload();
  }

  render() {
    // let lang = localStorage.getItem(`lang${JSON.parse(localStorage.getItem("userProfile")).userID}`)
    let useRole1 = []

    this.state.userDetails.roles && Array.isArray(this.state.userDetails.roles) && this.state.userDetails.roles.length > 0 && this.state.userDetails.roles.map((item, value) => {
      // useRole.push(item); 
      // value !== this.state.userDetails.roles.length - 1 && useRole.push(", ")
      useRole1.push(item.roleCode)
      return true;
    });
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Typography style={{ paddingTop: "2%", fontSize: "19px", fontWeight: "500", color: "black" }} className={classes.header}>
          {translate("common.page.label.myProfile")}
        </Typography>
        <Paper className={classes.paper}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataRow} style={{ marginTop: '0px' }}>
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "Roboto" }} >
                  Name{" "}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'left' }}>
                {/* <br /> */}
                {/* <br /> */}
                <Typography style={{ fontSize: "1rem", fontWeight: "400", fontFamily: "Roboto", textTransform: "capitalize" }}>
                  {" "}
                  {this.state.userDetails.name}{" "}
                </Typography>
              </Grid>
            </Grid>
            {/* <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataRow}>
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ textAlign: 'left' }}>
                <Typography style={{fontSize: "1rem", fontWeight: "600", fontFamily: "Roboto"}}>
                  {translate("common.page.label.lastName")}{" "}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'left' }}>
                {/* <br />
                <br /> */}
            {/* <Typography style={{fontSize: "1rem", fontWeight: "400", fontFamily: "Roboto", textTransform: "capitalize"}}>
                  {" "}
                  {this.state.userDetails.lastname}{" "}
                </Typography>
              </Grid>
            </Grid>  */}
            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataRow}>
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "Roboto" }} >
                  {translate("common.page.label.email")}{" "}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'left' }}>
                {/* <br />
                <br /> */}
                <Typography style={{ fontSize: "1rem", fontWeight: "400", fontFamily: "Roboto", marginTop: "-1%" }}>
                  {" "}
                  {this.state.userDetails.email}{" "}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataRow}>
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "Roboto" }}>
                  {translate("profile.page.label.role")}{" "}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'left' }}>
                {/* <br />
                <br />
                <br /> */}
                <Typography style={{ fontSize: "1rem", fontWeight: "400", fontFamily: "Roboto", marginTop: "-1%" }}>
                  {" "}
                  {useRole1 ? useRole1.join() : ""}
                  {/* [{useRole}]{" "} */}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataRow}>
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "Roboto" }}>
                  {translate("profile.page.label.org")}{" "}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'left' }}>
                {/* <br />
                <br />
                <br /> */}
                <Typography style={{ fontSize: "1rem", fontWeight: "400", fontFamily: "Roboto", marginTop: "-1%" }}>
                  {this.state.userDetails.orgID}{" "}
                </Typography>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.dataRow}>
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ textAlign: 'left' }}>
                <Typography style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "Roboto" }} >
                  Language{" "}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ textAlign: 'initial' }}>
                {/* <br />
                <br /> */}
                <Typography style={{ fontSize: "1rem", fontWeight: "400", fontFamily: "Roboto", marginTop: "-1%" }}>
                  {" "}
                  {this.state.lang}{" "}
                </Typography>
                {/* 
                <Select
                  // gutterBottom="true"
                  name="selectlanguage"
                  style={{ marginTop: "-1%", minWidth: 120 }}
                  id="outlined-age-simple"
                  value={this.state.lang}
                  onChange={this.handleChangeLanguage.bind(this)}
                  input={<OutlinedInput name="english" id="outlined-age-simple" />}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">हिंदी</MenuItem>
                </Select> */}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} lg={12} xl={12} style={{ textAlign: 'right' }}>
            <Tooltip title={translate("userProfile.page.placeholder.resetPassword")}>
              <Fab aria-haspopup="true" onClick={this.handleReset} color="primary" size="medium">
                <AccountCircle />
              </Fab>
            </Tooltip>

            {(useRole1 && useRole1.join() !== "SUPERADMIN") && <Tooltip title={"Reset MFA Method"} style={{ marginLeft: 5 }}>
              <Fab aria-haspopup="true" onClick={this.handleResetMFA} color="primary" size="medium">
                <VpnKeyOutlinedIcon />
              </Fab>
            </Tooltip>}
          </Grid>
        </Paper>

        <ConfirmBox
          open={this.state.openResetMFAConfirmBox}
          onClose={() => this.setState({ openResetMFAConfirmBox: false })}
          title={"Reset MFA Method"}
          contentText={"Are you sure you want to perform this action? You will be promted to register for MFA during your next login."}
          onConfirm={() => this.resetMFAClick()}
        />

        <Snackbar anchorOrigin={{ vertical: "bottom", horizontal: "right" }} open={this.state.open} autoHideDuration={6000}>
          <MySnackbarContentWrapper onClose={this.handleClose} variant="success" message={this.state.messageSnack} />
        </Snackbar>

        {this.state.drawer ? (
          <Dialog
            open={this.state.drawer}
            onClose={this.handleClose}
            disableBackdropClick
            disableEscapeKeyDown
            fullWidth
            aria-labelledby="form-dialog-title"
          >
            <Typography
              variant="h5"
              style={{ color: '#000000', background: '#ECEFF1', paddingBottom: "12px", paddingTop: "8px", textAlign: 'center' }}
            >
              {translate("userProfile.page.label.changePassword")}
            </Typography>

            <DialogContent>
              <DialogContentText />
              <br />

              <form method="post">
                <FormControl fullWidth>
                  <TextField
                    placeholder={translate("userProfile.page.placeholder.oldPassword")}
                    error
                    value={this.state.oldpassword}
                    required
                    type="password"
                    onChange={event => {
                      this.handleTextChange("oldpassword", event);
                    }}
                    margin="normal"
                    varient="outlined"
                    style={{ width: "100%", marginBottom: "4%" }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    id={this.state.newpassword}
                    placeholder={translate("userProfile.page.placeholder.newPassword")}
                    required
                    value={this.state.newpassword}
                    type="password"
                    onChange={event => {
                      this.handleTextChange("newpassword", event);
                    }}
                    margin="normal"
                    varient="outlined"
                    style={{ width: "100%", marginBottom: "4%" }}
                  />
                </FormControl>
                <FormControl fullWidth>
                  <TextField
                    placeholder={translate("userProfile.page.placeholder.confirmPassword")}
                    value={this.state.repassword}
                    required
                    id="outlined-required"
                    type="password"
                    onChange={event => {
                      this.handleTextChange("repassword", event);
                    }}
                    margin="normal"
                    varient="outlined"
                    style={{ width: "100%", marginBottom: "4%" }}
                  />{" "}
                </FormControl>
                <div>
                  <span style={{ marginLeft: "20%", color: "red" }}>{this.state.message}</span>
                  <DialogActions style={{ marginLeft: "0px", marginRight: '0px' }}>
                    <Button
                      variant="contained"
                      onClick={this.handleCancel}
                      color='primary'
                      aria-label="edit"
                      style={{ width: "50%", marginBottom: "4%", marginTop: "4%", marginLeft: "0px", borderRadius: "20px 20px 20px 20px" }}
                    >
                      {translate("common.page.button.cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      disabled={!(this.state.oldpassword && this.state.newpassword && this.state.repassword)}
                      onClick={this.handleSubmit}
                      color='primary'
                      aria-label="edit"
                      style={{ width: "50%", marginBottom: "4%", marginTop: "4%", marginRight: "0px", borderRadius: "20px 20px 20px 20px" }}
                    >
                      {translate("common.page.button.submit")}
                    </Button>
                  </DialogActions>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  automl: state.automl,
  nmt: state.nmt,
  nmtsp: state.nmtsp,
  updatePasswordstatus: state.updatePasswordstatus
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      NMTApi: APITransport,
      NMTSPApi: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserProfile)));
