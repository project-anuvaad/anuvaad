import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles, Typography } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import ThemeDefault from "../../../theme/web/theme-default";
import LoginStyles from "../../../styles/web/LoginStyles";
import history from "../../../../web.history";
import TextField from '../../../components/web/common/TextField';
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import SignupApi from "../../../../flux/actions/apis/user/signup";
import APITransport from "../../../../flux/actions/apitransport/apitransport";

const TELEMETRY = require('../../../../utils/TelemetryManager')

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "    ",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndCondition: null,
      variantType: '',
      openSnackBar: '',
      message: '',
      loading: false

    }
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputReceived = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleCheckboxChange = () => {
    this.setState({ termsAndCondition: !this.state.termsAndCondition })
  }

  componentDidMount() {
    window.addEventListener('keypress', (key) => {
      if (key.code === 'Enter') {
        this.handleSubmit();
      }
    })
  }
  handleSubmit = () => {
    if (this.handleValidation('firstName') && this.handleValidation('email') && this.handleValidation('password') && this.handleValidation('confirmPassword') && this.handleValidation('termsAndCondition')) {
      if (this.state.password !== this.state.confirmPassword) {
        alert(translate('common.page.alert.passwordDidNotMatch'))
      } else {
        if (!this.state.termsAndCondition) {
          alert(translate('common.page.alert.acceptTerms&Condition'))
        } else {
          var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          var passwordFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
          if (this.state.email.match(mailFormat)) {
            if (this.state.password.match(passwordFormat)) {
              // let { APITransport } = this.props;
              let apiObj = new SignupApi(this.state.email, this.state.firstName, this.state.lastName, this.state.password);
              this.SignUpBtn.style.backgroundColor = 'gray';
              try {
                this.setState({ loading: true })
                fetch(apiObj.apiEndPoint(), {
                  method: 'post',
                  body: JSON.stringify(apiObj.getBody()),
                  headers: apiObj.getHeaders().headers,
                })
                  .then(resp => {
                    if (resp.ok) {
                      TELEMETRY.createUserEvent(this.state.firstName, this.state.email, "user")

                      this.setState({
                        message: translate('signUp.page.message.successfullyCreatedACcount'),
                        loading: false,
                        openSnackBar: true, firstName: '', email: '', password: '',
                        confirmPassword: '', termsAndCondition: null,
                        variantType: 'success'
                      })
                    } else {
                      if (resp.status === 400) {
                        resp.json().then((object) => {
                          TELEMETRY.log("users-create-user", JSON.stringify(object))

                          this.setState({ message: object.message, loading: false, openSnackBar: true, firstName: '', email: '', password: '', confirmPassword: '', termsAndCondition: null, variantType: 'error' })
                        })
                      }
                    }
                  })
              } catch (error) {
                this.setState({ message: 'Opps! Something went wrong, please try after sometime', loading: false, openSnackBar: true, firstName: '', email: '', password: '', confirmPassword: '', termsAndCondition: null, variantType: 'error' })
              }

            } else {
              alert("Please provide password with minimum 6 character, 1 number, 1 uppercase, 1 lower case and 1 special character.")

            }

          } else {
            alert(translate('common.page.alert.validEmail'))
          }
        }
      }
    } else {
      alert(translate('common.page.alert.provideValidDetails'))
    }
    this.setState({ openSnackBar: false });
  }

  handleValidation(key) {
    if (!this.state[key] || this.state[key].length < 2) {
      return false
    }
    return true
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={ThemeDefault}>

        <div style={{ height: window.innerHeight }}>
          <Grid container spacing={8} >
            <Grid item xs={12} sm={12} lg={5} xl={5} style={{ paddingRight: "0px" }}>
              <img src="Anuvaad.png" width="100%" height="100%" alt="" />
            </Grid>
            <Grid item xs={12} sm={12} lg={7} xl={7} className={classes.signUpPaper} >
              <Typography align='center' variant='h4' className={classes.typographyHeader}>Sign Up</Typography>

              <FormControl align='center' fullWidth >
                <TextField value={this.state.firstName} id="first-name" placeholder={translate('signUp.page.label.firstName')}
                  varient="outlined" margin="dense" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('firstName')}
                />
                {/* </FormControl> */}
                {/* <FormControl align='center' fullWidth>
                <TextField value={this.state.lastName} id="outlined-required" placeholder={translate('signUp.page.label.lastName')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('lastName')}
                />
              </FormControl> */}
                {/* <FormControl align='center' fullWidth> */}
                <TextField value={this.state.email} id="email" type="email-username" placeholder={translate('common.page.placeholder.emailUsername')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('email')}
                />
                {/* </FormControl>
              <FormControl align='center' fullWidth> */}
                <TextField value={this.state.password} id="passowrd" type="password" placeholder={translate('setPassword.page.placeholder.enterPassword')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('password')}
                />
                {/* </FormControl>
              <FormControl align='center' fullWidth> */}
                <TextField value={this.state.confirmPassword} id="re-password" type="password" placeholder={translate('setPassword.page.placeholder.reEnterPassword')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('confirmPassword')}
                />
                {/* </FormControl> */}
                <FormControlLabel className={classes.formControl}
                  control={
                    <Checkbox
                      id="privacy-policy-checkbox"
                      color={"primary"}
                      className={classes.checkRemember.className}
                      value={this.state.termsAndCondition ? true : false}
                      checked={(this.state.termsAndCondition || this.state.loading) ? true : false}
                      onChange={() => this.handleCheckboxChange()}

                    />
                  }
                  label={<div><span>{translate('signUp.page.label.iAgree')}</span>
                    <Link href="#" onClick={() => {
                      window.open('/Anuvaad-TnC.html', 'T&C', `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                    width=500,height=500`);
                    }} style={{ color: '#0C8AA9' }}> {translate('signUp.page.label.privacyPolicy')}</Link>
                  </div>}
                />

                <div className={classes.wrapper}>
                  <Button
                    id="signup-btn"
                    disabled={!this.state.termsAndCondition}
                    variant="contained" aria-label="edit" style={{
                      width: '50%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                      color: 'white',
                      backgroundColor: this.state.termsAndCondition ? '#2C2799' : 'gray'
                    }} onClick={this.handleSubmit}
                    ref={e => this.SignUpBtn = e}>
                    {translate('singUp.page.label.signUp')}
                    {this.state.loading && <CircularProgress size={24} className={'success'} className={classes.buttonProgress} />}
                  </Button>
                </div>

              </FormControl>

              <Typography className={classes.typography1}>{translate('signUp.page.label.allReadyHaveAccount')}
                <Link id="login" style={{ cursor: 'pointer', color: '#0C8AA9' }} href="#" onClick={() => { history.push("/") }}> {translate('signUp.page.label.logIn')}</Link></Typography>


              <hr className={classes.hrTag} />
              <Typography align='center' className={classes.typographyFooter}>{translate('signUp.page.label.enterDetailsToReceiveConfirmation')}<br />{translate('signUp.page.label.clickToActivateAccount')}</Typography>
            </Grid>
          </Grid>
          <div className={classes.buttonsDiv} />
          {this.state.openSnackBar &&
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              open={this.state.openSnackBar}
              autoHideDuration={6000}
              onClose={this.handleClose}
              variant={this.state.variantType}
              message={this.state.message}
            />
          }
        </div>

      </MuiThemeProvider>

    );
  }
}


const mapStateToProps = state => ({
  signup: state.signup
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport: APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(LoginStyles)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(SignUp)
  ));
