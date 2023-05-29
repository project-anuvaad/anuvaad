import React, { Component } from "react";
import { DropzoneArea } from "material-ui-dropzone";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";
import FileUploadStyles from "../../../styles/web/FileUpload";
// import Toolbar from "./FileUploadHeader";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import DocumentUpload from "../../../../flux/actions/apis/document_upload/document_upload";
import { createJobEntry } from "../../../../flux/actions/users/async_job_management";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";
// import UploadProcessModal from "./UploadProcessModal";
import Axios from "axios";
import UploadDocToS3 from "../../../../flux/actions/apis/document_translate/s3_upload_doc";
import ConfirmBox from "../../../components/web/common/ConfirmBox";
import { get_document_details } from "../../../../utils/getFormattedJobData";

const TELEMETRY = require("../../../../utils/TelemetryManager");
const LANG_MODEL = require("../../../../utils/language.model");

const theme = createMuiTheme({
    overrides: {
        MuiDropzoneArea: {
            root: {
                paddingTop: "15%",
                top: "auto",
                width: "98%",
                minHeight: "320px",
                height: "85%",
                borderColor: "#2C2799",
                backgroundColor: "#F5F9FA",
                border: "1px dashed #2C2799",
                fontColor: "#2C2799",
                marginTop: "3%",
                marginLeft: "1%",
                "& svg": { color: "#2C2799" },
                "& p": {
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "19px",
                    color: "#2C2799",
                },
            },
        },
    },
});

class UploadTranslatedDocument extends Component {
    constructor() {
        super();
        this.state = {
            files: [],
            jobs: [],
            selectedJob: "",
            open: false,
            name: "",
            message: "File uplaoded successfully",
            showComponent: false,
            fileName: "",
            path: "",
            variant: "success",
            showCompleteConfirmBox: false,
        };
    }

    getStartAndEndTimeForDocuments = () => {
        let startTime = new Date();
        let endTime = new Date();
        startTime = startTime.setDate(startTime.getDate() - 30);

        return {
            startTimeStamp: startTime.valueOf(),
            endTimeStamp: endTime.valueOf()
        }
    }

    getDocumentsByTimeStamp = () => {
        let apiObj = new FetchDocument(
            0,
            0,
            [],
            false,
            false,
            false,
            [],
            this.getStartAndEndTimeForDocuments()
        );

        Axios.post(apiObj?.endpoint, apiObj?.getBody(), { headers: apiObj?.getHeaders().headers })
            .then(res => {
                let data = get_document_details(res?.data);
                    let result = [];
                    data.filter((el,i)=>{
                        if(el.currentGranularStatus === "AUTO TRANSLATION - COMPLETED" || el.currentGranularStatus === "FINAL EDITING - IN PROGRESS"){
                            result.push(el);
                        }
                    })
                // console.log("result --- ", result);
                this.setState({ jobs: result });
            }).catch(err => {
                console.log("err -------- ", err);
            })
    }


    makeDocumentUploadAPICall = () => {
        let userModel = JSON.parse(localStorage.getItem("userProfile"));
        let modelId = LANG_MODEL.get_model_details(
            this.props.fetch_models.models,
            this.state.source_language_code,
            this.state.target_language_code,
            userModel.models
        );
        this.setState({ model: modelId });
        const { APITransport } = this.props;
        const apiObj = new DocumentUpload(this.state.files, "docUplaod", modelId);
        APITransport(apiObj);
    };

    handleClose = () => {
        this.setState({
            open: false,
            message: "",
            variant: "info"
        })
    }

