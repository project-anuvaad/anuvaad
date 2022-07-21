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
import Select from "@material-ui/core/Select";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import history from "../../../../web.history";
import Snackbar from '@material-ui/core/Snackbar';
import { translate } from "../../../../assets/localisation";
import FileUploadStyles from "../../../styles/web/FileUpload";
import Alert from '@material-ui/lab/Alert';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import SaveSentenceAPI from "../../../../flux/actions/apis/tmx/tmxUpload";
import DocumentUpload from "../../../../flux/actions/apis/document_upload/document_upload";
import { createJobEntry } from '../../../../flux/actions/users/async_job_management';
import FetchOrganizationList from "../../../../flux/actions/apis/organization/organization-list";
const TELEMETRY = require('../../../../utils/TelemetryManager')

const theme = createMuiTheme({
  overrides: {
    MuiDropzoneArea: {
      root: {
        paddingTop: '5%',
        top: "auto",
        width: '98%', 
        minHeight: '220px',
        height: "45%",
        borderColor: '#1C9AB7',
        backgroundColor: '#F5F9FA',
        border: '1px dashed #1C9AB7',
        fontColor: '#1C9AB7',
        marginTop: "3%",
        marginLeft: '1%',
        "& svg": { color: '#1C9AB7',marginTop:'-20px' },
        "& p": {
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: "17px",
          paddingTop:'-50px',
          color: '#1C9AB7',

        }
      },

    }
  }
});

class TmxUpload extends Component {
  constructor() {
    super();
    this.state = {
      source: "",
      target: "",
      files: [],
      key:1,
      open: false,
      modelLanguage: [],
      name: "",
      message: "File uplaoded successfully",
      showComponent: false,
      workflow: "WF_A_FCBMTKTR",
      fileName: "",
      workspaceName: "",
      path: "",
      orgName:'',
      orgDropDownDisabled: false,
      cleared: false
    };
  }



  handleSubmit(e) {

    e.preventDefault();
    if (this.state.files.length > 0 && this.state.orgName ) {
      const { APITransport } = this.props;
      const apiObj = new DocumentUpload(
        this.state.files, "docUplaod"
      );
      APITransport(apiObj);
      this.informUserProgress('Glossary uploading')
    } else {
      alert("Field should not be empty!");
    }

  }

  processFetchBulkOrganizationAPI = () => {
    const userObj = new FetchOrganizationList()
    this.props.APITransport(userObj)
  }
  /**
   * life cycle methods
   */
  componentDidMount() {
    // TELEMETRY.pageLoadCompleted('');
    this.setState({ showLoader: true })
    this.props.organizationList.length<1 && this.processFetchBulkOrganizationAPI()

    let role = [localStorage.getItem("roles")];
    let useRole = [];
    role.map((item, value) => {
      useRole.push(item); value !== role.length - 1 && useRole.push(", ")
      return true;
    });

    if(role && Array.isArray(role) && role.includes("ADMIN")){
      let orgID = JSON.parse(localStorage.getItem("userProfile")).orgID;
      console.log("orgID", orgID);
      this.setState({orgName : orgID, orgDropDownDisabled : true})
    }
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleBack = () => {
    history.push(`${process.env.PUBLIC_URL}/user-details`)
  }

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   TELEMETRY.pageLoadStarted('document-upload')

  //   /**
  //   * getSnapshotBeforeUpdate() must return null
  //   */
  //   return null;
  // }



  handleDelete = () => {
    this.setState({
      files: []
    });
  };

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

  renderOrgItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.label}>
          <Typography value="" variant="h5">
            Organization
          </Typography>
        </Grid>

