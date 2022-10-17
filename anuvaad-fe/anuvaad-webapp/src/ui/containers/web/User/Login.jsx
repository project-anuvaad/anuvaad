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

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
      loading: false,
      errMessage: "",
      password: "",
      showPassword: false,
    };
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // TELEMETRY.pageLoadStarted('login')
    /**
     * getSnapshotBeforeUpdate() must return null
     */
    return null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    localStorage.removeItem("token");
    window.addEventListener("keypress", (key) => {
      if (key.code === "Enter") {
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
          localStorage.setItem("token", resData.token);
          this.fetchUserProfileDetails(resData.token);
        }
      })
      .catch((error) => {
        this.setState({ error: true, loading: false, errMessage: error });
      });
  };

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
            // history.push(`${process.env.PUBLIC_URL}/dummy-page`);
            history.push(`${process.env.PUBLIC_URL}/user-details`);
            // history.push(`${process.env.PUBLIC_URL}/create-user`)
          } else if (roles.includes("ADMIN")) {
            history.push(`${process.env.PUBLIC_URL}/user-details`);
            // history.push(`${process.env.PUBLIC_URL}/create-user`)
          } else if (roles.includes("TRANSLATOR")) {
            history.push(`${process.env.PUBLIC_URL}/view-document`);
          } else {
            history.push(`${process.env.PUBLIC_URL}/view-document`);
          }
          // history.push(`${process.env.PUBLIC_URL}/create-user`)
        }
      })
      .catch((error) => {
        console.log("api failed because of server or network");
      });
  };

  renderLeftPanel = () => {
    const { classes } = this.props;

    return (
      <Grid container>
        <Hidden only="xs">
          <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
            <img
              src={Anuvaanlogo}
              alt="logo"
              style={{
                width: "85px",
                margin: "10% 0px 0% 35px",
                borderRadius: "50%",
              }}
            />{" "}
          </Grid>{" "}
        </Hidden>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography
            variant={"h2"}
            className={classes.title}
            style={{
              margin: "10% 294px 10% 39px",
              fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
            }}
          >
            Anuvaad
          </Typography>
        </Grid>
        <Hidden only="xs">
          <Typography
            variant={"body1"}
            className={classes.body}
            style={{ margin: "20px 0px 50px 39px" }}
          >
            Anuvaad is an open source platform to perform Document Translation
            and Digitization at scale with editing capabilities for various
            Indic languages.
          </Typography>
        </Hidden>
      </Grid>
    );
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
            onChange={(event) => this.setState({ email: event.target.value })}
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
            type={this.state.showPassword ? "text" : "password"}
            onChange={(event) =>
              this.setState({ password: event.target.value })
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
            style={{textAlign: "end"}}
          >
            <Link
              onClick={() => {
                history.push(`${process.env.PUBLIC_URL}/forgot-password`);
              }}
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

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={ThemeDefault}>
        <Grid container>
          <Grid
            item
            xs={12}
            sm={4}
            md={3}
            lg={3}
            color={"primary"}
            className={classes.appInfo}
          >
            {this.renderLeftPanel()}
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={9} className={classes.parent}>
            <form autoComplete="off">{this.renderCardContent()}</form>
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
