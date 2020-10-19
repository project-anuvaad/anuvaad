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
import TextField from "@material-ui/core/TextField";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import PdfFileUpload from "../../../flux/actions/apis/pdffileupload";
import history from "../../../web.history";
import Snackbar from "../../components/web/common/Snackbar";
import { translate } from "../../../assets/localisation";
import Select from "../../components/web/common/Select";
import SimpleSelect from "../../components/web/common/SimpleSelect";
import FetchModel from "../../../flux/actions/apis/fetchmodel";
import FetchLanguage from "../../../flux/actions/apis/fetchlanguage";
import PdfUploadStyles from "../../styles/web/PdfUploadStyles";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  overrides: {
    MuiDropzoneArea: {
      root: {
        paddingTop: '15%',
        top: "auto",
        width:'98%',
        minHeight:'320px',
        height: "95.3%",
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
      const { APITransport } = this.props;
      if (this.state.files.length > 0 && this.state.workspaceName &&source_lang_name&&target_lang_name&& this.state.strategy) {
        const apiObj = new PdfFileUpload(
          this.state.workspaceName,
          this.state.files[0],
          source_lang_name,
          target_lang_name,
          model,
          this.state.strategy
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

  // handleChange = files => {
  //   this.setState({
  //     files
  //   });
  // };

  componentDidMount() {
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
    if (prevProps.uploadpdf !== this.props.uploadpdf) {
      this.setState({ filesPath: this.props.uploadpdf, open: true });
      history.push(`${process.env.PUBLIC_URL}/view-pdf`);
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
      this.setState({
        files,
        workspaceName: this.state.workspaceName ? this.state.workspaceName : files[0].name.slice(0, -4)
      });
      
    }
    else{
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
      
        <Typography value=""  variant="h4" className={classes.typographyHeader}>
              {translate("common.page.label.uploadFile")}
        </Typography>
        <br/>
        <Typography className={classes.typographySubHeader}>
            {translate("pdf_upload.page.label.uploadMessage")}
        </Typography >
        <br />
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={8}>

            <Grid item xs={12} sm={6} lg={6} xl={6} >
            <MuiThemeProvider theme={theme}>
              <DropzoneArea className={classes.DropZoneArea}
                showPreviewsInDropzone
                acceptedFiles={[".pdf"]}
                dropZoneClass={classes.dropZoneArea}
                onChange={this.handleChange.bind(this)}
                filesLimit={1}
                maxFileSize={20000000}
                dropzoneText={translate("common.page.label.addDropFile")}
                onDelete={this.handleDelete.bind(this)}
              />
               </MuiThemeProvider>
            </Grid>

            <Grid item xs={12} sm={6} lg={6} xl={6}  >
         
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
              <br /><br/>
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
          <br/><br/>
          <Grid container spacing={24} className={classes.grid}>

                <Typography gutterBottom="true" variant="h5" className={classes.typography}>
                 Strategy<span className={classes.span}>*</span>
                </Typography>
              <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.simpleselect} >
                  <SimpleSelect
                  id="outlined-age-simple"
                  selectValue="language_code"
                  fullWidth
                  
                  MenuItemValues={["NER","LOK SABHA","OCR"]}
                  handleChange={this.handleSelectChange}
                  value={this.state.strategy}
                  name="strategy"
                  className={classes.Select}
                />
              </Grid>
              </Grid>
              <br /><br/>
          <Grid container spacing={24} className={classes.grid}>
              <Typography gutterBottom variant="h5"  className={classes.typography}>
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
<Button
    variant="contained"
    color="primary"
    className={classes.button1} size="large" 
    onClick={() => {
      history.push(`${process.env.PUBLIC_URL}/view-pdf`);
    }}
  >
  {translate("common.page.button.cancel")}
</Button>
</Grid>

<Grid item xs={12} sm={6} lg={6} xl={6}  >

  <Grid container spacing={24} className={classes.grid}>
   
  <Grid item xs={12} sm={12} lg={12} xl={12}  >
  <Button variant="contained" color="primary" className={classes.button2} size="large" onClick={this.handleSubmit.bind(this)}>
{translate("common.page.button.upload")}
</Button>
  </Grid>
  </Grid>
  
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
  uploadpdf: state.uploadpdf,
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

export default withRouter(
  withStyles(PdfUploadStyles)(
    connect(mapStateToProps, mapDispatchToProps)(PdfUpload)));
