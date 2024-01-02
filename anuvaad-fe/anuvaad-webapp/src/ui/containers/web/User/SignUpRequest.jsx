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
import { withStyles, Typography, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';

import ThemeDefault from "../../../theme/web/theme-default";
import LoginStyles from "../../../styles/web/LoginStyles";
import history from "../../../../web.history";
import TextField from '../../../components/web/common/TextField';
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import SignupApi from "../../../../flux/actions/apis/user/signup";
import FetchOrganizationList from "../../../../flux/actions/apis/organization/organization-list";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import RequestSignUpAPI from "../../../../flux/actions/apis/user/request_sign_up";

const TELEMETRY = require('../../../../utils/TelemetryManager')

class SignUpRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullname: "",
            email: "",
            documentCount: "",
            organization: "",
            variantType: '',
            openSnackBar: '',
            message: '',
            loading: false,
            showOrgTextField: false

        }
    }

    handleInputReceived = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleCheckboxChange = () => {
        this.setState({ termsAndCondition: !this.state.termsAndCondition })
    }

    componentDidMount() {

        const userObj = new FetchOrganizationList()
        this.props.APITransport(userObj)

        window.addEventListener('keypress', (key) => {
            if (key.code === 'Enter') {
                this.handleSubmit();
            }
        })
    }
    handleSubmit = () => {
        if (this.handleValidation('fullname') && this.handleValidation('email') && this.handleValidation('organization') && this.handleValidation('documentCount')) {
                    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                    if (this.state.email.match(mailFormat)) {
                            let apiObj = new RequestSignUpAPI(this.state.fullname, this.state.email, this.state.organization, this.state.documentCount);
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
                                            this.setState({
                                                message: "Successfully requested signup!",
                                                loading: false,
                                                openSnackBar: true, fullname: '', email: '', organization: '', documentCount: '',
                                                variantType: 'success'
                                            })
                                        } else {
                                            if (resp.status === 400) {
                                                resp.json().then((object) => {
                                                    this.setState({ message: object.message, loading: false, openSnackBar: true, fullname: '', email: '', organization: '', documentCount: '', variantType: 'error' })
                                                })
                                            }
                                        }
                                    })
                            } catch (error) {
                                this.setState({ message: 'Opps! Something went wrong, please try after sometime', loading: false, openSnackBar: true, fullname: '', email: '', organization: '', documentCount: '', variantType: 'error' })
                            }

                    } else {
                        // alert(translate('common.page.alert.validEmail'))
                        this.setState({
                            message: "Invalid Email!",
                            loading: false,
                            openSnackBar: true,
                            variantType: 'error'
                        })
                    }
        } else {
            // alert(translate('common.page.alert.provideValidDetails'))
            this.setState({
                message: "All fields are required to be filled out on the form!",
                loading: false,
                openSnackBar: true,
                variantType: 'error'
            })
        }
        setTimeout(() => {
            this.setState({ openSnackBar: false });
        }, 5000); 
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
                {/* <Grid item xs={12} sm={12} lg={7} xl={7} className={classes.signUpPaper} > */}
                <Typography align='center' variant='h3' className={classes.headingStyle}>Request Sign Up</Typography>

                <FormControl align='center' fullWidth >
                    <TextField value={this.state.fullname} id="first-name" placeholder={translate('common.page.label.name')}
                        varient="outlined" margin="dense" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('fullname')}
                    />
                    <TextField value={this.state.email} id="email" type="email-username" placeholder={'Email'}
                        margin="dense" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }} onChange={this.handleInputReceived('email')}
                    />

                        <Select
                              native
                              value={this.state.documentCount}
                              onChange={this.handleInputReceived('documentCount')}
                            // label="Count"
                            variant="outlined"
                            style={{ width: '50%', alignSelf: "center" }}
                            margin="dense"
                        >
                            <option defaultChecked aria-label="None" value="">Select Count</option>
                            <option value={'10'}>{'<10'}</option>
                            <option value={'50'}>{'10-50'}</option>
                            <option value={'100'}>{'51-100'}</option>
                            <option value={'200'}>{'100+'}</option>
                        </Select>
                        <FormHelperText style={{ marginBottom: '1%', alignSelf: "center"}}>Average document translations/digitizations per day</FormHelperText>
                    

                    
                        
                        {!this.state.showOrgTextField ? 
                            <Select
                            native
                            variant="outlined"
                            value={this.state.organization}
                            onChange={this.handleInputReceived('organization')}
                            // label="Select Organization"
                            style={{ width: '50%', alignSelf: "center" }}
                            margin="dense"
                        >
                            <option defaultChecked aria-label="None" value="">Select Organization</option>
                            {this.props.organizationList?.map(el=>{
                                return <option value={el}>{el}</option>
                            })}
                        </Select> : 
                        <TextField value={this.state.organization} id="outlined-age-native-simple" type="email-username" placeholder={'Organization'}
                        margin="dense" varient="outlined" style={{ width: '50%', backgroundColor: 'white' }} onChange={this.handleInputReceived('organization')}
                    />
                        }
                        <FormHelperText style={{ marginBottom: '1%', alignSelf: "center"}}>
                            {!this.state.showOrgTextField && `Can't find your organization? `}
                                <a 
                                variant="text" 
                                size="small" 
                                role="button" 
                                onClick={()=>{this.setState({showOrgTextField: !this.state.showOrgTextField})}}
                                style={{color: 'rgba(44, 39, 153, 1)', cursor: "pointer"}}
                                >{this.state.showOrgTextField ? 'Select from existing organizations' : 'Create new organization'}</a>
                        </FormHelperText>
                        
                    <div className={classes.wrapper}>
                        <Button
                            id="signup-btn"
                            // disabled={!this.state.termsAndCondition}
                            variant="contained" aria-label="edit" style={{
                                width: '50%', marginBottom: '2%', marginTop: '2%', borderRadius: '20px', height: '45px', textTransform: 'initial', fontWeight: '20px',
                                color: 'white',
                                backgroundColor: '#2C2799'
                            }}
                            onClick={this.handleSubmit}
                            ref={e => this.SignUpBtn = e}>
                            Request Signup
                            {this.state.loading && <CircularProgress size={24} className={`${classes.buttonProgress} success`} />}
                        </Button>
                    </div>

                </FormControl>

                <Typography className={classes.typography1}>{"Already have an account?"}
                    <Link id="newaccount" style={{ cursor: 'pointer', color: 'rgba(44, 39, 153, 1)' }} href="#" onClick={() => { history.push(`${process.env.PUBLIC_URL}/user/login`) }}> {translate('signUp.page.label.logIn')}</Link></Typography>


                <hr className={classes.hrTag} />
                <Typography align='center' className={classes.typographyFooter}>{translate('signUp.page.label.enterDetailsToReceiveRequestConfirmation')}<br />{translate('signUp.page.label.clickToActivateAccount')}</Typography>
                {/* </Grid> */}
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
            </MuiThemeProvider>

        );
    }
}


const mapStateToProps = state => ({
    signup: state.signup,
    organizationList: state.organizationList.orgList,
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
        )(SignUpRequest)
    ));
