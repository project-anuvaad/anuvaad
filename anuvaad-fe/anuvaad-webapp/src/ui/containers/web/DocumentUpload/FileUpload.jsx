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
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";

import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";
import FileUploadStyles from "../../../styles/web/FileUpload";
// import Toolbar from "./FileUploadHeader";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchModel from "../../../../flux/actions/apis/common/fetchmodel";
import WorkFlow from "../../../../flux/actions/apis/common/fileupload";
import DocumentUpload from "../../../../flux/actions/apis/document_upload/document_upload";
import { createJobEntry } from "../../../../flux/actions/users/async_job_management";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";
import Dialog from "@material-ui/core/Dialog";
import { Container } from "@material-ui/core";
import UploadProcessModal from "./UploadProcessModal";
import Axios from "axios";

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
      source_language_code: "",
      target_language_code: "",
      source_languages: [],
      target_languages: [],
      jobDescription: "",
      formatWarning: false,
      variant: "success",
      documentState: "",
      showProcessModal: false
    };
  }

  handleDialogClose = () => {
    this.setState({ formatWarning: false });
  };

  renderDialog = () => {
    const { classes } = this.props;
    const styles = {
      marginTop: "10%",
    };
    return (
      <Dialog
        maxWidth={"md"}
        onClose={this.handleDialogClose}
        aria-labelledby="simple-dialog-title"
        open={true}
      >
        <Container className={classes.warningDialog}>
          <Typography
            style={{ borderBottom: "1px solid #00000029" }}
            variant="h4"
          >
            Translation File Alert
          </Typography>
          <Typography style={styles} variant="h5">
            You are about to translate a file that is not in DOCX or PPTX
            format, you might face formatting issues when you export the
            translated file.
          </Typography>
          <Grid container spacing={2} style={styles}>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Button
                size="large"
                className={classes.btnStyle}
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  this.setState({ files: { workspaceName: "" } });
                  this.handleDialogClose();
                }}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Button
                size="large"
                className={classes.btnStyle}
                fullWidth
                color="primary"
                variant="contained"
                onClick={() => {
                  this.handleDialogClose();
                  this.makeDocumentUploadAPICall();
                }}
              >
                I understand, proceed
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    );
  };

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

  onCopyClick() {
    this.setState({
      message:
        "Job id Copied to clipboard.",
      open: true,
      variant: "info",
    });
  }

  onUploadOtherDoc(){
    this.handleDelete();
    this.setState({showProcessModal: false, documentState: "", source_language_code: "", target_language_code : "", workspaceName: ""});
  }

  handleSubmit(e) {
    if (
      this.state.files.length > 0 &&
      this.state.source_language_code &&
      this.state.target_language_code
    ) {
      let type = this.state.files[0].name.split(".").pop();
      if (type !== "docx" && type !== "pptx") {
        e.preventDefault();
        if (this.state.source_language_code !== "taaa") {
          this.setState({ formatWarning: true });
        } else {
          this.setState({
            message:
              "For Tamil only a docx file can be translated, please pass this pdf through 'Digitize Document' and then try translation.",
            open: true,
            variant: "error",
          });
        }
      } else {
        e.preventDefault();
        this.makeDocumentUploadAPICall();
      }
    } else {
      alert("Field should not be empty!");
    }
    setTimeout(() => {
      this.setState({ open: false, varaint: "success" });
    }, 3000);
  }
  // Source language
  handleSource(modelLanguage, supportLanguage) {
    const result = [];
    if (
      modelLanguage &&
      Array.isArray(modelLanguage) &&
      modelLanguage.length > 0 &&
      supportLanguage &&
      supportLanguage.length > 0
    ) {
      modelLanguage.map(
        (item) =>
          item.interactive_end_point &&
          supportLanguage.map((value) =>
            item.source_language_code === value.language_code
              ? result.push(value)
              : null
          )
      );
    }
    const value = new Set(result);
    const source_language = [...value];
    return source_language;
  }

  // Target language
  handleTarget(modelLanguage, supportLanguage, sourceLanguage) {
    const result = [];
    if (
      modelLanguage &&
      Array.isArray(modelLanguage) &&
      modelLanguage.length > 0
    ) {
      modelLanguage.map((item) => {
        item.source_language_code === sourceLanguage &&
          item.interactive_end_point &&
          supportLanguage.map((value) =>
            item.target_language_code === value.language_code
              ? result.push(value)
              : null
          );
        return true;
      });
    }
    const value = new Set(result);
    const target_language = [...value];

    return target_language;
  }
  handleSelectChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleBack = () => {
    history.push(`${process.env.PUBLIC_URL}/view-document`);
  };

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   TELEMETRY.pageLoadStarted('document-upload')

  //   /**
  //   * getSnapshotBeforeUpdate() must return null
  //   */
  //   return null;
  // }

  componentDidMount() {
    TELEMETRY.pageLoadStarted("document-upload");
    // console.log("this.props.match --- ", this.props.match);
    const { APITransport } = this.props;
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({
      showLoader: true,
      uploadType: this.props.match.path === "/document-upload" ? true : false,
    });
  }

  componentDidUpdate(prevProps) {

    if (prevProps.match.path !== this.props.match.path) {
      this.setState({ uploadType: this.props.match.path === "/document-upload" ? true : false, })
    }

    if (prevProps.fetch_models.models !== this.props.fetch_models.models) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(
          this.props.fetch_models.models,
          this.state.uploadType
        ),
        target_languages: LANG_MODEL.get_supported_languages(
          this.props.fetch_models.models,
          this.state.uploadType
        ),
      });
    }

    if (prevProps.documentUplaod !== this.props.documentUplaod) {
      const { APITransport } = this.props;
      let path = this.state.files[0].name.split(".");
      let fileType = path[path.length - 1];
      const digitalDoc =
        fileType === "docx" || fileType === "pptx" ? true : false;
      const apiObj = new WorkFlow(
        !digitalDoc ? this.state.workflow : "WF_A_FTTKTR",
        this.props.documentUplaod.data,
        this.state.fileName,
        this.state.source_language_code,
        this.state.target_language_code,
        this.state.path,
        this.state.model,
        "",
        "",
        this.state.workspaceName
      );
      APITransport(apiObj);
    }

    if (prevProps.workflowStatus !== this.props.workflowStatus) {
      this.props.createJobEntry(this.props.workflowStatus);

      var sourceLang = LANG_MODEL.get_language_name(
        this.props.fetch_models.models,
        this.state.source_language_code,
        this.state.uploadType
      );
      var targetLang = LANG_MODEL.get_language_name(
        this.props.fetch_models.models,
        this.state.target_language_code,
        this.state.uploadType
      );

      TELEMETRY.startWorkflow(
        sourceLang,
        targetLang,
        this.props.workflowStatus.input.jobName,
        this.props.workflowStatus.jobID
      );

      this.setState({showProcessModal: true});
      
      this.fetchDocumentTranslationProcess([this.props.workflowStatus.jobID]);

      setInterval(() => {
        if (this.state.documentState.status === "INPROGRESS") {
          this.fetchDocumentTranslationProcess([this.props.workflowStatus.jobID]);
        } else {
          return
        }
      }, 15000);
    }
  }

  componentWillUnmount() {
    TELEMETRY.pageLoadCompleted("document-upload");
  }

  fetchDocumentTranslationProcess(jobIds) {
    let apiObj = new FetchDocument(
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
        this.setState({ documentState: res?.data?.jobs[0]})
      }).catch(err => {
        // console.log("err -------- ", err);
      })
  }

  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value });
    const languages = LANG_MODEL.get_counterpart_languages(
      this.props.fetch_models.models,
      event.target.value,
      this.state.uploadType
    );
    this.setState({
      target_languages: languages,
    });
  };

  processTargetLanguageSelected = (event) => {
    this.setState({ target_language_code: event.target.value });
  };

  readFileDataAsBinary(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        resolve(event.target.result);
      };

      reader.onerror = (err) => {
        reject(err);
      };

      reader.readAsBinaryString(file);
    });
  }

  handleDelete = () => {
    this.setState({
      files: [],
      workspaceName: "",
    });
  };
  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value,
    });
  }

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
  renderSourceLanguagesItems = () => {
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
            {translate("common.page.label.sourceLang")}{" "}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="source-lang"
            onChange={this.processSourceLanguageSelected}
            value={this.state.source_language_code}
            fullWidth
            className={classes.Select}
            style={{
              fullWidth: true,
              float: "right",
              marginBottom: "27px",
            }}
            input={<OutlinedInput name="source" id="source" />}
          >
            {this.state.source_languages.map((lang) => (
              <MenuItem
                id={lang.language_name}
                key={lang.language_code}
                style={{ fontSize: "16px", fontFamily: "Roboto" }}
                value={lang.language_code + ""}
              >
                {lang.language_name}
              </MenuItem>
            ))}
          </Select>
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

        <Grid item xs={12} sm={12} lg={12} xl={12}>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="target-lang"
            // value={this.state.target}
            onChange={this.processTargetLanguageSelected}
            value={this.state.target_language_code}
            fullWidth
            style={{
              width: "100%",
              float: "right",
              marginBottom: "27px",
            }}
            input={<OutlinedInput name="target" id="target" />}
            className={classes.Select}
          >
            {this.state.target_languages.map((lang) => (
              <MenuItem
                id={lang.language_name}
                key={lang.language_code}
                style={{ fontSize: "16px", fontFamily: "Roboto" }}
                value={lang.language_code + ""}
              >
                {lang.language_name}
              </MenuItem>
            ))}
          </Select>
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
            {this.state.uploadType ? "Document Translate" : "Data Collection"}
          </Typography>
          <br />
          {this.state.uploadType ? (
            <Typography variant="subtitle1" style={{ fontSize: "1rem" }} className={classes.note}>
              {translate("pdf_upload.page.label.uploadMessage")}
            </Typography>
          ) : (
            <Typography variant="subtitle1" style={{ fontSize: "1rem" }} className={classes.typographySubHeader}>
              "Upload file that you want to collect data."
            </Typography>
          )}
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
                    dropzoneText={translate(
                      "common.page.label.addDropDocument"
                    )}
                    onDelete={this.handleDelete.bind(this)}
                  />
                </MuiThemeProvider>
              </Grid>

              <Grid item xs={12} sm={6} lg={6} xl={6}>
                {this.renderSourceLanguagesItems()}

                {this.renderTargetLanguagesItems()}

                <Grid item xs={12} sm={12} lg={12} xl={12}>
                  <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <Typography
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        fontFamily: "Roboto",
                        marginBottom: 2
                      }}
                    >Enter File Description</Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} lg={12} xl={12}>
                    <TextField
                      // className={classes.textfield}
                      value={this.state.workspaceName}
                      placeholder="Enter your own description here (optional)"
                      id="outlined-name"
                      margin="normal"
                      onChange={(event) => {
                        this.handleTextChange("workspaceName", event);
                      }}
                      variant="outlined"
                      style={{ width: "100%", margin: "0px" }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* <Grid
                item
                xs={12}
                sm={6}
                lg={6}
                xl={6}
                style={{ paddingTop: "25px" }}
              >
                <Button
                  id="back"
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={this.handleBack.bind(this)}
                  className={classes.btnStyle}
                >
                  {translate("common.page.button.back")}
                </Button>
              </Grid> */}
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
                    onClick={this.handleSubmit.bind(this)}
                  >
                    {translate("common.page.button.upload")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>

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

        {this.state.documentState && this.state.showProcessModal && 
          <UploadProcessModal 
            progressData={this.state.documentState} 
            onCopyClick={()=>this.onCopyClick()} 
            onUploadOtherDoc={()=>this.onUploadOtherDoc()} 
            goToDashboardLink={`${process.env.PUBLIC_URL}/view-document`} 
            uploadOtherDocLink={`${process.env.PUBLIC_URL}/document-upload`}
            fileName={this.state.files[0].name}
          />
        }
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
    connect(mapStateToProps, mapDispatchToProps)(PdfUpload)
  )
);
