import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import classNames from "classnames";
import GlobalStyles from "../../../styles/web/styles";
import Theme from "../../../theme/web/theme-anuvaad";
import history from "../../../../web.history";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { showSidebar } from '../../../../flux/actions/apis/common/showSidebar';

const Header = (props) => {
    const { classes, open_sidebar } = props;
    return (
        <AppBar position="fixed" color="secondary" className={classNames(classes.appBar, open_sidebar && classes.appBarShift)} style={{ height: '50px' }}>

            <Toolbar disableGutters={!props.open_sidebar} style={{ minHeight: "50px" }}>

                {
                    open_sidebar ?
                        <IconButton onClick={() => props.showSidebar()} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}>
                            <CloseIcon />
                        </IconButton> :
                        <IconButton id="open-menu" onClick={() => props.showSidebar(!open_sidebar)} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}>
                            <MenuIcon />
                        </IconButton>
                }

                <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "10px" }}></div>
                <Typography variant="h5" color="inherit" className={classes.flex}>
                    My Glossary
                </Typography>
            </Toolbar>
        </AppBar>
    )
}


const mapStateToProps = state => ({
    open_sidebar: state.open_sidebar.open
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        APITransport,
        showSidebar
    },
    dispatch
);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(Header)));
