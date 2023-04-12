import React from 'react';
import Header from './StartDigitizationHeader';
import { Typography } from '@material-ui/core';
import { translate } from "../../../../../assets/localisation";
import FileUploadStyles from "../../../../styles/web/FileUpload";
import { withStyles } from "@material-ui/core/styles";
import { DropzoneArea } from "material-ui-dropzone";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FetchModel from "../../../../../flux/actions/apis/common/fetchmodel";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import APITransport from "../../../../../flux/actions/apitransport/apitransport";
import FetchDigitizedDocument from "../../../../../flux/actions/apis/view_digitized_document/fetch_digitized_document";
import history from "../../../../../web.history";
import DocumentUpload from "../../../../../flux/actions/apis/document_upload/document_upload";
import WorkFlow from "../../../../../flux/actions/apis/common/fileupload";
import { createJobEntry } from '../../../../../flux/actions/users/async_job_management';
import Snackbar from "../../../../components/web/common/Snackbar";
import Spinner from "../../../../components/web/common/Spinner"
import UploadProcessModal from '../../DocumentUpload/UploadProcessModal';
import Axios from "axios";

const theme = createMuiTheme({
    overrides: {
        MuiDropzoneArea: {
            root: {
                paddingTop: '15%',
                top: "auto",
                width: '98%',
                minHeight: '330px',
                height: "85%",
                borderColor: '#2C2799',
                backgroundColor: '#F5F9FA',
                border: '1px dashed #2C2799',
                fontColor: '#2C2799',
                marginTop: "3%",
                marginLeft: '1%',
                "& svg": { color: '#2C2799', },
                "& p": {
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "19px",
                    color: '#2C2799',

                }
            },

        }
    }
});
const LANG_MODEL = require('../../../../../utils/language.model')
const TELEMETRY = require('../../../../../utils/TelemetryManager')


class StartDigitizationUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            source: "",
            target: "",
            files: [],
            open: false,
            modelLanguage: [],
            name: "",
            message: "File uplaoded successfully",
            variant: "success",
            showComponent: false,
            workflow: localStorage.getItem("roles") === "TRANSLATOR" ? "WF_A_FCWDLDBSOD15GVOTK" : "",
            worflow_codes: [{
                code: 'WF_A_FCOD10GVOTK',
                version: '1.0'
            }, {
                code: 'WF_A_FCWDLDBSOD15GVOTK',
                version: '1.5'
            }, {
                code: 'WF_A_FCWDLDBSOD20TESOTK',
                version: '2.0'
            }],
            fileName: "",
            workspaceName: "",
            path: "",
            source_language_code: '',
            target_language_code: '',
            source_languages: [],
            target_languages: [],
            showProcessModal: false,
            documentState: ""
        }
    }

    componentDidMount() {
        TELEMETRY.pageLoadStarted('document-digitization')
        const { APITransport } = this.props;
        const apiModel = new FetchModel();
        APITransport(apiModel);
        this.setState({ showLoader: true });

    }

    componentDidUpdate(prevProps) {
        if (prevProps.fetch_models.models !== this.props.fetch_models.models) {
            this.setState({
                source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
                target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
                showLoader: false
            })
        }

        if (prevProps.documentUplaod !== this.props.documentUplaod) {
            var sourceLang = LANG_MODEL.get_language_name(this.props.fetch_models.models, this.state.source_language_code, true)
            const { APITransport } = this.props;
            const apiObj = new WorkFlow(this.state.workflow, this.props.documentUplaod.data, this.state.workspaceName ? this.state.workspaceName : this.state.fileName, this.state.source_language_code,
                this.state.target_language_code, this.state.path, this.state.model, "", sourceLang);
            APITransport(apiObj);
        }

        if (prevProps.workflowStatus !== this.props.workflowStatus) {
            this.props.createJobEntry(this.props.workflowStatus)

            var sourceLang = LANG_MODEL.get_language_name(this.props.fetch_models.models, this.state.source_language_code, true)
            var targetLang = LANG_MODEL.get_language_name(this.props.fetch_models.models, this.state.target_language_code, true)

            TELEMETRY.startWorkflow(sourceLang, targetLang, this.props.workflowStatus.input.jobName, this.props.workflowStatus.jobID)

            this.setState({ showProcessModal: true, showLoader: false });

            this.fetchDocumentDigitizeProcess([this.props.workflowStatus.jobID]);

            this.bulkCallInterval = setInterval(() => {
                this.fetchDocumentDigitizeProcess([this.props.workflowStatus.jobID]);
                if (this.state.documentState.status === "INPROGRESS") {
                    this.fetchDocumentDigitizeProcess([this.props.workflowStatus.jobID]);
                } else {
                    return
                  }
            }, 20000);
        }
    }

    fetchDocumentDigitizeProcess(jobIds) {
        let apiObj = new FetchDigitizedDocument(
            0,
            0,
            jobIds,
            false,
            false,
            false
        );

        Axios.post(apiObj?.endpoint, apiObj?.getBody(), { headers: apiObj?.getHeaders().headers })
            .then(res => {
                // console.log("res -------- ", res);
                this.setState({ documentState: res?.data?.jobs[0] })
            }).catch(err => {
                console.log("err -------- ", err);
            })
    }

    onCopyClick() {
        this.setState({
            message:
                "Job id Copied to clipboard.",
            open: true,
            variant: "info",
        });
    }

    onUploadOtherDoc() {
        this.handleDelete();
        this.setState({ showProcessModal: false, documentState: "", source_language_code: "", target_language_code: "", workspaceName: "" });
    }



    processSourceLanguageSelected = (event) => {
        this.setState({ source_language_code: event.target.value })
    }

    processVersionSelected = (event) => {
        this.setState({ workflow: event.target.value })
    }

    renderDropZone = () => {
        const { classes } = this.props
        return <MuiThemeProvider theme={theme}>
            <DropzoneArea className={classes.DropZoneArea}
                key={this.state.key}
                dropZoneClass={classes.dropZoneArea}
                acceptedFiles={[".txt,audio/*,.ods,.pptx,image/*,.psd,.pdf,.xlsm,.xltx,.xltm,.xla,.xltm,.docx,.rtf", ".txt", ".pdf", ".doc", ".ppt", ".excel", ".xlsx", ".xls", ".log", ".xlsb"]}
                onChange={this.handleChange.bind(this)}
                filesLimit={1}
                clearOnUnmount={this.state.cleared}
                maxFileSize={200000000}
                dropzoneText={"Please Add / Drop document here"}
                onDelete={this.handleDelete.bind(this)}
            />
        </MuiThemeProvider>
    }

    handleDelete = () => {
        this.setState({
            files: [],
            fileName: "",
            path: "",
        });
    };

    handleChange = files => {
        if (files.length > 0) {
            let path = files[0].name.split('.');
            let fileType = path[path.length - 1];
            let fileName = path.splice(0, path.length - 1).join('.')
            this.setState({
                files,
                fileName: files[0].name,
                workspaceName: this.state.workspaceName ? this.state.workspaceName : fileName,
                path: fileType
            });
        } else {
            this.setState({
                files: {
                    workspaceName: ""
                }
            });
        }
    };

    renderSourceLanguagesItems = () => {
        const { classes } = this.props
        return (<Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "1.5%" }}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Typography
                    style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        fontFamily: "Roboto",
                        marginBottom: 2
                    }}
                >
                    {translate("common.page.label.sourceLang")}{" "}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} >
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="source-lang"
                    onChange={this.processSourceLanguageSelected}
                    value={this.state.source_language_code}
                    fullWidth
                    className={classes.Select}
                    style={{
                        fullWidth: true,
                        float: 'right',
                        marginBottom: "15px"
                    }}
                    input={
                        <OutlinedInput name="source" id="source" />
                    }
                >
                    {
                        this.state.source_languages.map(lang =>
                            <MenuItem
                                id={lang.language_name}
                                key={lang.language_code}
                                style={{ fontSize: "16px", fontFamily: "Roboto" }}
                                value={lang.language_code + ''}
                            >{lang.language_name}</MenuItem>)
                    }
                </Select>
            </Grid>
        </Grid>
        )
    }


    renderVersion = () => {
        const { classes } = this.props
        return (<Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "1.5%" }}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Typography
                    style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        fontFamily: "Roboto",
                        marginBottom: 2
                    }}
                >
                    {translate("Version")}{" "}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} >
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="source-lang"
                    onChange={this.processVersionSelected}
                    value={this.state.workflow}
                    fullWidth
                    className={classes.Select}
                    style={{
                        fullWidth: true,
                        float: 'right',
                        marginBottom: "15px"
                    }}
                    input={
                        <OutlinedInput name="source" id="source" />
                    }
                >
                    {
                        this.state.worflow_codes.map((code, index) =>
                            <MenuItem
                                id={code.code}
                                key={code.code}
                                style={{ fontSize: "16px", fontFamily: "Roboto" }}
                                value={code.code + ''}>{code.version}</MenuItem>)
                    }
                </Select>
            </Grid>
        </Grid>
        )
    }

    renderTextField = () => {
        return <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Typography
                    style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        fontFamily: "Roboto",
                        marginBottom: 2
                    }}
                >
                    {translate("common.page.label.filename")}
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <TextField
                    value={this.state.workspaceName}
                    id="outlined-name"
                    margin="normal"
                    onChange={event => {
                        this.handleTextChange("workspaceName", event);
                    }}
                    variant="outlined"
                    style={{ width: "100%", margin: '0%', marginBottom: "25px" }}
                />
            </Grid>
        </Grid>
    }

    handleTextChange(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    processBackButton = () => {
        history.push(`${process.env.PUBLIC_URL}/document-digitization`);
    }

    handleSubmit(e) {
        let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, "hi")
        e.preventDefault();
        if (this.state.files.length > 0 && this.state.source_language_code && this.state.workflow) {
            this.setState({ model: modelId, showLoader: true })
            const { APITransport } = this.props;
            const apiObj = new DocumentUpload(
                this.state.files, "docUplaod",
                modelId,
            );
            APITransport(apiObj);
        } else {
            alert("Field should not be empty!");
        }

    }

    render() {
        const { classes } = this.props
        return (
            <div style={{}}>
                <Header />

                <div className={classes.div} style={{ paddingTop: "2%", fontSize: "19px", fontWeight: "500" }}>
                    <Typography className={classes.typographyHeader}>
                        Digitize Document
                    </Typography>
                    <br />
                    <Typography variant="subtitle1" style={{ fontSize: "1rem" }} className={classes.typographySubHeader}>{translate("doc_upload.page.label.uploadMessage")}</Typography>
                    <br />
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                <MuiThemeProvider theme={theme}>
                                    <DropzoneArea className={classes.DropZoneArea}
                                        showPreviewsInDropzone={
                                            this.state.files.length ? true : false
                                        }
                                        dropZoneClass={classes.dropZoneArea}
                                        acceptedFiles={[".txt,audio/*,.ods,.pptx,image/*,.psd,.pdf,.xlsm,.xltx,.xltm,.xla,.xltm,.docx,.rtf", ".txt", ".pdf", ".doc", ".ppt", ".excel", ".xlsx", ".xls", ".log", ".xlsb"]}
                                        onChange={this.handleChange.bind(this)}
                                        filesLimit={1}
                                        maxFileSize={104857600}
                                        dropzoneText={translate("digitize_upload.page.label.addDropDocument")}
                                        onDelete={this.handleDelete.bind(this)}
                                    />
                                </MuiThemeProvider>
                            </Grid>
                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                {this.renderSourceLanguagesItems()}
                                {localStorage.getItem("roles") === 'ANNOTATOR' && this.renderVersion()}
                                {this.renderTextField()}
                            </Grid>
                            {/* <Grid item xs={12} sm={6} lg={6} xl={6} style={{ paddingTop: "25px" }}>
                                <Button
                                    id="back"
                                    variant="contained" color="primary"
                                    size="large" onClick={this.processBackButton}
                                    style={{
                                        width: "100%",
                                        backgroundColor: '#2C2799',
                                        borderRadius: "20px 20px 20px 20px",
                                        color: "#FFFFFF",
                                        height: '46px'
                                    }}
                                >
                                    {translate("common.page.button.back")}
                                </Button>
                            </Grid> */}
                            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ paddingTop: "25px" }}>
                                <Grid item xs={12} sm={12} lg={12} xl={12}>
                                    <Button
                                        id="upload"
                                        variant="contained" color="primary"
                                        // className={classes.button1} 
                                        style={{
                                            width: "100%",
                                            backgroundColor: '#2C2799',
                                            borderRadius: "20px 20px 20px 20px",
                                            color: "#FFFFFF",
                                            height: '46px'
                                        }}
                                        size="large" onClick={this.handleSubmit.bind(this)}>
                                        {translate("common.page.button.upload")}
                                    </Button>
                                </Grid>

                            </Grid>
                        </Grid>
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
                        {this.state.showLoader &&
                            <Spinner />
                        }
                    </Paper>
                </div>
                {this.state.documentState && this.state.showProcessModal &&
                    <UploadProcessModal
                        progressData={this.state.documentState}
                        onCopyClick={() => this.onCopyClick()}
                        onUploadOtherDoc={() => this.onUploadOtherDoc()}
                        goToDashboardLink={`${process.env.PUBLIC_URL}/document-digitization`}
                    />
                }
            </div >
        );
    }
}


const mapStateToProps = state => ({
    fetch_models: state.fetch_models,
    workflowStatus: state.workflowStatus,
    documentUplaod: state.documentUplaod,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            createJobEntry,
            APITransport,
            CreateCorpus: APITransport
        },
        dispatch
    );

export default withStyles(FileUploadStyles)(connect(mapStateToProps, mapDispatchToProps)(StartDigitizationUpload));