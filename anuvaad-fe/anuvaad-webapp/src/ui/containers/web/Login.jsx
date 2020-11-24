import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
// import {Link} from 'react-router';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core";
import ThemeDefault from "../../theme/web/theme-anuvaad";
import LoginStyles from "../../styles/web/LoginStyles";
import LoginAPI from "../../../flux/actions/apis/login";

import history from "../../../web.history";
import { translate } from "../../../assets/localisation";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import profileDetails from '../../../flux/actions/apis/profile_details'
import Link from '@material-ui/core/Link';

const TELEMETRY = require('../../../utils/TelemetryManager')

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: false
    };
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    TELEMETRY.pageLoadStarted('login')
    /**
    * getSnapshotBeforeUpdate() must return null
    */
    return null;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentDidMount() {
    localStorage.removeItem("token");
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
    this.setState({ error: false })
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
      this.setState({ error: true })
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
        history.push(`${process.env.PUBLIC_URL}/view-document`);

      }
    }).catch((error) => {
      console.log('api failed because of server or network')
    });



  }
  render() {
    return (
      <MuiThemeProvider theme={ThemeDefault}>
        <div style={{ width: "100%", height: window.innerHeight, display: "flex", flexDirection: "column", textAlign: "center" }}>
          <Paper style={{ width: "100%", height: "80px", textAlign: "left" }}>
           <Typography style={{color: "#233466", paddingLeft: "40px", marginTop: "20px"}} variant="h5">Anuvaad Translator</Typography>
          </Paper>
          <div style={{ marginTop: "7%" }}>
            <Typography style={{ fontWeight: '550', fontSize: "36px", color: "#233466" }}>
              Sign In
        </Typography>
            <Paper style={{ width: "40%", marginLeft: '30%', marginTop: "3%", textAlign: "left", alignItems: "center", display: "flex", flexDirection: "column" }}>
              <FormControl fullWidth style={{ alignItems: "center", display: "flex", flexDirection: "column" }}>

                <TextField
                  label="Email/UserName"
                  type="text"
                  name="email"
                  fullWidth
                  value={this.state.email}
                  onChange={this.processInputReceived('email')}
                  variant="outlined"
                  style={{ width: '50%', border: "grey", marginTop: "60px" }}

                />
                <TextField
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  value={this.state.password}
                  onChange={this.processInputReceived('password')}
                  variant="outlined"
                  style={{ width: '50%', border: "grey", marginTop: "40px" }}

                />

                {this.state.error && <Typography style={{ color: "red", alignItems: "left" }}>Incorrect username or password. please try again..!</Typography>}

                <Button
                  variant="contained" aria-label="edit" style={{
                    width: '50%', marginTop: '40px', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                    color: "#FFFFFF",
                    backgroundColor: "#1C9AB7",
                  }} onClick={this.processLoginButtonPressed.bind(this)}>
                  Sign In
              </Button>

                <div style={{ marginBottom: '60px', marginTop: "10px", textAlign: "left", width: '50%' }}>
                  <Link style={{ cursor: 'pointer', color: '#0C8AA9' }} href="#" onClick={() => { history.push("/forgot-password") }}> {translate('updatePassword.page.label.forgotPassword')}</Link>
                </div>

              </FormControl>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    )
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