        <Grid item xs={12} sm={12} lg={12} xl={12} >
          <FormControl variant="outlined" style={{
            width: '100%',
            fullWidth: true,
            display: "flex",
            wrap: "nowrap",
            height: '40px',
            magin: 'dense',
            
            marginBottom: '5%'
          }}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="roles"
              onChange={this.handleSelectChange}
              disabled={this.state.orgDropDownDisabled}
              value={this.state.orgName}
              name= "orgName"
              style={{
                fullWidth: true,
              }}
            >
              {
                this.props.organizationList.map((id, i) => <MenuItem id={i} key={i} value={id}>{id}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  componentDidUpdate(prevProps) {

    if (prevProps.documentUplaod !== this.props.documentUplaod) {

      this.tmxFileUpload(this.props.documentUplaod.data)
    }
  }

  /**
   * progress information for user from API
   */
  informUserProgress = (message) => {
    this.setState({
      apiInProgress: true,
      showStatus: false,
      snackBarMessage: message
    })
  }
  informUserStatus = (message, isSuccess) => {
    this.setState({
      apiInProgress: false,
      showStatus: true,
      snackBarMessage: message,
      snackBarVariant: isSuccess ? "success" : "error"
    })
  }

  renderProgressInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.apiInProgress}
        message={this.state.snackBarMessage}
      >
        <Alert elevation={6} variant="filled" severity="info">{this.state.snackBarMessage}</Alert>
      </Snackbar>
    )
  }

  renderStatusInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={this.state.showStatus}
        onClose={(e, r) => {
          this.setState({ showStatus: false })
        }}
      >
        <Alert elevation={6} variant="filled" severity={this.state.snackBarVariant}>{this.state.snackBarMessage}</Alert>
      </Snackbar>
    )
  }



  async tmxFileUpload(fileId) {
    TELEMETRY.glossaryUpload(fileId, this.state.orgName)
    let apiObj = new SaveSentenceAPI(fileId, this.state.orgName)
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        TELEMETRY.log("tmx-upload", JSON.stringify(rsp_data))
        if(Number(response.status)===401){
          this.handleRedirect()
        }
        else{
          this.informUserStatus(rsp_data.message ? "rsp_data.message": rsp_data.why ? rsp_data.why : "Upload failed", false)
        }
        
        return Promise.reject('');
      } else {
        this.setState({orgName:'',files: [], key:this.state.key+1 })
        if(rsp_data.status== "SUCCESS"){
            this.informUserStatus("Glossary uploaded.", true)
        }
        else{
            this.informUserStatus(rsp_data.message ? rsp_data.message : "Glossary upload failed.", false)
        }
        
        

      }
    }).catch((error) => {
      this.informUserStatus(translate('common.page.label.SENTENCE_SAVED_FAILED'), false)
    });
  }




  render() {
    const { classes } = this.props;
    return (
      <div>


        <div className={classes.div}>
        <Typography value="" variant="h4" className={classes.typographyHeader}>
            {translate("common.page.label.glossaryUpload")}
          </Typography>
          <Paper elevation={3} style={{minHeight:'255px'}} className={classes.paper}>
            <Grid container spacing={8}>

              <Grid item xs={12} sm={6} lg={6} xl={6}>
                <MuiThemeProvider theme={theme}>
                  <DropzoneArea className={classes.DropZoneArea}
                    showPreviewsInDropzone
                    key= {this.state.key}
                    dropZoneClass={classes.dropZoneArea}
                    acceptedFiles={[".xls", ".xlsx"]}
                    onChange={this.handleChange.bind(this)}
                    filesLimit={1}
                    clearOnUnmount = {this.state.cleared}
                    maxFileSize={200000000}
                    dropzoneText={"Please Add / Drop xls / xlsx document here"}
                    onDelete={this.handleDelete.bind(this)}
                  />
                </MuiThemeProvider>
              </Grid>

              <Grid item xs={12} sm={6} lg={6} xl={6}>

              {this.renderOrgItems()}
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
                      height: '46px',
                      marginTop:'5%'
                    }}
                    size="large" onClick={this.handleSubmit.bind(this)}>
                    {translate("common.page.button.upload")}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} xl={12}>
                  
                <Button
                  id="back"
                  variant="contained" color="primary"
                  size="large" onClick={this.handleBack.bind(this)}
                  style={{
                    width: "100%",
                    backgroundColor: '#1C9AB7',
                    borderRadius: "20px 20px 20px 20px",
                    color: "#FFFFFF",
                    height: '46px',
                    marginTop:'5%'
                  }}
                >
                  {translate("common.page.button.back")}
                </Button>
                </Grid>
                

              </Grid>

              


            </Grid>


            {this.state.apiInProgress ? this.renderProgressInformation() : <div />}
        {this.state.showStatus ? this.renderStatusInformation() : <div />}
           
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
  fetch_models: state.fetch_models,
  organizationList: state.organizationList.orgList,
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

export default withRouter(withStyles(FileUploadStyles)(connect(mapStateToProps, mapDispatchToProps)(TmxUpload)));
