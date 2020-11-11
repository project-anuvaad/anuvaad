import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { translate } from '../../../../../src/assets/localisation';
import DownIcon from '@material-ui/icons/ArrowDropDown';
import DocumentConverterAPI from "../../../../flux/actions/apis/documentconverter";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { sentenceActionApiStarted, sentenceActionApiStopped } from '../../../../flux/actions/users/translator_actions';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Snackbar from "../../../components/web/common/Snackbar";
import Button from '@material-ui/core/Button';
import {showPdf} from '../../../../flux/actions/apis/showpdf';
import { withStyles } from '@material-ui/core/styles';

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

    downloadSourceFile() {
        this.setState({ anchorEl: null });

        let file = localStorage.getItem("inputFile")
        let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${
            file ? file : ""
            }`
        window.open(url, "_self")
    }

    downloadTargetFile() {
        this.setState({ anchorEl: null });

        let recordId = localStorage.getItem("recordId")
        let user_profile = JSON.parse(localStorage.getItem('userProfile'))

        let apiObj = new DocumentConverterAPI(recordId, user_profile.id)

        const apiReq = fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: JSON.stringify(apiObj.getBody()),
            headers: apiObj.getHeaders().headers
        }).then(async response => {
            const rsp_data = await response.json();
            if (!response.ok) {
                // this.props.sentenceActionApiStopped()
                return Promise.reject('');
            } else {
                let fileName = rsp_data && rsp_data.translated_document && rsp_data.translated_document ? rsp_data.translated_document : ""
                console.log(fileName)
                if (fileName) {
                    let url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${fileName}`
                    window.open(url, "_self")
                }
                // this.props.sentenceActionApiStopped()

            }
        }).catch((error) => {
            console.log('api failed because of server or network')
            // this.props.sentenceActionApiStopped()
        });
    }

    setMessages = (pendingAction, completedAction) => {
        this.setState({
            snackBarMessage: translate(`common.page.label.${pendingAction}`),
            snackBarSavedMessage: translate(`common.page.label.${completedAction}`),

        })
    }

    snackBarMessage = () => {
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={this.props.sentence_action_operation}
                    autoHideDuration={!this.props.sentence_action_operation && 2000}
                    variant={this.props.sentence_action_operation ? "info" : "success"}
                    message={this.props.sentence_action_operation ? this.state.snackBarMessage : this.state.snackBarSavedMessage}
                />
            </div>
        )

    }

    openPDF = event => {
       this.props.showPdf(true)
    };


    render() {
        const { anchorEl } = this.state;
        const openEl = Boolean(anchorEl);
 
        return (
            <div style={{ display: "flex", flexDirection: "row", marginRight: "-36px" }}>
                <Button variant="outlined" onClick={this.openPDF.bind(this)}>{this.props.show_pdf ? "Show Sentences" :" Show PDF"}</Button>
                <Button variant="outlined" style={{marginLeft: "10px"}} onClick={this.handleMenu.bind(this)}>
                    Download
                <DownIcon/>
                </Button>

                <StyledMenu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={openEl}
                    onClose={this.handleClose.bind(this)}
                >
                    <MenuItem
                        onClick={() => {
                            this.downloadSourceFile();
                        }}
                    >
                        Source File
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            this.props.sentenceActionApiStarted(null);
                            this.downloadTargetFile();
                            this.setMessages("download", "downloadCompleted")
                        }}
                    >
                        Translated File
                    </MenuItem>
                </StyledMenu>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    // saveContent: state.saveContent,
    // sentence_action_operation: state.sentence_action_operation.api_status,
    // show_pdf: state.show_pdf.open
});

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        sentenceActionApiStarted,
        sentenceActionApiStopped,
        showPdf,
        APITransport,
    },
    dispatch
);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InteractiveDocHeader));