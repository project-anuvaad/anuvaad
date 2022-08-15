import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import { withStyles, Typography } from "@material-ui/core";

import ThemeDefault from "../../../theme/web/theme-anuvaad";
import CircularProgress from '@material-ui/core/CircularProgress';
import LoginStyles from "../../../styles/web/LoginStyles";
import history from "../../../../web.history";
import TextField from '../../../components/web/common/TextField';
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import SetPasswordApi from "../../../../flux/actions/apis/user/setpassword";
import APITransport from "../../../../flux/actions/apitransport/apitransport";

class SetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            password: "",
            confirmPassword: "",
            loading: false

        }

    }
    handleInputReceived = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.password.length < 6) {
            alert("Please provide password with minimum 6 character, 1 number, 1, uppercase, 1 lower case and 1 special character.")
        }
        else if (this.state.password !== this.state.confirmPassword) {
            alert(translate('common.page.alert.passwordDidNotMatch'))
        } else {
            let apiObj = new SetPasswordApi(this.props.match.params.uid, this.props.match.params.rid, this.state.password);
            this.setState({ loading: true })
            const apiReq = fetch(apiObj.apiEndPoint(), {
                method: 'post',
                body: JSON.stringify(apiObj.getBody()),
                headers: apiObj.getHeaders().headers
            }).then(async response => {
                if (!response.ok) {
                    this.setState({ loading: false })
                    return Promise.reject('');
                } else {
                    this.setState({ message: translate('setPassword.page.message.passwordResetSuccessfull'), open: true })
                    setTimeout(() => {
                        history.push(`${process.env.PUBLIC_URL}/logout`)
                    }, 3000)
                }
            }).catch((error) => {
                this.setState({ loading: false })
            });
        }


    }

    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider theme={ThemeDefault}>

                <div style={{ height: window.innerHeight, overflow: 'hidden' }}>
                    <Grid container spacing={8}>
                        <Grid item xs={12} sm={4} lg={5} xl={5} style={{ paddingRight: "0px", paddingBottom: "0px", width: "100%", height: "100%" }}>
                            <img src="\Anuvaad.png" width="100%" height="100%" alt="" />
                        </Grid>
                        <Grid item xs={12} sm={8} lg={7} xl={7} style={{ backgroundColor: '#f1f5f7', textAlign: "center" }} >
                            <Typography align='center' style={{ marginTop: '25%', marginBottom: '5%', fontSize: '33px', fontfamily: 'Trebuchet MS, sans-serif	', color: '#003366' }}>Set Password</Typography>

                            <TextField value={this.state.password} id="password" type="password" placeholder="Enter password(Min length 6)*"
                                margin="normal" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }}
                                onChange={this.handleInputReceived('password')}
                            />
                            <TextField value={this.state.confirmPassword} id="re-password" type="password" placeholder="Re-enter password(Min length 6)*"
                                margin="normal" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }}
                                onChange={this.handleInputReceived('confirmPassword')}
                            />
                            <Button
                                disabled={!this.state.confirmPassword}
                                variant="contained" aria-label="edit" style={{
                                    width: '50%', marginTop: '2%', borderRadius: "20px 20px 20px 20px", height: '45px',
                                    backgroundColor: this.state.confirmPassword && !this.state.loading ? '#2C2799' : 'gray', color: 'white',
                                }} onClick={this.handleSubmit.bind(this)}>
                                {this.state.loading && <CircularProgress size={24} className={'success'} className={classes.buttonProgress} />}
                                Create Password
                                </Button>
                        </Grid>
                    </Grid>
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
    // setpassword: state.setpassword
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
        )(SetPassword)
    )
);