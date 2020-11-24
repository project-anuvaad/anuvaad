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
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import MenuItem from "@material-ui/core/MenuItem";
import FetchModel from "../../../../flux/actions/apis/fetchmodel";
import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";
import FileUploadStyles from "../../../styles/web/FileUpload";
import WorkFlow from "../../../../flux/actions/apis/fileupload";
import DocumentUpload from "../../../../flux/actions/apis/document_upload";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { createJobEntry } from '../../../../flux/actions/users/async_job_management';
import Toolbar from "./FileUploadHeader"

const TELEMETRY     = require('../../../../utils/TelemetryManager')
const LANG_MODEL    = require('../../../../utils/language.model')

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
      fileName :"",
      workspaceName:"",
      path:"",
      source_language_code: '',
      target_language_code: '',
      source_languages: [],
      target_languages: [],
    };
  }



  handleSubmit(e) {
    let model = "";
    let target_lang_name = ''
    let source_lang_name = ''
    if (this.props.fetch_models.models) {
      this.props.fetch_models.models.map(item =>
        item.target_language_code === this.state.target &&
          item.source_language_code === this.state.source &&
          item.is_primary
          ? (model = item)
          : ""
      );
      this.props.fetch_languages.languages.map((lang) => {
        if (lang.language_code === this.state.target) {
          target_lang_name = lang.language_name
        } if (lang.language_code === this.state.source) {
          source_lang_name = lang.language_name
        }
        return true
      })
      e.preventDefault();
      this.setState({ model })
      if (this.state.files.length > 0 && source_lang_name && target_lang_name) {
        const { APITransport } = this.props;

        const apiObj = new DocumentUpload(
          this.state.files, "docUplaod",
          model,

        );
        APITransport(apiObj);
      } else {
        alert("Field should not be empty!");
      }
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

  getSnapshotBeforeUpdate(prevProps, prevState) {
    TELEMETRY.pageLoadStarted('document-upload')

    /**
    * getSnapshotBeforeUpdate() must return null
    */
    return null;
  }

  componentDidMount() {
    TELEMETRY.pageLoadCompleted('document-upload')

    if (this.props.fetch_models && this.props.fetch_models.models.length < 1) {
      const { APITransport }  = this.props;
      const apiModel          = new FetchModel();
      APITransport(apiModel);
      this.setState({ showLoader: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetch_models.models != this.props.fetch_models.models) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models),
        target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models)
      })
    }

    if (prevProps.workflowStatus !== this.props.workflowStatus) {
      this.props.createJobEntry(this.props.workflowStatus)

      TELEMETRY.startWorkflow(this.state.source, this.state.target, this.props.workflowStatus.input.jobName, this.props.workflowStatus.jobID)
      history.push(`${process.env.PUBLIC_URL}/view-document`);
    }
  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value})
    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value)
    this.setState({
      target_languages: languages
    })
  }

  processTargetLanguageSelected = (event) => {
    this.setState({ target_language_code: event.target.value})
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
      files: []
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

  /**
   * render methods
   */
  renderSourceLanguagesItems = () => {
    const { classes } = this.props;

    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid} style={{ marginTop: "0%" }}>
          <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.grid}>
            <Typography value="" variant="h5">
              {translate("common.page.label.sourceLang")}{" "}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={6} lg={4} xl={4} >
              <Select
                labelId="demo-simple-select-outlined-label"
                id="outlined-age-simple"
                onChange={this.processSourceLanguageSelected}
                value={this.state.source_language_code}
                style={{
                  fullWidth: true,
                  float: 'right'
                }}
              >
              {
                this.state.source_languages.map(lang => 
                <MenuItem key={lang.language_code} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
              }
              </Select>
          </Grid>
      </Grid>
    )
  }

  renderTargetLanguagesItems = () => {
    const { classes } = this.props;

    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={classes.grid}>
          <Typography value="" variant="h5">
            {translate("common.page.label.targetLang")}&nbsp;
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} lg={4} xl={4}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="outlined-age-simple"
              value={this.state.target}
              onChange={this.processTargetLanguageSelected}
              value={this.state.target_language_code}
              style={{
                fullWidth: true,
                float: 'right'
              }}
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

  render() {
    const { classes } = this.props;
    return (
      <div style={{height: window.innerHeight }}>
        <Toolbar />

        <div className={classes.div}>
          <Typography value="" variant="h4" className={classes.typographyHeader}>
            {translate("common.page.label.uploadFile")}
          </Typography>
          <br />
          <Typography className={classes.typographySubHeader}>{translate("pdf_upload.page.label.uploadMessage")}</Typography>
          <br />
          <Paper elevation={3} className={classes.paper}>
            <Grid container spacing={8}>
              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <MuiThemeProvider theme={theme}>
                  <DropzoneArea
                    className={classes.DropZoneArea}
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
                <br /><br />
                {this.renderTargetLanguagesItems()}
                <br /><br />
                <Grid container className={classes.grid}>
                  <Typography gutterBottom variant="h5" className={classes.typography}>
                    {translate("common.page.label.filename")}
                  </Typography>
                  <TextField
                    className={classes.textfield}
                    value={this.state.workspaceName}
                    id="outlined-name"
                    margin="normal"
                    onChange={event => {
                      this.handleTextChange("workspaceName", event);
                    }}
                    variant="outlined"

                  />
                </Grid>

              </Grid>
              <Grid container spacing={8}>

                <Grid item xs={12} sm={6} lg={6} xl={6} >
                  <Button variant="contained" color="primary" className={classes.button1} size="large" onClick={this.handleBack.bind(this)}>
                    {translate("common.page.button.back")}
                  </Button>
                </Grid>
                <Grid item xs={6} sm={6} lg={6} xl={6}>

                  <Button variant="contained" color="primary" className={classes.button2} size="large" onClick={this.handleSubmit.bind(this)}>
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
