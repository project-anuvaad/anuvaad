import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles, Typography } from "@material-ui/core";
import ThemeDefault from "../../theme/web/theme-anuvaad";

import LoginStyles from "../../styles/web/LoginStyles";
import Grid from '@material-ui/core/Grid';
import SignupApi from "../../../flux/actions/apis/signup";
import ActivateUser from "../../../flux/actions/apis/activate_user";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import history from "../../../web.history";
import Snackbar from "../../components/web/common/Snackbar";
import { translate } from "../../../assets/localisation";

class Activate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }



    handleInputReceived = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    handleSubmit() {
        if (this.handleValidation('firstName') && this.handleValidation('lastName') && this.handleValidation('email') && this.handleValidation('password') && this.handleValidation('confirmPassword')) {
            if (this.state.password !== this.state.confirmPassword) {
                alert(translate('common.page.alert.passwordDidNotMatch'))
            } else {
                if (!this.state.termsAndCondition) {
                    alert(translate('common.page.alert.acceptTerms&Condition'))
                } else {
                    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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

    componentDidMount() {
        if (this.props.match.params.uid && this.props.match.params.rid) {
            const api = new ActivateUser(
                this.props.match.params.uid,
                this.props.match.params.rid
            );

            this.props.APITransport(api);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.activate !== this.props.activate) {
            this.setState({ message: translate('activate.page.message.accountActivatedSuccess'), open: true })
            setTimeout(()=>{
                history.push(`${process.env.PUBLIC_URL}/logout`)
            },4000)
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
                <div>
                    <Grid container>
                        <Grid item xs={12} sm={4} lg={5} xl={5} >
                            <img src="/Anuvaad.png" width="100%"  alt=""/>
                        </Grid>
                        <Grid item xs={12} sm={8} lg={7} xl={7} style={{ backgroundColor: '#f1f5f7' }} >
                            {/* <ValidatorForm
                            ref="form"
                            onSubmit={this.handleSubmit}
                            onError={errors => console.log(errors)}
                        > */}
                            <Typography align='center' style={{ marginTop: '45%', marginBottom: '5%', fontSize: '25px', fontfamily: 'Arial, Helvetica, sans-serif', color: '#003366' }}>{translate('activate.page.label.waitWhileWeActivateAccount')}</Typography>
                        </Grid>
                    </Grid>
                    <div className={classes.buttonsDiv} />
                    {this.state.open && (
                        <Snackbar
                            anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
    activate: state.activate
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
        )(Activate)
    )
);
