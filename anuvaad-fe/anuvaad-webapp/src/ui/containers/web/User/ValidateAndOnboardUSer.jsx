import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { MuiThemeProvider,  } from "@material-ui/core/styles";
import { withStyles, Typography, CircularProgress } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';

import ThemeDefault from "../../../theme/web/theme-anuvaad";
import LoginStyles from "../../../styles/web/LoginStyles";
import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import ValidateOnboardUserAPI from "../../../../flux/actions/apis/user/validate_onboard_user";


class ValidateAndOnboardUSer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            validationSuccess: false,
            error: false
        }
    }



    handleInputReceived = prop => event => {
        this.setState({ [prop]: event.target.value });
    };

    componentDidMount() {
        // uid - token
        // rid - email
        console.log(this.props.match.params.uid,   this.props.match.params.rid);
        if (this.props.match.params.uid && this.props.match.params.rid) {
            const apiObj = new ValidateOnboardUserAPI(this.props.match.params.uid, this.props.match.params.rid);
            const api = fetch(apiObj.apiEndPoint(), {
                method: 'get',
                headers: apiObj.getHeaders().headers
            }).then(async response => {
                if (response.ok) {
                    this.setState({validationSuccess: true}, ()=> {
                    setTimeout(() => {
                        window.location.replace("/");
                    }, 6000);
                })
                } else {
                    this.setState({ open: true, message: 'Oops! Something went wrong. Please try again.' });
                    this.setState({error: true}, ()=> {
                        setTimeout(() => {
                            window.location.replace("/");
                        }, 6000);
                    })
                }
            })
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <MuiThemeProvider theme={ThemeDefault}>
                <div>
                    <Grid container>
                        <Grid item xs={12} sm={8} lg={10} xl={10} style={{marginLeft: "5rem", backgroundColor: '#fffff', textAlign: "center" }} >
                            {!this.state.error && 
                                <Typography 
                                    align='center' 
                                    style={{ marginTop: '5%', marginBottom: '5%', fontSize: '25px', fontfamily: 'Arial, Helvetica, sans-serif', color: '#003366' }}
                                >
                                    {this.state.validationSuccess ? "User Onboarded!" : "Onboarding User..."}
                                </Typography>
                            }
                            {this.state.validationSuccess && !this.state.error ? 
                            <CheckCircleIcon fontSize="large" htmlColor="green" /> : 
                            !this.state.validationSuccess && this.state.error ? 
                            <ErrorIcon fontSize="large" htmlColor="red" /> : 
                            <CircularProgress size={"3rem"} />}
                        </Grid>
                    </Grid>
                    <div className={classes.buttonsDiv} />
                    {this.state.open && (
                        <Snackbar
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            open={this.state.open}
                            autoHideDuration={6000}
                            onClose={this.handleClose}
                            variant="error"
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
        )(ValidateAndOnboardUSer)
    )
);
