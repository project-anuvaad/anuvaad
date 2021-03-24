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


const theme = createMuiTheme({
    overrides: {
        MuiDropzoneArea: {
            root: {
                paddingTop: '15%',
                top: "auto",
                width: '100%',
                minHeight: '380px',
                height: "85%",
                borderColor: '#1C9AB7',
                backgroundColor: '#F5F9FA',
                border: '1px dashed #1C9AB7',
                fontColor: '#1C9AB7',
                marginTop: "3%",
                marginLeft: '1%',
                "& svg": { color: '#1C9AB7', },
                "& p": {
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    fontSize: "19px",
                    color: '#1C9AB7',

                }
            },

        }
    }
});
const LANG_MODEL = require('../../../../../utils/language.model')


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
            path: "",
            source_language_code: "",
            target_language_code: "",
            source_languages: [],
            target_languages: [],
            array_of_users: []
        }
    }


    componentDidMount() {

        const { APITransport } = this.props;
        const apiModel = new FetchModel();
        APITransport(apiModel);
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
            this.setState({
                files,
                fileName: files[0].name,
                path: fileType
            });
        }
    };

    handleDelete = () => {
        this.setState({
            files: []
        });
    };

    handleSubmit(e) {
        let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, "hi")
        e.preventDefault();
        this.setState({ model: modelId, showLoader: true })
        if (this.state.files.length > 0 && this.state.source_language_code) {
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
                        this.state.target_languages.map(lang =>
                            <MenuItem key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
                    }
                </Select>
            </Grid>
        </Grid>
        )
    }

    addUser = (value) => {
        this.setState({ array_of_users: value })
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
                                        acceptedFiles={[".txt,audio/*,.ods,.pptx,image/*,.psd,.pdf,.xlsm,.xltx,.xltm,.xla,.xltm,.docx,.rtf", ".txt", ".pdf", ".doc", ".ppt", ".excel", ".xlsx", ".xls", ".log", ".xlsb"]}
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
                                            value={this.state.workspaceName}
                                            id="outlined-name"
                                            margin="normal"
                                            onChange={event => {
                                                this.handleTextChange("workspaceName", event);
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
                                        options={this.props.userinfo.data}
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
                                    onClick={() => history.push(`${process.env.PUBLIC_URL}/user-details`)
                                    }
                                    style={{
                                        width: "100%",
                                        backgroundColor: '#1C9AB7',
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
                                        // className={classes.button1} 
                                        style={{
                                            width: "100%",
                                            backgroundColor: '#1C9AB7',
                                            borderRadius: "20px 20px 20px 20px",
                                            color: "#FFFFFF",
                                            height: '46px'
                                        }}
                                        size="large"
                                    // onClick={this.handleSubmit.bind(this)}
                                    >
                                        {translate("common.page.button.upload")}
                                    </Button>
                                </Grid>

                            </Grid>

                        </Grid>


                        {this.state.open && (
                            <Snackbar
                                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                                open={this.state.open}
                                autoHideDuration={6000}
                                onClose={this.handleClose}
                                variant="success"
                                message={this.state.message}
                            />
                        )}
                    </Paper>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login,
    fetch_models: state.fetch_models,
    userinfo: state.userinfo,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            APITransport
        },
        dispatch
    );
export default withRouter(
    withStyles(FileUploadStyles)(
        connect(mapStateToProps, mapDispatchToProps)(ScheduleJob)
    )
);