    validationCheckBeforeFinalSubmit = () => {
        if (this.state.files.length > 0 && this.state.selectedJob) {
          
            let uploadJobName = this.state.files[0]?.name;
            let selectedJobName = this.state.selectedJob?.filename;
            
            let uploadFileName = uploadJobName?.substr(0, uploadJobName?.lastIndexOf("."));
            let selectedFileName = selectedJobName?.substr(0, selectedJobName?.lastIndexOf("."))
            if (selectedFileName + "_translated" !== uploadFileName) {
                alert(`Translated file name should be "${selectedFileName}_translated". Please rename the file and try again.`)
            } else {
                this.setState({ showCompleteConfirmBox: true })
            }
        } else {
            alert("Field should not be empty!");
        }
    }

    handleSubmit(e) {
        this.setState({ showCompleteConfirmBox: false })

        let uploadJobName = this.state.files[0]?.name;
        let selectedJobName = this.state.selectedJob?.filename;


        let uploadFileName = uploadJobName?.substr(0, uploadJobName?.lastIndexOf("."));
        let selectedFileName = selectedJobName?.substr(0, selectedJobName?.lastIndexOf("."))

        const fData = new FormData();
        fData.append("file", this.state.files[0]);
        fData.append("job_id", this.state.selectedJob?.jobID);
        fData.append("src_file", this.state.selectedJob?.converted_filename);

        console.log("fData --- ", Object.fromEntries(fData));

        const apiObj = new UploadDocToS3(fData);

        fetch(apiObj.apiEndPoint(), {
            method: 'post',
            body: fData,
            headers: apiObj.getHeaders().headers
        }).then(async response => {
            const rsp_data = await response.json();
            // console.log("rsp_data ----- ", rsp_data);
            if (!rsp_data.ok) {
                this.setState({
                    open: true,
                    message: "Request Failed.",
                    variant: "error"
                })
            } else {
                this.setState({
                    open: true,
                    message: "Translated File Uploaded",
                    variant: "success"
                });
                // call bulk again -----
                const { APITransport } = this.props;
                const apiObj = new FetchDocument(
                    0,
                    this.props.job_details.count,
                    [],
                    false,
                    false,
                    false
                );
                APITransport(apiObj);
                setTimeout(() => {
                    history.push(`${process.env.PUBLIC_URL}/view-document`);
                }, 2500);
            }
        }).catch(err => {
            console.log(err);
            this.setState({
                open: true,
                message: "Request Failed.",
                variant: "error"
            })
        })
        setTimeout(() => {
            this.setState({ open: false, varaint: "success" });
        }, 3000);
    }

    handleSelectChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    componentDidMount() {
        TELEMETRY.pageLoadStarted("upload-translated-document");
        this.getDocumentsByTimeStamp();
        // this.setState({
        //     showLoader: true,
        // });
    }

    componentWillUnmount() {
        TELEMETRY.pageLoadCompleted("upload-translated-document");
    }

    handleDelete = () => {
        this.setState({
            files: [],
            workspaceName: "",
        });
    };

    handleChange = (files) => {
        if (files.length > 0) {
            let path = files[0].name.split(".");
            let fileType = path[path.length - 1];
            let fileName = path.splice(0, path.length - 1).join(".");
            this.setState({
                files,
                fileName: files[0].name,
                path: fileType,
            });
        } else {
            this.setState({
                files: {
                    workspaceName: "",
                },
            });
        }
    };

