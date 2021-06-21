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
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import OutlinedInput from "@material-ui/core/OutlinedInput";

import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";
import FileUploadStyles from "../../../styles/web/FileUpload";
import Toolbar from "./FileUploadHeader"

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchModel from "../../../../flux/actions/apis/common/fetchmodel";
import WorkFlow from "../../../../flux/actions/apis/common/fileupload";
import DocumentUpload from "../../../../flux/actions/apis/document_upload/document_upload";
import { createJobEntry } from '../../../../flux/actions/users/async_job_management';

const TELEMETRY = require('../../../../utils/TelemetryManager')
const LANG_MODEL = require('../../../../utils/language.model')

const theme = createMuiTheme({
  overrides: {
    MuiDropzoneArea: {
      root: {
        paddingTop: '15%',
        top: "auto",
        width: '98%',
        minHeight: '320px',
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

class PdfUpload extends Component {
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
      workflow: "WF_A_FCBMTKTR",
      fileName: "",
      workspaceName: "",
      path: "",
      source_language_code: '',
      target_language_code: '',
      source_languages: [],
      target_languages: [],
      jobDescription: ''
    };
  }



  handleSubmit(e) {

    let userModel = JSON.parse(localStorage.getItem("userProfile"))
    let modelId = LANG_MODEL.get_model_details(this.props.fetch_models.models, this.state.source_language_code, this.state.target_language_code, userModel.models)
    e.preventDefault();
    this.setState({ model: modelId })
    if (this.state.files.length > 0 && this.state.source_language_code && this.state.target_language_code) {
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
  // Source language
  handleSource(modelLanguage, supportLanguage) {
    const result = [];
    if (modelLanguage && Array.isArray(modelLanguage) && modelLanguage.length > 0 && supportLanguage && supportLanguage.length > 0) {
      modelLanguage.map(
        item =>
          item.interactive_end_point && supportLanguage.map(value => (item.source_language_code === value.language_code ? result.push(value) : null))
      );
    }
    const value = new Set(result);
    const source_language = [...value];
    return source_language;
  }

  // Target language
  handleTarget(modelLanguage, supportLanguage, sourceLanguage) {
    const result = [];
    if (modelLanguage && Array.isArray(modelLanguage) && modelLanguage.length > 0) {
      modelLanguage.map(item => {
        item.source_language_code === sourceLanguage &&
          item.interactive_end_point &&
          supportLanguage.map(value => (item.target_language_code === value.language_code ? result.push(value) : null));
        return true;
      });
    }
    const value = new Set(result);
    const target_language = [...value];

    return target_language;
  }
  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleBack = () => {
    history.push(`${process.env.PUBLIC_URL}/view-document`)
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   TELEMETRY.pageLoadStarted('document-upload')

  //   /**
  //   * getSnapshotBeforeUpdate() must return null
  //   */
  //   return null;
  // }

  componentDidMount() {
    TELEMETRY.pageLoadStarted('document-upload')

    const { APITransport } = this.props;
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({ showLoader: true, uploadType: this.props.match.params.type === "translate" ? true : false });

  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetch_models.models !== this.props.fetch_models.models) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, this.state.uploadType,),
        target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, this.state.uploadType)
      })

    }

    if (prevProps.documentUplaod !== this.props.documentUplaod) {
      const { APITransport } = this.props;
      let path = this.state.files[0].name.split('.')
      let fileType = path[path.length - 1]
      const digitalDoc = (fileType === 'docx' || fileType === 'pptx') ? true : false
      const apiObj = new WorkFlow(!digitalDoc ? this.state.workflow : "WF_A_FTTKTR", this.props.documentUplaod.data, this.state.fileName, this.state.source_language_code,
        this.state.target_language_code, this.state.path, this.state.model, "", "", this.state.workspaceName);
      APITransport(apiObj);
    }

    if (prevProps.workflowStatus !== this.props.workflowStatus) {
      this.props.createJobEntry(this.props.workflowStatus)

      var sourceLang = LANG_MODEL.get_language_name(this.props.fetch_models.models, this.state.source_language_code, this.state.uploadType)
      var targetLang = LANG_MODEL.get_language_name(this.props.fetch_models.models, this.state.target_language_code, this.state.uploadType)

      TELEMETRY.startWorkflow(sourceLang, targetLang, this.props.workflowStatus.input.jobName, this.props.workflowStatus.jobID)
      history.push(`${process.env.PUBLIC_URL}/view-document`);
    }
  }

  componentWillUnmount() {
    TELEMETRY.pageLoadCompleted('document-upload')
  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value })
    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value, this.state.uploadType)
    this.setState({
      target_languages: languages
    })
  }

  processTargetLanguageSelected = (event) => {
    this.setState({ target_language_code: event.target.value })
  }

  readFileDataAsBinary(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = event => {
        resolve(event.target.result);
      };

      reader.onerror = err => {
        reject(err);
      };

      reader.readAsBinaryString(file);
    });
  }

  handleDelete = () => {
    this.setState({
      files: [], workspaceName: ''
    });
  };
  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleChange = files => {

    if (files.length > 0) {
      let path = files[0].name.split('.')
      let fileType = path[path.length - 1]
      let fileName = path.splice(0, path.length - 1).join('.')
      this.setState({
        files,
        fileName: files[0].name,
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

  /**
   * render methods
   */
  renderSourceLanguagesItems = () => {
    const { classes } = this.props;
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: "3%" }}>
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
              marginBottom: "27px"
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

  renderTargetLanguagesItems = () => {
    const { classes } = this.props;

    return (
      <Grid item xs={12} sm={12} lg={12} xl={12}>
        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <Typography value="" variant="h5">
            {translate("common.page.label.targetLang")}&nbsp;
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="target-lang"
            value={this.state.target}
            onChange={this.processTargetLanguageSelected}
            value={this.state.target_language_code}
            fullWidth
            style={{
              width: "100%",
              float: 'right',
              marginBottom: "27px",
            }}
            input={
              <OutlinedInput name="target" id="target" />
            }
            className={classes.Select}

          >
            {
              this.state.target_languages.map(lang =>
                <MenuItem id={lang.language_name} key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
            }
          </Select>
        </Grid>
      </Grid>
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ height: window.innerHeight }}>
        <Toolbar />

        <div className={classes.div}>
          <Typography value="" variant="h4" className={classes.typographyHeader}>
            {this.state.uploadType ? "Document Translate" : "Data Collection"}
          </Typography>
          <br />
          <Typography className={classes.typographySubHeader}>{this.state.uploadType ? translate("pdf_upload.page.label.uploadMessage") : "Upload file that you want to collect data."}</Typography>
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
                    dropzoneText={translate("common.page.label.addDropDocument")}
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
                      Enter File Description
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <TextField
                      // className={classes.textfield}
                      value={this.state.workspaceName}
                      placeholder="Enter your own description here (optional)"
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

              </Grid>

              <Grid item xs={12} sm={6} lg={6} xl={6} style={{ paddingTop: "25px" }}>
                <Button
                  id="back"
                  variant="contained" color="primary"
                  size="large" onClick={this.handleBack.bind(this)}
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
                    size="large" onClick={this.handleSubmit.bind(this)}>
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
  fileUpload: state.fileUpload,
  configUplaod: state.configUplaod,
  workflowStatus: state.workflowStatus,
  documentUplaod: state.documentUplaod,
  fetch_models: state.fetch_models
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

export default withRouter(withStyles(FileUploadStyles)(connect(mapStateToProps, mapDispatchToProps)(PdfUpload)));
