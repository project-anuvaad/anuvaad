import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import ThemeDefault from "../../../theme/web/theme-default";
import LoginStyles from "../../../styles/web/LoginStyles";
import history from "../../../../web.history";
import TextField from '../../../components/web/common/TextField';
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import LoginAPI from "../../../../flux/actions/apis/user/login";
import profileDetails from '../../../../flux/actions/apis/user/profile_details';

const TELEMETRY = require('../../../../utils/TelemetryManager')

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false,
      loading: false
    };
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // TELEMETRY.pageLoadStarted('login')
    /**
    * getSnapshotBeforeUpdate() must return null
    */
    return null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentDidMount() {
    localStorage.removeItem("token");
    window.addEventListener('keypress', (key) => {
      if (key.code === 'Enter') {
        this.processLoginButtonPressed();
      }
    })

    // TELEMETRY.pageLoadCompleted('login')
  }

  /**
   * user input handlers
   * captures text provided in email and password fields
   */

  processInputReceived = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  /**
   * user input handlers
   * captures form submit request
   */
  processLoginButtonPressed = () => {
    const { email, password } = this.state;
    this.setState({ error: false, loading: true })
    const apiObj = new LoginAPI(email, password);
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        return Promise.reject('');
      } else {
        let resData = rsp_data && rsp_data.data
        localStorage.setItem("token", resData.token)
        this.fetchUserProfileDetails(resData.token)
      }
    }).catch((error) => {
      this.setState({ error: true, loading: false })
    });
  };

  handleRoles = (value) => {
    let result = []
    value.roles.map(element => {
      result.push(element.roleCode)
    })
    return result;
  }

  fetchUserProfileDetails = (token) => {

    const apiObj = new profileDetails(token);
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        return Promise.reject('');
      } else {
        let resData = rsp_data && rsp_data.data
        var roles = this.handleRoles(resData);
        localStorage.setItem("roles", roles)
        localStorage.setItem("lang", "en")
        localStorage.setItem("userProfile", JSON.stringify(resData));
        if (roles.includes('ADMIN')) {
          history.push(`${process.env.PUBLIC_URL}/user-details`);
          // history.push(`${process.env.PUBLIC_URL}/create-user`)
        } else if (roles.includes('TRANSLATOR')) {
          history.push(`${process.env.PUBLIC_URL}/view-document`);
        }
        else {
          history.push(`${process.env.PUBLIC_URL}/view-document`);
        }
        // history.push(`${process.env.PUBLIC_URL}/create-user`)
      }
    }).catch((error) => {
      console.log('api failed because of server or network')
    });
  }


  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={ThemeDefault} >

        <div style={{ height: window.innerHeight, overflow: 'hidden' }}>
          <Grid container spacing={8}>
            <Grid item xs={12} sm={4} lg={5} xl={5} style={{ paddingRight: "0px" }}>
              <img src="Anuvaad.png" width="100%" height="81%" alt="" style={{ backgroundRepeat: 'repeat-y' }} />
            </Grid>
            <Grid item xs={12} sm={8} lg={7} xl={7} className={classes.signUpPaper} >
              <Typography align='center' variant='h4' className={classes.typographyHeader} style={{ marginTop: '240px' }}>Sign In</Typography>

              <FormControl align='center' fullWidth >
                <TextField value={this.state.email} id="email" type="email-username" placeholder={translate('common.page.placeholder.emailUsername')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.processInputReceived('email')}
                />
                <TextField value={this.state.password} id="passowrd" type="password" placeholder="Enter Password*"
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.processInputReceived('password')}
                />

                <div className={classes.wrapper}>
                  <Button
                    id="signin-btn"
                    variant="contained" aria-label="edit" style={{
                      width: '50%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                      backgroundColor: this.state.loading ? 'grey' : '#1ca9c9', color: 'white',
                    }} onClick={this.processLoginButtonPressed.bind(this)}
                    disabled={this.state.loading}>
                    {this.state.loading && <CircularProgress size={24} className={'success'} className={classes.buttonProgress} />}
                    Sign In
                </Button>
                </div>

              </FormControl>

              <Typography>
                <Link id="forgotpassword" style={{ cursor: 'pointer', color: '#0C8AA9', marginLeft: '25%', float: 'left' }} href="#" onClick={() => { history.push(`${process.env.PUBLIC_URL}/forgot-password`); }}> {translate('updatePassword.page.label.forgotPassword')}</Link>
                <Link id="signup" style={{ cursor: 'pointer', color: '#0C8AA9', marginRight: '25%', float: 'right' }} href="#" onClick={() => { history.push(`${process.env.PUBLIC_URL}/signup`); }}> {translate('singUp.page.label.signUp')}</Link>
              </Typography>
            </Grid>
          </Grid>
          <div className={classes.buttonsDiv} />
          {this.state.error && (
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              open={this.state.error}
              autoHideDuration={4000}
              onClose={this.handleClose}
              variant="error"
              message={"Invalid Username/Password"}
            />
          )}
        </div>

      </MuiThemeProvider>

    );
  }
}


Login.propTypes = {
  user: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  user: state.login
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
    },
    dispatch
  );

export default withRouter(
  withStyles(LoginStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Login)
  )
);

