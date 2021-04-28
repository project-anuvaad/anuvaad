import React from "react";
import { withStyles } from '@material-ui/core/styles';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import GlobalStyles from "../../../styles/web/styles";
import Theme from "../../../theme/web/theme-anuvaad";
import classNames from "classnames";
import history from "../../../../web.history";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { showSidebar } from '../../../../flux/actions/apis/common/showSidebar';


class UserGlossaryUploadHeader extends React.Component {
    render() {
        const { classes, open_sidebar } = this.props;
        return (

            <AppBar position="fixed" color="secondary" className={classNames(classes.appBar, open_sidebar && classes.appBarShift)} style={{ height: '50px' }}>

                <Toolbar disableGutters={!this.props.open_sidebar} style={{ minHeight: "50px" }}>

                    {
                        open_sidebar ?
                            <IconButton onClick={() => this.props.showSidebar()} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}>
                                <CloseIcon />
                            </IconButton> :
                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <IconButton
                                    onClick={() => {
                                        history.push(`${process.env.PUBLIC_URL}/my-glossary`);
                                    }}
                                    className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}
                                >
                                    <BackIcon />
                                </IconButton>

                                <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "5px", marginTop: "5px" }} />

                                <IconButton onClick={() => this.props.showSidebar(!open_sidebar)} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px 0px 3px" }}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                    }

                    <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "10px" }}></div>

                    <Typography variant="h5" color="inherit" className={classes.flex}>
                        Create Glossary
                    </Typography>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(UserGlossaryUploadHeader));
