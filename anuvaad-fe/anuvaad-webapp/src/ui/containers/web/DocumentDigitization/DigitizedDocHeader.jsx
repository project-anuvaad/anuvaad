import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Alert from '@material-ui/lab/Alert';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
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
import { showPdf } from '../../../../flux/actions/apis/document_translate/showpdf';
import { showSidebar } from '../../../../flux/actions/apis/common/showSidebar';
import togglebtnstatus from '../../../../flux/actions/apis/view_digitized_document/show_bg_image';
import switchstyles from '../../../../flux/actions/apis/view_digitized_document/switch_styles';
import startediting from '../../../../flux/actions/apis/view_digitized_document/start_editing';
import copylocation from '../../../../flux/actions/apis/view_digitized_document/copy_location';
import set_crop_size from '../../../../flux/actions/apis/view_digitized_document/set_crop_size';
import reset_updated_word from '../../../../flux/actions/apis/view_digitized_document/reset_updated_word';

import DownloadDOCX from "../../../../flux/actions/apis/document_translate/download_docx";
import { translate } from "../../../../../src/assets/localisation";

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

class DigitizedDocHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            showStatus: false,
            message: null,
            timeOut: 3000,
            variant: "info",
            dialogMessage: null,
            showImage: false,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.active_page_number !== prevProps.active_page_number) {
            this.props.status && this.props.togglebtnstatus()
            this.props.copy_status && this.props.copylocation()
            this.props.edit_status && this.props.startediting()
        }
    }

    handleMenu = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    renderProgressInformation = () => {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                open={this.state.showStatus}
                message={this.state.message}
            >
                <Alert elevation={6} variant="filled" severity="info">{this.state.message}</Alert>
            </Snackbar>
        )
    }

    hideDocument = () => {
        this.props.onAction()
    }

    renderStatusInformation = () => {
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    open={true}
                    autoHideDuration={3000}
                    variant={this.state.variant}
                    message={this.state.dialogMessage}
                    onClose={() => this.setState({ dialogMessage: null })}

                >
                    <Alert elevation={6} variant="filled" severity="error">{this.state.dialogMessage}</Alert>
                </Snackbar>
            </div>
        )
    }

    openPDF = event => {
        this.props.showPdf()
    };

    copylocation = () => {
        this.props.copylocation()
        this.props.set_crop_size("", true)
    }

    fetchDocxFile = () => {
        let fname = this.props.match.params.filename.replace(".json", ".docx");
        let jobId = encodeURI(this.props.match.params.jobId);
        let jobName = this.props.match.params.filename;
        // jobName = jobName.substr(0, jobName.lastIndexOf("."));
        const apiObj = new DownloadDOCX(jobId, fname, jobName, 'ocr');
        this.setState({
            anchorEl: null,
            showStatus: true,
            message: translate("common.page.label.download"),
        });
        fetch(apiObj.apiEndPoint(), {
            method: "post",
            headers: apiObj.getHeaders().headers,
            body: JSON.stringify(apiObj.getBody()),
        }).then((res) => {
            if (res.ok) {
                res.blob().then((data) => {
                    //   const url = window.URL.createObjectURL(new Blob([res.data]));
                    let url = URL.createObjectURL(data);
                    const link = document.createElement("a");
                    link.href = url;
                    jobName = jobName.substr(0, jobName.lastIndexOf("."));
                    link.setAttribute(
                        "download",
                        `${fname}`
                    );
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                });
            } else {
                this.setState({
                    anchorEl: null,
                    showStatus: true,
                    message: "Downloading failed...",
                });
            }
        });
        setTimeout(() => {
            this.setState({ showStatus: false });
        }, 3000);
    };

    renderOptions() {
        const { anchorEl } = this.state;
        const openEl = Boolean(anchorEl);
        let { jobId, filename } = this.props.match.params
        let recordId = `${jobId}|${filename}`
        let userID = JSON.parse(localStorage.getItem("userProfile")).userID

        return (
            <div style={{ display: "flex", flexDirection: "row" }}>
                {
                    this.props.edit_status &&
                    <Button variant="outlined" color="primary" style={{ marginLeft: "10px" }} onClick={this.copylocation} disabled={this.props.copy_status}>
                        Copy Location
                    </Button>
                }

                {/* <Button variant="outlined" color="primary" style={{ marginLeft: "10px" }} onClick={() => {
                    this.props.startediting()
                    this.props.copy_status && this.props.copylocation()
                }}>
                    {this.props.edit_status ? "End Editing" : "Start Editing"}
                </Button> */}

                <Button variant="outlined" color="primary" style={{ marginLeft: "10px" }} onClick={this.handleMenu.bind(this)}>
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
                        style={{ borderTop: "1px solid #D6D6D6", fontFamily: "Roboto", fontSize: "0.875rem", fontWeight: "400" }}
                        onClick={() => {

                            this.setState({ anchorEl: null })
                            // this.props.onShowPreview()
                            this.props.downloadFile(recordId, userID, 'txt')
                        }}
                    >
                        As TXT
                    </MenuItem>
                    <MenuItem
                        style={{ borderTop: "1px solid #D6D6D6", fontFamily: "Roboto", fontSize: "0.875rem", fontWeight: "400" }}
                        onClick={() => {
                            this.setState({ anchorEl: null })
                            // this.props.onShowPreview()
                            this.props.downloadFile(recordId, userID, 'pdf')
                        }}
                    >
                        As PDF
                    </MenuItem>
                    <MenuItem
                        style={{ borderTop: "1px solid #D6D6D6", fontFamily: "Roboto", fontSize: "0.875rem", fontWeight: "400" }}
                        onClick={this.fetchDocxFile}
                    >
                        As DOCX
                    </MenuItem>
                </StyledMenu>
                <Button variant="outlined" color="primary" style={{ marginLeft: "10px" }} onClick={this.props.togglebtnstatus}>
                    {this.props.status ? "Hide Image" : "Show Image"}
                </Button>
            </div>
        );
    }

    render() {
        const { classes, open_sidebar } = this.props;
        return (
            <div
                style={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    paddingInline: "1%",
                    height: "60px",
                    backgroundColor: "#f0f0f0"
                }}
            >
                <Typography 
                    color="inherit" 
                    // className={classes.flex} 
                    style={{ 
                            overflow: "hidden",
                            maxWidth: "30%", 
                            textOverflow: "ellipsis",
                            fontSize: "1rem",
                            fontFamily: "Roboto",
                            fontWeight: "700",
                        }}
                >
                    <IconButton
                        onClick={() => {
                            this.props.edit_status && this.props.startediting()
                            this.props.reset_updated_word()
                            history.push(`${process.env.PUBLIC_URL}/document-digitization`);
                        }}
                        className={classes.menuButton} color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}
                    >
                        <BackIcon />
                    </IconButton>
                    {this.props.match.params.og_fname}
                </Typography>
                {this.renderOptions()}
                {this.state.showStatus && this.renderProgressInformation()}
                {this.state.dialogMessage && this.renderStatusInformation()}
            </div>

        )
    }
}

const mapStateToProps = state => ({
    show_pdf: state.show_pdf.open,
    open_sidebar: state.open_sidebar.open,
    status: state.showimagestatus.status,
    active_page_number: state.active_page_number.page_number,
    switch_style: state.switch_style.status,
    edit_status: state.startediting.status,
    copy_status: state.copylocation.status
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        APITransport,
        showPdf,
        showSidebar,
        togglebtnstatus,
        switchstyles,
        startediting,
        copylocation,
        set_crop_size,
        reset_updated_word
    },
    dispatch
);

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(withStyles(GlobalStyles(Theme), { withTheme: true })(DigitizedDocHeader)));
