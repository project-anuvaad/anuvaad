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
import FetchModel from "../../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../../flux/actions/apis/fetchlanguage";
import history from "../../../../web.history";
import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";
import FileUploadStyles from "../../../styles/web/FileUpload";
import WorkFlow from "../../../../flux/actions/apis/fileupload";
import DocumentUpload from "../../../../flux/actions/apis/document_upload";
import TextField from "@material-ui/core/TextField";
import Select from "../../../components/web/common/Select";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
const TELEMETRY = require('../../../../utils/TelemetryManager')
const theme = createMuiTheme({
  overrides: {
    MuiDropzoneArea: {
      root: {
        paddingTop: '15%',
        top: "auto",
        width:'98%',
        minHeight:'320px',
        height: "85%",
        borderColor:'#1C9AB7',
        backgroundColor: '#F5F9FA',
        border: '1px dashed #1C9AB7',
        fontColor:'#1C9AB7',
        marginTop:"3%",
        marginLeft:'1%',
        "& svg":{color:'#1C9AB7',},
        "& p": {
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: "19px",
          color:'#1C9AB7',
          
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
      workflow :"DP_WFLOW_FBTTR"
    };
  }

  

  handleSubmit(e) {
    let model = "";
    let target_lang_name = ''
    let source_lang_name = ''
    if (this.state.modelLanguage) {
      this.state.modelLanguage.map(item =>
        item.target_language_code === this.state.target &&
          item.source_language_code === this.state.source &&
          item.is_primary
          ? (model = item)
          : ""
      );
      this.state.language.map((lang) => {
        if (lang.language_code === this.state.target) {
          target_lang_name = lang.language_name
        } if (lang.language_code === this.state.source) {
          source_lang_name = lang.language_name
        }
        return true
      })
      e.preventDefault();
      this.setState({model})
      if (this.state.files.length > 0  && source_lang_name && target_lang_name ) {
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
  }

  componentDidMount() {
    TELEMETRY.pageLoadCompleted('document-upload')

    const { APITransport } = this.props;
    const apiObj = new FetchLanguage();
    APITransport(apiObj);
    this.setState({ showLoader: true });
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.supportLanguage !== this.props.supportLanguage) {
      this.setState({
        language: this.props.supportLanguage
      });
    }

    if (prevProps.langModel !== this.props.langModel) {
      this.setState({
        modelLanguage: this.props.langModel
      });
    }
    if (prevProps.documentUplaod !== this.props.documentUplaod) {

      const { APITransport } = this.props;
      const apiObj = new WorkFlow(this.state.workflow, this.props.documentUplaod.data, this.state.fileName,this.state.source,
        this.state.target,this.state.path, this.state.model);
      APITransport(apiObj);
      // history.push(`${process.env.PUBLIC_URL}/interactive-document/${this.props.configUplaod.configUplaod}`);
    }
    if (prevProps.workflowStatus !== this.props.workflowStatus) {
      TELEMETRY.startWorkflow(this.state.source, this.state.target, this.props.workflowStatus.input.jobName, this.props.workflowStatus.jobID)
      history.push(`${process.env.PUBLIC_URL}/view-document`);
    }
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
      let fileType = path[path.length-1]
      let fileName = path.splice(0,path.length-1).join('.')
      this.setState({
        files,
        fileName: files[0].name,
        workspaceName: this.state.workspaceName ? this.state.workspaceName : fileName,
        path : fileType
      });
    } else {
      this.setState({
        files,
        workspaceName: ""
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.div}>
        <Typography value="" variant="h4" className={classes.typographyHeader}>
          {translate("common.page.label.uploadFile")}
        </Typography>
        <br />
        <Typography className={classes.typographySubHeader}>{translate("pdf_upload.page.label.uploadMessage")}</Typography>
        <br />
        <Paper className={classes.paper}>
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
              <Grid container spacing={24} className={classes.grid}>
                <Typography gutterBottom variant="h5" className={classes.typography}>
                  {translate('common.page.label.sourceLang')}<span className={classes.span}>*</span>
                </Typography>
                <Grid item xs={12} sm={12} lg={12} xl={12}  >
                  <Select
                    id="outlined-age-simple"
                    selectValue="language_code"
                    fullWidth
                    MenuItemValues={this.state.modelLanguage.length > 0 && this.handleSource(this.state.modelLanguage, this.state.language)}
                    // MenuItemValues={["English"]}
                    handleChange={this.handleSelectChange}
                    value={this.state.source}

                    name="source"
                    className={classes.Select}
                  />
                </Grid>
              </Grid>
              <br /><br />
              <Grid container spacing={24} className={classes.grid}>

                <Typography
                  value="Select target language"
                  variant="h5"
                  gutterBottom="true"
                  className={classes.typography}
                >
                  {translate('common.page.label.targetLang')}<span className={classes.span}>*</span>
                </Typography>
                <br />
                <Grid item xs={12} sm={12} lg={12} xl={12}  >
                  <Select
                    id="outlined-age-simple"
                    selectValue="language_code"
                    MenuItemValues={this.state.source && this.state.modelLanguage.length > 0 ? this.handleTarget(this.state.modelLanguage, this.state.language, this.state.source) : []}
                    // MenuItemValues={["Hindi"]}
                    handleChange={this.handleSelectChange}
                    value={this.state.target}
                    name="target"
                    className={classes.Select}
                  />
                </Grid>
              </Grid>
              <br /><br />
              <Grid container spacing={24} className={classes.grid}>
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
    );
  }
}

const mapStateToProps = state => ({
  fileUpload: state.fileUpload,
  configUplaod: state.configUplaod,
  workflowStatus: state.workflowStatus,
  documentUplaod: state.documentUplaod,
  supportLanguage: state.supportLanguage,
  langModel: state.langModel
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(FileUploadStyles)(connect(mapStateToProps, mapDispatchToProps)(PdfUpload)));
