import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, Typography } from "@material-ui/core";

import ThemeDefault from "../../../theme/web/theme-anuvaad";
import LoginStyles from "../../../styles/web/LoginStyles";
import TextField from '../../../components/web/common/TextField';
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import ForgotPasswordApi from "../../../../flux/actions/apis/user/forgotpassword";
import APITransport from "../../../../flux/actions/apitransport/apitransport";

class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            variantType: ""
        }
    }

    handleInputReceived = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleSubmit(e) {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.state.email.match(mailformat)) {
            let apiObj = new ForgotPasswordApi(this.state.email);
            fetch(apiObj.apiEndPoint(), {
                method: 'POST',
                headers: apiObj.getHeaders().headers,
                body: JSON.stringify(apiObj.getBody())
            })
                .then(res => {
                    if (res.ok) {
                        this.setState({ variantType: 'success', message: translate('updatePassword.page.message.forgotPasswordLinkSent'), open: true })
                    } else {
                        res.json().then(obj => {
                            this.setState({ variantType: 'error', message: obj.message, open: true })
                        })
                    }
                })
        } else {
            alert(translate('common.page.alert.validEmail'))
        }
        setTimeout(() => {
            this.setState({ open: false, variantType: '', message: '' })
        }, 6000)
    }


    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        return (
            <MuiThemeProvider theme={ThemeDefault}>

                <div style={{ height: window.innerHeight, overflow: 'hidden' }}>

                    <Grid container spacing={8}>
                        <Grid item xs={12} sm={4} lg={5} xl={5} style={{ paddingRight: "0px" }}>
                            <img src="Anuvaad.png" width="100%" height={window.innerHeight} alt="" />
                        </Grid>
                        <Grid item xs={12} sm={8} lg={7} xl={7} style={{ backgroundColor: '#f1f5f7', textAlign: "center" }} >
                            <Typography align='center' style={{ marginTop: '25%', marginBottom: '5%', fontSize: '33px', fontfamily: 'Trebuchet MS, sans-serif', color: '#003366' }}>
                                {translate('updatePassword.page.label.forgotPassword')}</Typography>

                            <TextField id="outlined-required" type="email" placeholder={translate('common.page.placeholder.emailUsername')}
                                margin="normal" varient="outlined" style={{ width: '50%', marginBottom: '2%', backgroundColor: 'white' }}
                                onChange={this.handleInputReceived('email')}
                                value={this.state.email}
                            />
                            <Button
                                id="submit"
                                disabled={!this.state.email}
                                variant="contained" aria-label="edit" style={{
                                    width: '50%', marginBottom: '2%', marginTop: '2%', borderRadius: "20px 20px 20px 20px", height: '45px',
                                    backgroundColor: this.state.email ? '#1ca9c9' : 'gray', color: 'white',
                                }} onClick={this.handleSubmit.bind(this)}>
                                {translate("common.page.button.submit")}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
                {this.state.open && (
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                        open={this.state.open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        variant={this.state.variantType}
                        message={this.state.message}
                    />
                )}
            </MuiThemeProvider>
        );
    }
}
const mapStateToProps = state => ({
    forgotpassword: state.forgotpassword
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
        )(UpdatePassword)
    )
);