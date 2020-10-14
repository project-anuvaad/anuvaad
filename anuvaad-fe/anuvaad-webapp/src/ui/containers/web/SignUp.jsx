import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, Typography } from "@material-ui/core";
import ThemeDefault from "../../theme/web/theme-default";

import LoginStyles from "../../styles/web/LoginStyles";
import Grid from '@material-ui/core/Grid';
import SignupApi from "../../../flux/actions/apis/signup";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import history from "../../../web.history";
import TextField from '../../components/web/common/TextField';
import Link from '@material-ui/core/Link';
import Snackbar from "../../components/web/common/Snackbar";
import { translate } from "../../../assets/localisation";
// import SignUpStyles from "../../styles/web/SignUpStyles";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAndCondition: ""

    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputReceived = prop => event => {
    this.setState({ [prop]: event.target.value });
  };

  handleSubmit(e) {

    e.preventDefault();

    if (this.handleValidation('firstName') && this.handleValidation('lastName') && this.handleValidation('email') && this.handleValidation('password') && this.handleValidation('confirmPassword') && this.handleValidation('termsAndCondition')) {
      if (this.state.password !== this.state.confirmPassword) {
        alert(translate('common.page.alert.passwordDidNotMatch'))
      } else {
        if (!this.state.termsAndCondition) {
          alert(translate('common.page.alert.acceptTerms&Condition'))
        } else {
          var mailformat = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
          if (this.state.email.match(mailformat)) {
            let { APITransport } = this.props;
            let apiObj = new SignupApi(this.state.email, this.state.firstName, this.state.lastName, this.state.password);
            APITransport(apiObj);
          } else {
            alert(translate('common.page.alert.validEmail'))
          }
        }
      }
    } else {
      alert(translate('common.page.alert.provideValidDetails'))
    }

  }

  componentDidUpdate(prevProps) {
    if (prevProps.signup !== this.props.signup) {
      this.setState({ message: translate('signUp.page.message.successfullyCreatedACcount'), open: true, firstName: '', lastName: '', email: '', password: '', confirmPassword: '', termsAndCondition: '' })
    }

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

        <div >
          <Grid container spacing={8} >
            <Grid item xs={12} sm={4} lg={5} xl={5} >
              <img src="Anuvaad.png" width="100%" height="956px" alt=""  marginBottom="0px"/>
            </Grid>
            <Grid item xs={12} sm={8} lg={7} xl={7} className={classes.signUpPaper} >
              {/* <ValidatorForm
                            ref="form"
                            onSubmit={this.handleSubmit}
                            onError={errors => console.log(errors)}
                        > */}
              <Typography align='center' variant='h4' className={classes.typographyHeader}>Sign Up</Typography>
              <FormControl align='center' fullWidth >

              <TextField  value={this.state.firstName} id="outlined-margin-dense" placeholder={translate('signUp.page.label.firstName')}
                   varient="outlined" margin="dense" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('firstName')}
                />
              </FormControl>
              <FormControl align='center' fullWidth>
                <TextField value={this.state.lastName} id="outlined-required" placeholder={translate('signUp.page.label.lastName')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('lastName')}
                />
              </FormControl>
              <FormControl align='center' fullWidth>
                <TextField value={this.state.email} id="outlined-required" type="email" placeholder={translate('common.page.placeholder.emailUsername')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('email')}
                />
              </FormControl>
              <FormControl align='center' fullWidth>
                <TextField value={this.state.password} id="outlined-required" type="password" placeholder={translate('setPassword.page.placeholder.enterPassword')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('password')}
                />                </FormControl>
              <FormControl align='center' fullWidth>
                <TextField value={this.state.confirmPassword} id="outlined-required" type="password" placeholder={translate('setPassword.page.placeholder.reEnterPassword')}
                  margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('confirmPassword')}
                />
              </FormControl>
              <FormControlLabel fullWidth className={classes.formControl}
                control={
                  <Checkbox
                    className={classes.checkRemember.className}
                    labelclassName={classes.checkRemember.labelclassName}
                    iconclassName={classes.checkRemember.iconclassName}
                    value={this.state.termsAndCondition ? false : true}
                    checked={this.state.termsAndCondition}
                    onChange={this.handleInputReceived('termsAndCondition')}
                    color='#ffffff !important'
                  />
                }
                label={<div><span>{translate('signUp.page.label.iAgree')}</span>
                  <Link href="#" onClick={() => {
                    window.open('/Anuvaad-TnC.html', 'T&C', `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                    width=500,height=500`);
                  }}style={{color:'#0C8AA9'}}> {translate('signUp.page.label.privacyPolicy')}</Link>
                </div>}
              />
              <br />
              <FormControl align='center' fullWidth>
                <Button
                  disabled={!this.state.termsAndCondition}
                  variant="contained" aria-label="edit" style={{
                    width: '50%', marginBottom: '2%', marginTop: '2%',borderRadius:'20px',height:'45px',textTransform:'initial',fontWeight:'20px', marginLeft: "25%", 
                    backgroundColor: this.state.termsAndCondition ? '#1ca9c9' : 'gray', color: 'white',
                  }} onClick={this.handleSubmit.bind(this)}>
                  {translate('singUp.page.label.signUp')}
                </Button>
              </FormControl>

              <Typography className={classes.typography1}>{translate('signUp.page.label.allReadyHaveAccount')}
                <Link style={{ cursor: 'pointer',color:'#0C8AA9' }} href="#" onClick={() => { history.push("/") }}> {translate('signUp.page.label.logIn')}</Link></Typography>

            
              <hr className={classes.hrTag} />
              <Typography align='center' className={classes.typographyFooter}>{translate('signUp.page.label.enterDetailsToReceiveConfirmation')}<br />{translate('signUp.page.label.clickToActivateAccount')}</Typography>
            </Grid>
          </Grid>
          <div className={classes.buttonsDiv} />
          {this.state.open && (
            <Snackbar
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              open={this.state.open}
              autoHideDuration={6000}
              onClose={this.handleClose}
              variant="success"
              message={this.state.message}
            />
          )}
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
  )
);
