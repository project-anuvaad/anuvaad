import React from "react";
import history from "../../../web.history";
import Button from "@material-ui/core/Button";

import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../flux/actions/apitransport/apitransport";

import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { showSidebar } from '../../../flux/actions/apis/showSidebar';
import GlobalStyles from "../../styles/web/styles";
import Theme from "../../theme/web/theme-anuvaad";
import classNames from "classnames";

class ViewDocHeader extends React.Component {

    handleOnClick() {
        history.push(`${process.env.PUBLIC_URL}/document-upload`);
    }

    renderOption() {
        return (
            <div>
                <Button variant="contained"
                    color="primary"
                    style={{
                        borderRadius: "20px",
                        color: "#FFFFFF",
                        backgroundColor: "#1C9AB7",
                        height: "35px",
                        fontSize: "16px",
                    }}
                    size="large"
                    onClick={event => {
                        this.handleOnClick();
                    }}
                >
                    Start Translate
                </Button>
            </div >
        );
    }

    render() {
        const { classes, open_sidebar } = this.props;
        return (

            <AppBar position="fixed" color="secondary" className={classNames(classes.appBar, open_sidebar && classes.appBarShift)} style={{ height: '50px' }}>

                <Toolbar disableGutters={!this.props.open_sidebar} style={{ minHeight: "50px" }}>

                    {
                        open_sidebar &&
                        <IconButton onClick={() => this.props.showSidebar()} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}>
                            <CloseIcon />
                        </IconButton>
                    }
                    <IconButton onClick={() => this.props.showSidebar(!open_sidebar)} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}>
                        <MenuIcon />
                    </IconButton>

                    <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "10px" }}></div>

                    <Typography variant="h5" color="inherit" className={classes.flex}>
                        Document Translate
                    </Typography>
                    <div style={{ position: 'absolute', right: '30px' }}>
                        {this.renderOption()}
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
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
)(withStyles(GlobalStyles(Theme), { withTheme: true })(ViewDocHeader)));
