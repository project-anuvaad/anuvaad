import React from 'react';
import Header from './UserGlossaryUploadHeader';
import { Typography } from '@material-ui/core';
import { translate } from "../../../../assets/localisation";
import DashboardStyles from "../../../styles/web/DashboardStyles";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FetchModel from "../../../../flux/actions/apis/common/fetchmodel";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import history from "../../../../web.history";
import { createJobEntry } from '../../../../flux/actions/users/async_job_management';
import Snackbar from "../../../components/web/common/Snackbar";
import Spinner from "@material-ui/core/CircularProgress"
import FormControl from '@material-ui/core/FormControl';
import CreateGlossary from '../../../../flux/actions/apis/document_translate/create_glossary';
import ViewGlossary from '../../../../flux/actions/apis/user_glossary/fetch_user_glossary';
import fetchTransliterationModelID from '../../../../flux/actions/apis/document_translate/fetchTransliterationModel';
import { IndicTransliterate } from 'react-transliterate';
import configs from '../../../../configs/configs';
import endpoints from '../../../../configs/apiendpoints';


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


const LANG_MODEL = require('../../../../utils/language.model')
const TELEMETRY = require('../../../../utils/TelemetryManager')

class UserGlossaryUpload extends React.Component {
    constructor() {
        super();
        this.state = {
            source: "",
            target: "",
            files: [],
            open: false,
            modelLanguage: [],
            name: "",
            message: "",
            variantType: "success",

            showComponent: false,
            workflow: localStorage.getItem("roles") === "TRANSLATOR" ? "WF_A_FCOD10GVOTK" : "",

            fileName: "",
            workspaceName: "",
            path: "",
            source_language_code: '',
            target_language_code: '',
            source_languages: [],
            target_languages: [],
            target: "",
            source: "",
            sourceTransliterationModelId: "",
            targetTransliterationModelId: ""
        }
    }

    componentDidMount() {
        TELEMETRY.pageLoadStarted('upload-user-glossary')
        const { APITransport } = this.props;
        const apiModel = new FetchModel();
        APITransport(apiModel);
        this.setState({ showLoader: true });

    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.fetch_models.models !== this.props.fetch_models.models) {
            this.setState({
                source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
                target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
                showLoader: false
            })
        }

