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
import ThemeDefault from "../../theme/web/theme-default";

import LoginStyles from "../../styles/web/LoginStyles";

import LoginAPI from "../../../flux/actions/apis/login";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import history from "../../../web.history";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    localStorage.removeItem("token");
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
    const { APITransporter } = this.props;

    const apiObj = new LoginAPI(email, password);
    APITransporter(apiObj);
  };

  render() {
    const { user, classes, location } = this.props;
    if (user.token != null) {
      localStorage.setItem("token", user.token);
      if (location.pathname !== "/dashboard") {
        history.push("/dashboard");
      }
    }

    return (
      <MuiThemeProvider theme={ThemeDefault}>
        <div>
          <div className={classes.loginContainer}>
            <Paper className={classes.paper}>
              <form method="post">
                <FormControl fullWidth>
                  <InputLabel htmlFor="email">Name</InputLabel>
                  <Input id="email" floatingLabelText="E-mail" onChange={this.processInputReceived("email")} />
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input id="password" floatingLabelText="Password" type="password" onChange={this.processInputReceived("password")} />
                </FormControl>
                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        className={classes.checkRemember.className}
                        labelclassName={classes.checkRemember.labelclassName}
                        iconclassName={classes.checkRemember.iconclassName}
                      />
                    }
                    label="Remember me"
                  />

                  {/* <Link to="/"> */}
                  <Button variant="contained" onClick={this.processLoginButtonPressed} color="secondary" aria-label="edit">
                    Login
                  </Button>
                  {/* </Link> */}
                </div>
              </form>
            </Paper>

            <div className={classes.buttonsDiv}>
              <Button label="Register" href="/" className={classes.flatButton}>
                Register
              </Button>

              <Button label="Forgot Password?" href="/" className={classes.flatButton}>
                Forgot Password?
              </Button>
            </div>

            <div className={classes.buttonsDiv} />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

Login.propTypes = {
  user: PropTypes.object.isRequired,
  APITransporter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.login
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransporter: APITransport
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