    /**
     * render methods
     */
    renderSourceDocumentItems = () => {
        const { classes } = this.props;
        return (
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "3%" }}>
                <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <Typography
                        style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            fontFamily: "Roboto",
                            marginBottom: 2
                        }}
                    >
                        Select Source Document
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={this.state.jobs}
                        getOptionLabel={(option) => option.filename}
                        style={{ marginTop: 3 }}
                        onChange={(e, value) => {
                            console.log(value);
                            this.setState({ selectedJob: value });
                        }}
                        renderInput={(params) => <TextField {...params} placeholder="Select Source Document" variant="outlined" />}
                    />
                </Grid>
            </Grid>
        );
    };

    renderTargetLanguagesItems = () => {
        const { classes } = this.props;

        return (
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <Typography
                        style={{
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            fontFamily: "Roboto",
                            marginBottom: 2
                        }}
                    >
                        {translate("common.page.label.targetLang")}&nbsp;
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    render() {
        const { classes } = this.props;
        return (
            <div style={{}}>
                {/* <Toolbar /> */}

                <div className={classes.div} style={{ paddingTop: "2%", fontSize: "19px", fontWeight: "500" }}>
                    <Typography
                        // variant="h4"
                        className={classes.typographyHeader}
                    >
                        Upload Translated Document
                    </Typography>
                    <br />

                    <Typography variant="subtitle1" style={{ fontSize: "1rem" }} className={classes.note}>
                        Select source document from dropdown and upload the translated file.
                    </Typography>
                    <br />
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                <MuiThemeProvider theme={theme}>
                                    <DropzoneArea
                                        className={classes.DropZoneArea}
                                        showPreviewsInDropzone={
                                            this.state.files.length ? true : false
                                        }
                                        dropZoneClass={classes.dropZoneArea}
                                        acceptedFiles={[
                                            // ".txt,audio/*,.ods,.pptx,image/*,.psd,.pdf,.xlsm,.xltx,.xltm,.xla,.xltm,.docx,.rtf",
                                            // ".txt",
                                            ".pdf",
                                            ".docx",
                                            ".pptx",
                                            ".excel",
                                            ".xlsx",
                                            ".xls",
                                            ".log",
                                            ".xlsb",
                                        ]}
                                        onChange={this.handleChange.bind(this)}
                                        filesLimit={1}
                                        maxFileSize={104857600}
                                        dropzoneText={"Upload Translated Document"}
                                        // {translate(
                                        //     "common.page.label.addDropDocument"
                                        // )}
                                        onDelete={this.handleDelete.bind(this)}
                                    />
                                </MuiThemeProvider>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                {this.renderSourceDocumentItems()}
                            </Grid>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                {this.state.files[0]?.name &&
                                    <Typography variant="subtitle2">Upload file name - {this.state.files[0]?.name}</Typography>
                                }
                            </Grid>
                            {/* this.state.files[0]?.name */}
                            <Grid
                                item
                                xs={12}
                                sm={12}
                                lg={12}
                                xl={12}
                                style={{ paddingTop: "25px" }}
                            >
                                <Grid item xs={12} sm={12} lg={12} xl={12}>
                                    <Button
                                        id="upload"
                                        variant="contained"
                                        color="primary"
                                        className={classes.btnStyle}
                                        size="large"
                                        onClick={() => {
                                            this.validationCheckBeforeFinalSubmit()
                                        }}
                                    // disabled={!this.state.files.length}
                                    >
                                        {translate("common.page.button.upload")}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <ConfirmBox
                            open={this.state.showCompleteConfirmBox}
                            onClose={() => this.setState({ showCompleteConfirmBox: false })}
                            title="Upload Translated Document -"
                            contentText={<><span>Are you sure you want to upload translated document?</span> <br /> <span>You won't be able to edit/upload translation for this document again.</span></>}
                            onConfirm={this.handleSubmit.bind(this)}
                        />

                        {this.state.formatWarning && this.renderDialog()}
                        {this.state.open && (
                            <Snackbar
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                open={this.state.open}
                                autoHideDuration={6000}
                                onClose={this.handleClose}
                                variant={this.state.variant}
                                message={this.state.message}
                            />
                        )}
                    </Paper>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    fileUpload: state.fileUpload,
    configUplaod: state.configUplaod,
    workflowStatus: state.workflowStatus,
    documentUplaod: state.documentUplaod,
    fetch_models: state.fetch_models,
    job_details: state.job_details
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            createJobEntry,
            APITransport,
            CreateCorpus: APITransport,
        },
        dispatch
    );

export default withRouter(
    withStyles(FileUploadStyles)(
        connect(mapStateToProps, mapDispatchToProps)(UploadTranslatedDocument)
    )
);
