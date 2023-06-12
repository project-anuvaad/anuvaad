import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  withStyles,
  Typography,
  Hidden,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Button from "../../../components/web/common/Button";
import ThemeDefault from "../../../theme/web/theme-default";
import LoginStyles from "../../../styles/web/LoginStyles";
import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import LoginAPI from "../../../../flux/actions/apis/user/login";
import profileDetails from "../../../../flux/actions/apis/user/profile_details";
import OutlinedTextField from "../../../components/web/common/OutlinedTextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import CustomCard from "../../../components/web/common/Card";
import Anuvaanlogo from "../../../../assets/Anuvaanlogo.png";
import UpdatePassword from "./UpdatePassword";
import SignUp from "./SignUp";
import CircularProgressWithLabel from "../../../components/web/common/CircularLoader";
import EnterOTPModal from "./EnterOTPModal";
import RegisterMFAModal from "./RegisterMFAModal";
import RegisterMFA from "../../../../flux/actions/apis/user/MFA_register";
import VerifyMFA from "../../../../flux/actions/apis/user/MFA_verify";
import OneTimeEmailUpdateModal from "./OneTimeEmailUpdateModal";
import UpdateEmail from "../../../../flux/actions/apis/user/update_email";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.currentPage = this.props.match.params.page;
    this.state = {
      email: "",
      password: "",
      error: false,
      loading: false,
      errMessage: "",
      password: "",
      showPassword: false,
      currentFocusedComponent: "Login",
      reloadPage: false,
      inputFocused: false,
      showOTPDialog: false,
      showMFAMethodSelectionModal: false,
      sessionId: "",
      registerSuccessMessage: false,
      verifySuccessMessage: false,
      otpModalTitle: "",
      hideResendOTPButton: false,
      currentEmail: "",
      showOneTimeUpdateEmailIdModal: false,
      oneTimeUpdateEmailIdSuccessMessage: false,
      
    };
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // TELEMETRY.pageLoadStarted('login')
    /**
     * getSnapshotBeforeUpdate() must return null
     */
    return null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) { }

  componentDidMount() {
    localStorage.removeItem("token");
    window.addEventListener("keypress", (key) => {
      if (key.code === "Enter" && this.state.inputFocused) {
        this.setState({ inputFocused: false });
        this.processLoginButtonPressed();
      }
    });

    // TELEMETRY.pageLoadCompleted('login')
  }

  /**
   * user input handlers
   * captures text provided in email and password fields
   */

  processInputReceived = (prop) => (event) => {
    this.setState({ [prop]: event.target.value });
  };

  handleCloseOTPModal = () => {
    this.setState({ showOTPDialog: false });
    setTimeout(() => {
      this.setState({ verifySuccessMessage: "" })
    }, 4000);
  }

  handleCloseMFASelectionModal = () => {
    this.setState({ showMFAMethodSelectionModal: false });
    setTimeout(() => {
      this.setState({ registerSuccessMessage: false })
    }, 4000);
  }

  /**
   * user input handlers
   * captures form submit request
   */
  processLoginButtonPressed = () => {
    const { email, password } = this.state;
    this.setState({ error: false, loading: true });
    const apiObj = new LoginAPI(email, password);
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        const rsp_data = await response.json();
        if (!response.ok) {
          return Promise.reject(rsp_data.message);
        } else {
          let resData = rsp_data && rsp_data.data;
          if (resData.session_id) {
            if(!resData.email.updated_status){
              this.setState({showOneTimeUpdateEmailIdModal: true, currentEmail: resData.email.registered_email, oneTimeUpdateEmailIdSuccessMessage: false});
            } else if (resData.mfa_required && !resData.mfa_registration) {
              this.setState({ showMFAMethodSelectionModal: true, sessionId: resData.session_id });
            } else if (resData.mfa_required && resData.mfa_registration) {
              if(resData.mfa_message.includes("app")){
                this.setState({hideResendOTPButton: true})
              }
              this.setState({ showOTPDialog: true, sessionId: resData.session_id, otpModalTitle: resData.mfa_message });
            }
          } else if (resData.token){
              localStorage.setItem("token", resData.token);
              this.fetchUserProfileDetails(resData.token);
          }
          this.setState({ error: false, loading: false });
        }
      })
      .catch((error) => {
        this.setState({ error: true, loading: false, errMessage: error });
      });
  };

  onRegisterMFAClick = (selectedMethod) => {
    const { email, sessionId } = this.state;
    this.setState({ error: false, loading: true });
    // call mfa register API here
    const apiObj = new RegisterMFA(email, sessionId, selectedMethod);

    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
      .then(async (response) => {
        const rsp_data = await response.json();
        if (!rsp_data.ok) {
          this.setState({ error: true, loading: false, errMessage: rsp_data.message, showMFAMethodSelectionModal: false });
        } else {
          this.setState({ error: false, loading: false, registerSuccessMessage: true });
          setTimeout(() => {
            this.handleCloseMFASelectionModal()
          }, 3000);
        }
      })
      .catch(err => {
        this.setState({ error: true, loading: false, errMessage: "Unable to register for MFA!" });
      })
  }

  onSubmitOTP = (otp, callback) => {
    const { email, sessionId } = this.state;
    this.setState({ error: false, loading: true });
    // call mfa register API here
    const apiObj = new VerifyMFA(email, sessionId, otp, false);

    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
      .then(async (response) => {
        const rsp_data = await response.json();
        console.log("rsp_data --- ", rsp_data);
        if (!rsp_data.ok) {
          this.setState({ error: true, loading: false, errMessage: rsp_data.message });
        } else {
          this.setState({ error: false, loading: false, verifySuccessMessage: true });
          // callback();
          localStorage.setItem("token", rsp_data.data.token);
          this.fetchUserProfileDetails(rsp_data.data.token);
        }
      })
      .catch(err => {
        this.setState({ error: true, loading: false, errMessage: "Unable to Verify OTP!" });
      })
  }

  OnUpdateEmailIdClick = (new_email) => {
    const {email, password} = this.state;
    const apiObj = new UpdateEmail(email, password, new_email);
    fetch(apiObj.apiEndPoint(), {
      method: "POST",
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
    .then( async (response)=>{
      const rsp_data = await response.json();
      console.log("rsp_data --- ", rsp_data);
      if(rsp_data.ok){
        this.setState({oneTimeUpdateEmailIdSuccessMessage: true});
        setTimeout(() => {
          this.setState({showOneTimeUpdateEmailIdModal: false, oneTimeUpdateEmailIdSuccessMessage: false})
        }, 4000);
      }
    })
    .catch(err => {
      this.setState({ error: true, loading: false, errMessage: "Unable To Update Email!" });
    })
  }

  onResendOTPClick = () => {
    this.processLoginButtonPressed(true);
  }

  handleRoles = (value) => {
    let result = [];
    value.roles.map((element) => {
      result.push(element.roleCode);
    });
    return result;
  };

  fetchUserProfileDetails = (token) => {
    const apiObj = new profileDetails(token);
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: "post",
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers,
    })
      .then(async (response) => {
        const rsp_data = await response.json();
        if (!response.ok) {
          return Promise.reject("");
        } else {
          let resData = rsp_data && rsp_data.data;
          var roles = this.handleRoles(resData);
          localStorage.setItem("roles", roles);
          localStorage.setItem("lang", "en");
          localStorage.setItem("userProfile", JSON.stringify(resData));
          if (roles.includes("SUPERADMIN")) {
            history.replace(`${process.env.PUBLIC_URL}/user-details`);
          } else if (roles.includes("ADMIN")) {
            history.replace(`${process.env.PUBLIC_URL}/user-details`);
          } else if (roles.includes("REVIEWER")) {
            history.replace(`${process.env.PUBLIC_URL}/review-documents`);
          } else if (roles.includes("TRANSLATOR")) {
            history.replace(`${process.env.PUBLIC_URL}/intro`);
          } else {
            history.replace(`${process.env.PUBLIC_URL}/intro`);
          }
        }
      })
      .catch((error) => {
        console.log("api failed because of server or network");
      });
  };

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  TextFields = () => {
    return (
      <Grid container spacing={2} style={{ marginTop: "2px" }}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="email"
            onFocus={() => this.setState({ inputFocused: true })}
            onBlur={() => this.setState({ inputFocused: false })}
            onChange={(event) => this.setState({ email: event.target.value.trim() })}
            value={this.state.email}
            placeholder="Enter your Email ID*"
            InputProps={{
              style: { fontSize: "1.25rem" },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <OutlinedTextField
            fullWidth
            name="password"
            onFocus={() => this.setState({ inputFocused: true })}
            onBlur={() => this.setState({ inputFocused: false })}
            type={this.state.showPassword ? "text" : "password"}
            onChange={(event) =>
              this.setState({ password: event.target.value.trim() })
            }
            value={this.state.password}
            placeholder={"Enter your Password*"}
            InputProps={{
              style: { fontSize: "1.25rem" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={this.handleClickShowPassword}
                    onMouseDown={this.handleMouseDownPassword}
                  >
                    {this.state.showPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    );
  };

  renderCardContent = () => {
    const { classes } = this.props;

    return (
      <CustomCard title={"Sign in to Anuvaad"} cardContent={this.TextFields()} className={classes.headingStyle}>
        <Grid container spacing={2} style={{ width: "100%" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Link
              id="newaccount"
              onClick={() => {
                // this.handleChangeFocusedComponent("Signup")
                history.push(`${process.env.PUBLIC_URL}/user/signup`);
              }}
              href="#"
              className={classes.forgotPassLink}
            >
              Sign Up
            </Link>

            <Link
              id="newaccount"
              onClick={() => {
                // this.handleChangeFocusedComponent("ForgetPassword")
                history.push(`${process.env.PUBLIC_URL}/user/forget-password`);
              }}
              href="#"
              className={classes.forgotPassLink}
            >
              Forgot Password?
            </Link>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button
              fullWidth
              onClick={this.processLoginButtonPressed.bind(this)}
              label={"Login"}
              className={classes.loginBtn}
            />
          </Grid>
        </Grid>
      </CustomCard>
    );
  };

  renderLoginForm = () => {
    return <form autoComplete="off" style={{ marginLeft: "15rem" }}>{this.renderCardContent()}</form>
  }


  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={ThemeDefault}>
        <Grid container>
          {this.state.loading && <CircularProgressWithLabel value={100} />}
          <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
            {this.renderLoginForm()}
          </Grid>
        </Grid>

        {this.state.error && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={this.state.error}
            autoHideDuration={4000}
            onClose={this.handleClose}
            variant="error"
            message={this.state.errMessage}
          />
        )}
        <EnterOTPModal open={this.state.showOTPDialog}
          handleClose={() => this.handleCloseOTPModal()}
          onResend={() => this.onResendOTPClick()}
          OTPModalTitle={this.state.otpModalTitle}
          onSubmit={(OTP) => this.onSubmitOTP(OTP)}
          verifySuccessMessage={this.state.verifySuccessMessage}
          hideResendOTPButton={this.state.hideResendOTPButton}
        />
        <RegisterMFAModal
          open={this.state.showMFAMethodSelectionModal}
          handleClose={this.handleCloseMFASelectionModal}
          onRegisterMFAClick={(selectedMethod) => { this.onRegisterMFAClick(selectedMethod) }}
          registerSuccessMessage={this.state.registerSuccessMessage}
        />
        <OneTimeEmailUpdateModal
          open={this.state.showOneTimeUpdateEmailIdModal}
          currentEmail={this.state.currentEmail}
          onUpdateEmailId={this.OnUpdateEmailIdClick}
          oneTimeUpdateEmailIdSuccessMessage={this.state.oneTimeUpdateEmailIdSuccessMessage}
        />
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.login,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({}, dispatch);

export default withRouter(
  withStyles(LoginStyles)(connect(mapStateToProps, mapDispatchToProps)(Login))
);
