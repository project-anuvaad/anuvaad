import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { translate } from '../../../../../src/assets/localisation';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import DocumentConverterAPI from "../../../../flux/actions/apis/documentconverter";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Snackbar from "../../../components/web/common/Snackbar";
import Button from '@material-ui/core/Button';
import { showPdf } from '../../../../flux/actions/apis/showpdf';
import { withStyles } from '@material-ui/core/styles';

import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";

import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { showSidebar } from '../../../../flux/actions/apis/showSidebar';
import GlobalStyles from "../../../styles/web/styles";
import Theme from "../../../theme/web/theme-anuvaad";
import classNames from "classnames";
import history from "../../../../web.history";

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

class InteractiveDocHeader extends React.Component {
    state = {
        anchorEl: null
    };

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    downloadTargetFile() {
        this.setState({ anchorEl: null });

        let recordId = this.props.match.params.jobid;
        let user_profile = JSON.parse(localStorage.getItem('userProfile'))

        let apiObj = new DocumentConverterAPI(recordId, user_profile.id)

        const apiReq = fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then(async response => {
            const rsp_data = await response.json();
            if (!response.ok) {
                return Promise.reject('');
            } else {
                let fileName = rsp_data && rsp_data.[this.state.fileType] ? rsp_data.[this.state.fileType] : ""
                if (fileName) {
                    let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${fileName}`
                    window.open(url, "_self")
                }

            }
        }).catch((error) => {
            console.log('api failed because of server or network')
        });
    }

    openPDF = event => {
        this.props.showPdf(true)
    };


    renderOptions() {
        const { anchorEl } = this.state;
        const openEl = Boolean(anchorEl);

        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                <Button variant="outlined" onClick={this.openPDF.bind(this)}>{this.props.show_pdf ? "Show Sentences" : " Show PDF"}</Button>
                <Button variant="outlined" style={{ marginLeft: "10px" }} onClick={this.handleMenu.bind(this)}>
                    Download
                    <DownIcon />
                </Button>

                <StyledMenu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={openEl}
                    onClose={this.handleClose.bind(this)}
                >
                    <MenuItem
                        style={{ borderTop: "1px solid #D6D6D6" }}
                        onClick={() => {
                            this.downloadTargetFile(); this.setState({ fileType: "translated_document" })
                        }}
                    >
                        As DOCX
                        </MenuItem>
                    <MenuItem
                        style={{ borderTop: "1px solid #D6D6D6" }}
                        onClick={() => {
                            this.downloadTargetFile(); this.setState({ fileType: "translated_txt_file" })
                        }}
                    >
                        As TXT
                    </MenuItem>
                    <MenuItem
                        style={{ borderTop: "1px solid #D6D6D6" }}
                        onClick={() => {
                            this.downloadTargetFile(); this.setState({ fileType: "xlsx_file" })
                        }}
                    >
                        As XLSX
                    </MenuItem>
                </StyledMenu>
            </div>
        );
    }

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
                                        history.push(`${process.env.PUBLIC_URL}/view-document`);
                                    }}
                                    className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}
                                >
                                    <BackIcon />
                                </IconButton>
                                <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "1px", marginTop: "5px" }}></div>

                                <IconButton onClick={() => this.props.showSidebar(!open_sidebar)} className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}>
                                    <MenuIcon />
                                </IconButton>
                            </div>
                    }

                    <div style={{ borderLeft: "1px solid #D6D6D6", height: "40px", marginRight: "10px" }}></div>

                    <Typography variant="h5" color="inherit" className={classes.flex}>
                        {this.props.match.params.filename}
                    </Typography>
                    <div style={{ position: 'absolute', right: '30px' }}>
                        {this.renderOptions()}
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}

const mapStateToProps = state => ({
    show_pdf: state.show_pdf.open,
    open_sidebar: state.open_sidebar.open
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        APITransport,
        showPdf,
        showSidebar
    },
    dispatch
);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(InteractiveDocHeader)));