        if(prevState.source_language_code !== this.state.source_language_code){
            this.getTransliterationModelIDByLang("en", this.state.source_language_code, (modelId)=>this.setState({sourceTransliterationModelId: modelId}));
        }
        if(prevState.target_language_code !== this.state.target_language_code){
            this.getTransliterationModelIDByLang("en", this.state.target_language_code, (modelId)=>this.setState({targetTransliterationModelId: modelId}));
        }
    }

    processSourceLanguageSelected = (event) => {
        this.setState({ source_language_code: event.target.value })
        const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value, true)
        this.setState({
            target_languages: languages
        })
    }

    processTargetLanguageSelected = (event) => {
        this.setState({ target_language_code: event.target.value })
    }

    getTransliterationModelIDByLang = (srcLangCode, targLangCode, callback) => {
        const apiObj = new fetchTransliterationModelID(srcLangCode, targLangCode);
        fetch(apiObj.apiEndPoint(), {
            method: "GET",
            headers: apiObj.getHeaders().headers
        })
        .then(async res=>{
            let response =  await res.json();
            response?.modelId && callback(response?.modelId);
        })
        .catch(err=>{
            callback("");
            console.log("err - ", err);
        })
    }


    renderSourceLanguagesItems = () => {
        return (
            <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ marginTop: "0%" }}>
                <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
                    <Typography value="" variant="h5">
                        {translate("common.page.label.sourceLang")}&nbsp;<span style={{ color: "red" }}>*</span>
                    </Typography>
                </Grid>

                <Grid item xs={6} sm={6} lg={4} xl={4} >
                    <FormControl variant="outlined" className={this.props.classes.select}>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            onChange={this.processSourceLanguageSelected}
                            value={this.state.source_language_code}
                            style={{
                                fullWidth: true,
                                float: 'right',
                                textAlign: "left"
                            }}
                        >
                            {
                                this.state.source_languages.map(lang =>
                                    <MenuItem key={lang.language_code} value={lang.language_code + ''} style={{color: lang.language_name.includes('Alpha') ? "rgba(0,0,0,0.5)" : '#000000'}}>{lang.language_name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
    }

    renderTargetLanguagesItems = () => {
        return (
            <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ paddingTop: "20px" }}>
                <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
                    <Typography value="" variant="h5">
                        {translate("common.page.label.targetLang")}&nbsp;<span style={{ color: "red" }}>*</span>
                    </Typography>
                </Grid>
                <Grid item xs={6} sm={6} lg={4} xl={4}>
                    <FormControl variant="outlined" className={this.props.classes.select}>
                        <Select
                            labelId="demo-simple-select-outlined-label"
                            id="demo-simple-select-outlined"
                            value={this.state.target}
                            onChange={this.processTargetLanguageSelected}
                            value={this.state.target_language_code}
                            style={{
                                fullWidth: true,
                                float: 'right',
                                textAlign: "left"
                            }}
                        >
                            {
                                this.state.target_languages.map(lang =>
                                    <MenuItem key={lang.language_code} value={lang.language_code + ''} style={{color: lang.language_name.includes('Alpha') ? "rgba(0,0,0,0.5)" : '#000000'}}>{lang.language_name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
    }

    renderSourceTextField = () => {
        return <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ paddingTop: "20px" }}>
            <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
                <Typography value="" variant="h5">
                    {"Enter Source Text"}&nbsp;<span style={{ color: "red" }}>*</span>
                </Typography>
            </Grid>
            <Grid item xs={6} sm={6} lg={4} xl={4}>
                <FormControl variant="outlined" className={this.props.classes.select}>
                    {this.state.sourceTransliterationModelId ? 
                    <IndicTransliterate
                    customApiURL={`${configs.BASE_URL_ULCA + endpoints.hostedInference}`}
                    transliterationModelId={this.state.sourceTransliterationModelId}
                    renderComponent={(props) => {
                        const inputRef = props.ref;
                        delete props["ref"];
                        return (
                            <TextField
                                {...props}
                                // label="Add to glossary"
                                // placeholder="Add to glossary"
                                fullWidth
                                variant="outlined"
                                inputRef={inputRef}
                                style={{ width: "100%", margin: '0%', marginBottom: "25px" }}
                            />
                        );
                    }}
                    value={this.state.source}
                    onChangeText={(value) => {
                        // this.setState({ word: text })
                        this.setState({source: value});
                    }}
                    lang={this.state.source_language_code}
                    maxOptions={5}
                /> 
                    : <TextField
                        value={this.state.source}
                        id="outlined-name"
                        margin="normal"
                        onChange={event => {
                            this.handleTextChange("source", event);
                        }}
                        variant="outlined"
                        style={{ width: "100%", margin: '0%', marginBottom: "25px" }}
                    />}
                </FormControl>
            </Grid>
        </Grid>
    }

    renderTargetTextField = () => {
        return <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ paddingTop: "20px" }}>
            <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
                <Typography value="" variant="h5">
                    {"Enter Target Text"}&nbsp;<span style={{ color: "red" }}>*</span>
                </Typography>
            </Grid>
            <Grid item xs={6} sm={6} lg={4} xl={4}>
                <FormControl variant="outlined" className={this.props.classes.select}>
                {this.state.targetTransliterationModelId ? 
                    <IndicTransliterate
                    customApiURL={`${configs.BASE_URL_ULCA + endpoints.hostedInference}`}
                    transliterationModelId={this.state.targetTransliterationModelId}
                    renderComponent={(props) => {
                        const inputRef = props.ref;
                        delete props["ref"];
                        return (
                            <TextField
                                {...props}
                                // label="Add to glossary"
                                // placeholder="Add to glossary"
                                fullWidth
                                variant="outlined"
                                inputRef={inputRef}
                                style={{ width: "100%", margin: '0%', marginBottom: "25px" }}
                            />
                        );
                    }}
                    value={this.state.target}
                    onChangeText={(value) => {
                        // this.setState({ word: text })
                        this.setState({target: value});
                    }}
                    lang={this.state.target_language_code}
                    maxOptions={5}
                /> 
                    :<TextField
                        value={this.state.target}
                        id="outlined-name"
                        margin="normal"
                        onChange={event => {
                            this.handleTextChange("target", event);
                        }}
                        variant="outlined"
                        style={{ width: "100%", margin: '0%', marginBottom: "25px" }}
                    />}
                </FormControl>
            </Grid>
        </Grid>
    }

    handleTextChange(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }


    handleSubmit = (e) => {
        let userModel = JSON.parse(localStorage.getItem("userProfile"))
        let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, this.state.target_language_code, userModel.models)
        e.preventDefault();
        if (this.state.source && this.state.target && this.state.source_language_code && this.state.target_language_code) {
            this.setState({ model: modelId, showLoader: true })
            let locale = `${modelId.source_language_code}|${modelId.target_language_code}`
            const { APITransport } = this.props;
            let apiObj = new CreateGlossary(userModel.userID, this.state.source, this.state.target, locale, 'JUDICIARY')
            fetch(apiObj.apiEndPoint(), {
                method: 'post',
                body: JSON.stringify(apiObj.getBody()),
                headers: apiObj.getHeaders().headers
            })
                .then(res => {
                    if (res.ok) {
                        this.setState({ open: true, variantType: 'success', message:"Glossary created successfully...", showLoader: false }, () => {
                            setTimeout(() => {
                                    const { APITransport } = this.props
                                    let userID = JSON.parse(localStorage.getItem("userProfile")).userID;
                                    let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
                                    let apiObj = new ViewGlossary(userID, orgID);
                                    APITransport(apiObj);
                                history.push(`${process.env.PUBLIC_URL}/my-glossary`);
                            }, 3000)
                        })
                    } else {
                        this.setState({ open: true, variantType: 'error',  message:"Error in creating glossary...", showLoader: false })
                    }
                })
        } else {
            alert("Field should not be empty!");
        }
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.root}>
                {/* <Header /> */}

                <Typography className={classes.typographyHeader}>
                    {"Create Glossary"}
                </Typography>
                <Paper className={classes.paper}>
                    <Grid container >

                        {this.renderSourceLanguagesItems()}
                        {this.renderTargetLanguagesItems()}
                        {this.renderSourceTextField()}
                        {this.renderTargetTextField()}

                        <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid} style={{ display: "flex", flexDirection: "row", marginTop: '5vh' }}>
                            <Grid item xs={6} sm={6} lg={6} xl={6}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    aria-label="edit"
                                    className={classes.button1}
                                    onClick={() => history.push(`${process.env.PUBLIC_URL}/my-glossary`)}
                                >
                                    {translate("common.page.button.back")}
                                </Button>
                            </Grid>
                            <Grid item xs={6} sm={6} lg={6} xl={6}>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    aria-label="edit"
                                    className={classes.button1}
                                    onClick={this.handleSubmit}
                                >
                                    {translate("common.page.button.submit")}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                {
                    this.state.open &&
                    <Snackbar
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        open={this.state.open}
                        autoHideDuration={3000}
                        onClose={this.handleClose}
                        variant={this.state.variantType}
                        message={this.state.message}
                    />
                }
                {
                    this.state.showLoader &&
                    <div className={classes.progressDiv}>
                        <Spinner size={80} className={classes.progress} />
                    </div>
                }
            </div>
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

export default withStyles(DashboardStyles)(connect(mapStateToProps, mapDispatchToProps)(UserGlossaryUpload));