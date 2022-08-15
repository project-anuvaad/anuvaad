import React from 'react';
import Toolbar from './ScheduleJobHeader';
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import FileUploadStyles from "../../../../styles/web/FileUpload";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import APITransport from "../../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../../assets/localisation";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import Snackbar from "../../../../components/web/common/Snackbar";
import TextField from "@material-ui/core/TextField";
import { DropzoneArea } from "material-ui-dropzone";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import DocumentUpload from "../../../../../flux/actions/apis/document_upload/document_upload";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FetchModel from "../../../../../flux/actions/apis/common/fetchmodel";
import Autocomplete from '@material-ui/lab/Autocomplete';
import history from "../../../../../web.history";
import WorkFlow from "../../../../../flux/actions/apis/common/fileupload";
import Spinner from '../../../../components/web/common/Spinner';
import { createJobEntry } from '../../../../../flux/actions/users/async_job_management';
import FetchUserDetails from "../../../../../flux/actions/apis/user/userdetails";


const theme = createMuiTheme({
    overrides: {
        MuiDropzoneArea: {
            root: {
                paddingTop: '15%',
                top: "auto",
                width: '100%',
                minHeight: '380px',
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


class ScheduleJob extends React.Component {

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
            showComponent: false,
            fileName: "",
            workspaceName: "",
            workflow: "WF_A_AN",
            path: "",
            source_language_code: "",
            target_language_code: "",
            source_languages: [],
            target_languages: [],
            description: '',
            array_of_users: [],
            variant: 'success'
        }
    }

    processFetchBulkUserDetailAPI = (offset, limit, updateExisiting = false, updateUserDetail = false, userIDs = [], userNames = [], roleCodes = []) => {
        const token = localStorage.getItem("token");
        const userObj = new FetchUserDetails(offset, limit, token, updateExisiting, updateUserDetail, userIDs, userNames, roleCodes)
        this.props.APITransport(userObj)
    }

    componentDidMount() {
        const { APITransport } = this.props;
        const apiModel = new FetchModel();
        APITransport(apiModel);
        this.processFetchBulkUserDetailAPI(this.state.offset, this.state.limit)
        this.setState({ showLoader: true });

    }

    componentDidUpdate(prevProps) {
        if (prevProps.fetch_models.models != this.props.fetch_models.models) {
            this.setState({
                source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
                target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
                showLoader: false
            })
        }
        if (prevProps.workflowStatus !== this.props.workflowStatus) {
            this.props.createJobEntry(this.props.workflowStatus)
            history.push(`${process.env.PUBLIC_URL}/view-scheduled-jobs`);
        }
    }

    handleSubmit(e) {
        let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, this.state.target_language_code)
        e.preventDefault();
        this.setState({ model: modelId, showLoader: true })
        if (this.state.files.length > 0 && this.state.source_language_code && this.state.target_language_code && this.state.description) {
            const apiObj = new DocumentUpload(
                this.state.files, "docUplaod",
                modelId,
            );
            fetch(apiObj.apiEndPoint(), {
                method: 'post',
                headers: { 'auth-token': `${decodeURI(localStorage.getItem("token"))}` },
                body: apiObj.getFormData()
            })
                .then(async res => {
                    if (!res.ok) {
                        await res.json().then(obj => {
                            this.setState({ showLoader: false, variant: 'error', message: obj.why, open: true })
                        })
                    } else {
                        let identifier
                        const { APITransport } = this.props;
                        await res.json().then(obj => {
                            identifier = obj.data
                        })
                        const apiObj = new WorkFlow(this.state.workflow, identifier, this.state.fileName, this.state.source_language_code,
                            this.state.target_language_code, this.state.path, this.state.model, "", "", this.state.description, this.state.array_of_users);
                        APITransport(apiObj);
                    }
                })
        } else {
            this.setState({ showLoader: false })
            alert("Field should not be empty!");
        }
        setTimeout(() => {
            this.setState({ variant: 'success', message: "", open: false }, () => {
            }, 6000)
        })
    }

    renderSourceLanguagesItems = () => {
        const { classes } = this.props
        return (<Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "1.5%" }}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Typography value="" variant="h5">
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
                            <MenuItem id={lang.language_name} key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
                    }
                </Select>
            </Grid>
        </Grid>
        )
    }

    handleChange = files => {

        if (files.length > 0) {
            let path = files[0].name.split('.')
            let fileType = path[path.length - 1]
            let fileName = path.splice(0, path.length - 1).join('.')
            this.setState({
                files,
                fileName: files[0].name,
                workspaceName: this.state.workspaceName ? this.state.workspaceName : fileName,
                path: fileType,
            });
        } else {
            this.setState({
                files: {
                    workspaceName: ""
                }
            });
        }
    };

    handleDelete = () => {
        this.setState({
            files: []
        });
    };


    processTargetLanguageSelected = (event) => {
        this.setState({ target_language_code: event.target.value })
    }

    processSourceLanguageSelected = (event) => {
        this.setState({ source_language_code: event.target.value })
    }
    handleTextChange = (propertyName, event) => {
        this.setState({ [propertyName]: event.target.value })
    }
    renderTargetLanguagesItems = () => {
        const { classes } = this.props
        return (<Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "1.5%" }}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Typography value="" variant="h5">
                    {translate("common.page.label.targetLang")}{" "}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12} >
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="source-lang"
                    onChange={this.processTargetLanguageSelected}
                    value={this.state.target_language_code}
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
                        this.state.target_languages.map(lang =>
                            <MenuItem key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
                    }
                </Select>
            </Grid>
        </Grid>
        )
    }

    addUser = (values) => {
        let array_of_users = values.map(value => {
            return {
                userId: value.userID,
                name: value.userName
            }
        })
        this.setState({ array_of_users })
    }
    render() {
        const { classes } = this.props
        return (
            <div style={{ height: window.innerHeight, overflow: 'auto' }}>
                <Toolbar />

                <div className={classes.div}>
                    <Typography value="" variant="h4" className={classes.typographyHeader}>
                        Schedule Job
                    </Typography>
                    <br />
                    <Typography className={classes.typographySubHeader}>{"Upload file that you want to annotate."}</Typography>
                    <br />
                    <Paper elevation={3} className={classes.paper}>
                        <Grid container spacing={8}>

                            <Grid item xs={12} sm={6} lg={6} xl={6}>
                                <MuiThemeProvider theme={theme}>
                                    <DropzoneArea className={classes.DropZoneArea}
                                        showPreviewsInDropzone
                                        dropZoneClass={classes.dropZoneArea}
                                        acceptedFiles={[".csv", ".xlsx"]}
                                        onChange={this.handleChange.bind(this)}
                                        filesLimit={1}
                                        maxFileSize={200000000000}
                                        dropzoneText={"Please Add/Drop csv/xlsx Document here"}
                                        onDelete={this.handleDelete.bind(this)}
                                    />
                                </MuiThemeProvider>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={6} xl={6}>

                                {this.renderSourceLanguagesItems()}

                                {this.renderTargetLanguagesItems()}

                                <Grid item xs={12} sm={12} lg={12} xl={12}>
                                    <Grid item xs={12} sm={12} lg={12} xl={12}>
                                        <Typography variant="h5">
                                            Enter Job Description
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} lg={12} xl={12}>
                                        <TextField
                                            value={this.state.description}
                                            id="outlined-name"
                                            margin="normal"
                                            onChange={event => {
                                                this.handleTextChange("description", event);
                                            }}
                                            variant="outlined"
                                            style={{ width: "100%", margin: "0px" }}
                                        />
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: '1.5%' }}>
                                    <Grid item xs={12} sm={12} lg={12} xl={12}>
                                        <Typography variant="h5">
                                            Search Users
                                        </Typography>
                                    </Grid>
                                    <Autocomplete
                                        multiple
                                        id="tags-outlined"
                                        options={this.props.userinfo.data.filter(user => user.roles === 'ANNOTATOR' && user.orgId !== 'NONMT')}
                                        getOptionLabel={(option) => option.userName}
                                        filterSelectedOptions
                                        onChange={(e, value) => this.addUser(value)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sm={6} lg={6} xl={6} style={{ paddingTop: "25px" }}>
                                <Button
                                    id="back"
                                    variant="contained" color="primary"
                                    size="large"
                                    onClick={() => history.push(`${process.env.PUBLIC_URL}/view-scheduled-jobs`)
                                    }
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
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} xl={6} style={{ paddingTop: "25px" }}>
                                <Grid item xs={12} sm={12} lg={12} xl={12}>
                                    <Button
                                        id="upload"
                                        variant="contained" color="primary"
                                        style={{
                                            width: "100%",
                                            backgroundColor: '#2C2799',
                                            borderRadius: "20px 20px 20px 20px",
                                            color: "#FFFFFF",
                                            height: '46px'
                                        }}
                                        size="large"
                                        onClick={this.handleSubmit.bind(this)}
                                    >
                                        {translate("common.page.button.upload")}
                                    </Button>
                                </Grid>

                            </Grid>

                        </Grid>


                        {this.state.open && (
                            <Snackbar
                                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                                open={this.state.open}
                                autoHideDuration={6000}
                                onClose={this.handleClose}
                                variant={this.state.variant}
                                message={this.state.message}
                            />
                        )}
                        {
                            this.state.showLoader &&
                            <Spinner />
                        }
                    </Paper>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userinfo: state.userinfo,
    fileUpload: state.fileUpload,
    workflowStatus: state.workflowStatus,
    documentUplaod: state.documentUplaod,
    fetch_models: state.fetch_models
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            createJobEntry,
            APITransport
        },
        dispatch
    );
export default withRouter(
    withStyles(FileUploadStyles)(
        connect(mapStateToProps, mapDispatchToProps)(ScheduleJob)
    )
);