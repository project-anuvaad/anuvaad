import React from 'react';
import { Grid, Hidden, MuiThemeProvider, Typography, withStyles } from "@material-ui/core";
// import AppInfo from "./AppInfo";
import { useParams } from "react-router-dom";
import LoginStyles from "../../../styles/web/LoginStyles";
import Anuvaanlogo from "../../../../assets/Anuvaanlogo.png";
import ThemeDefault from "../../../theme/web/theme-default";
import SignUp from "./SignUp";
import Login from "./Login";
import UpdatePassword from "./UpdatePassword";
import SetPassword from './SetPassword';
import Activate from './Activate';

const UserManagement = (props) => {
    const { classes } = props;

    const param = useParams();
    const renderPage = () => {
        switch (param && param.page) {
            case "signup":
                return <SignUp />;
            case "login":
                return <Login location={props.location} />;
            case "forget-password":
                return <UpdatePassword />;
            case "set-password":
                return <SetPassword />;
            case "activate":
                return <Activate />;
            default:
                return <Login location={props.location} />;

        }
    };

    const renderLeftPanel = () => {
        return (
            <Grid container>
                <Hidden only="xs">
                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                        <img
                            src={Anuvaanlogo}
                            alt="logo"
                            style={{
                                width: "85px",
                                margin: "10% 0px 0% 35px",
                                borderRadius: "50%",
                            }}
                        />{" "}
                    </Grid>{" "}
                </Hidden>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography
                        variant={"h2"}
                        className={classes.title}
                        style={{
                            margin: "10% 294px 10% 39px",
                            fontFamily: '"Rowdies", cursive,"Roboto" ,sans-serif',
                        }}
                    >
                        Anuvaad
                    </Typography>
                </Grid>
                <Hidden only="xs">
                    <Typography
                        variant={"body1"}
                        className={classes.body}
                        style={{ margin: "20px 0px 50px 39px" }}
                    >
                        Anuvaad is an open source platform to perform Document Translation
                        and Digitization at scale with editing capabilities for various
                        Indic languages.
                    </Typography>
                </Hidden>
                <Typography style={{position: 'absolute', bottom: "0.5rem", margin: "20px 0px 50px 39px"}}>
                Powered by EkStep Foundation
                </Typography>
            </Grid>
        );
    };

    return (
        <MuiThemeProvider theme={ThemeDefault}>
            <Grid container>
                <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    lg={3}
                    color={"primary"}
                    className={classes.appInfo}
                >{renderLeftPanel()}</Grid>

                <Grid item xs={12} sm={8} md={9} lg={9} className={classes.parent} style={{ alignItems: param?.page === "forget-password" ? "inherit" : "inherit" }}>
                    <div >
                        {renderPage()}
                    </div>

                    {/* <Footer /> */}
                </Grid>
            </Grid>


        </MuiThemeProvider>
    );
};

export default withStyles(LoginStyles)(UserManagement);
