import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Link from "@material-ui/core/Link";
import Select from "@material-ui/core/Select";
import Snackbar from "../../../components/web/common/Snackbar";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import TabDetals from "./WorkspaceDetailsTab";
import history from "../../../../web.history";
import FileUpload from "../../../components/web/common/FileUpload";
import FetchLanguage from "../../../../flux/actions/apis/fetchlanguage";
import ProcessingWorkspace from "./ProcessingWorkspace";
import SaveWorkspace from "../../../../flux/actions/apis/savesearchreplaceworkspace";
import FetchDefaultConfig from "../../../../flux/actions/apis/fetchdefaultconfig";
import ConfigUpload from "../../../../flux/actions/apis/configupload";
import { translate } from "../../../../assets/localisation";

class CreateWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      target: "",
      source: "",
      selectedWorkspaces: [],
      workspaceName: "",
      sourceLanguage: [],
      language: [],
      step: 1,
      message1: translate("common.page.label.message"),
      csvData: translate("common.page.label.csvData"),
      processData: translate("common.page.processData.pressNextToSelect")
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchLanguage();
    APITransport(apiObj);
    const apiObj2 = new FetchDefaultConfig();
    APITransport(apiObj2);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.supportLanguage !== this.props.supportLanguage) {
      const languages = [];
      const sourceLanguages = [];
      this.props.supportLanguage.map(lang => (lang.language_code !== "en" ? languages.push(lang) : sourceLanguages.push(lang)));
      this.setState({
        language: languages,
        sourceLanguage: sourceLanguages
      });
    }

    if (prevProps.createWorkspaceDetails !== this.props.createWorkspaceDetails) {
      this.setState({
        open: true
      });
      setTimeout(() => {
        history.push(`${process.env.PUBLIC_URL}/stage3/workspace-details`);
      }, 3000);
    }

    if (prevProps.fetchDefaultConfig !== this.props.fetchDefaultConfig) {
      let data = "";
      this.props.fetchDefaultConfig.data.map(item => (data = item.use === "SEARCH_REPLACE" && item));
      this.setState({ defaultConfig: data });
    }

    if (prevProps.configUplaod !== this.props.configUplaod) {
      this.setState({ files: this.props.configUplaod });

      const configFilepath = "configFile" in this.props.configUplaod && this.props.configUplaod.configFile;

      if (configFilepath) {
        const { APITransport } = this.props;
        const apiObj2 = new SaveWorkspace(this.state.selectedWorkspaces, this.state.workspaceName, this.state.target.language_code, configFilepath);
        APITransport(apiObj2);
      }
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

      reader.readAsText(file, "UTF8");
    });
  }

  handleChange = (key, event) => {
    this.setState({
      configName: key === "configFile" ? event.target.files[0].name : this.state.configName,
      csvName: key === "csvFile" ? event.target.files[0].name : this.state.csvName
    });
    this.readFileDataAsBinary(event.target.files[0]).then((result, err) => {
      this.setState({
        [key]: result
      });
    });
  };

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value,
      name: key
    });
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleWorkspaceSelected(selectedWorkspaces) {
    this.setState({
      selectedWorkspaces
    });
  }

  handleProcessSubmit() {
    const { APITransport } = this.props;

    const apiObj = new ConfigUpload(this.state.configFile, "configFile");
    this.state.configFile && APITransport(apiObj);
    this.setState({ load: true });
  }

  handleSubmit() {
    if (this.state.workspaceName && this.state.target.language_code) {
      this.setState({
        step: 2
      });
    } else {
      alert(translate("common.page.label.pageWarning"));
    }
  }

  handleBack() {
    this.setState({
      step: 1
    });
  }

  render() {
    return (
      <div>
        <TabDetals activeStep={this.state.value} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }} />
        {this.state.step === 1 ? (
          <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "3%", paddingTop: "10px", paddingBottom: "3%" }} elevation={4}>
            <Grid container spacing={24} style={{ marginTop: "3%", marginLeft: "12%" }}>
              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography gutterBottom variant="h5" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                  {translate("common.page.label.enterWorkspace")}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6}>
                <TextField
                  value={this.state.workspaceName}
                  required
                  id="outlined-name"
                  margin="normal"
                  onChange={event => {
                    this.handleTextChange("workspaceName", event);
                  }}
                  variant="outlined"
                  style={{ width: "60%" }}
                />
              </Grid>

              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography gutterBottom variant="h5" component="h2" style={{ width: "80%", paddingTop: "25px" }}>
                  {translate("common.page.label.sourceLang")} &emsp;&emsp;{" "}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ height: "56px" }}>
                <Select
                  style={{ width: "60%", marginTop: "5px" }}
                  value={this.state.source}
                  onChange={this.handleSelectChange}
                  input={<OutlinedInput name="source" id="outlined-age-simple" />}
                >
                  {this.state.language &&
                    this.state.sourceLanguage.map(item => (
                      <MenuItem key={item.language_name} value={item}>
                        {item.language_name}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>

              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography gutterBottom variant="h5" component="h2" style={{ width: "80%", paddingTop: "25px" }}>
                  {translate("common.page.label.targetLang")} &emsp;&emsp;{" "}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ height: "56px" }}>
                <Select
                  style={{ width: "60%", marginTop: "5px" }}
                  value={this.state.target}
                  onChange={this.handleSelectChange}
                  input={<OutlinedInput name="target" id="outlined-age-simple" />}
                >
                  {this.state.language &&
                    this.state.language.map(item => (
                      <MenuItem key={item.language_name} value={item}>
                        {item.language_name}
                      </MenuItem>
                    ))}
                </Select>
                {/* <Select id={"outlined-age-simple"} MenuItemValues={this.state.language} handleChange={this.handleSelectChange} value={this.state.target} name="target" /> */}
              </Grid>

              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography
                  variant="subtitle2"
                  color="inherit"
                  style={{ textAlign: "justify", color: "#ACACAC", marginTop: "10%", width: "80%", marginLeft: "2px" }}
                >
                  {this.state.processData}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "60%", marginTop: "6%", height: "56px" }}
                  onClick={this.handleSubmit.bind(this)}
                >
                  {translate("common.page.button.next")}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "3%", paddingTop: "10px", paddingBottom: "3%" }} elevation={4}>
            <Grid container spacing={24} style={{ marginTop: "3%", marginLeft: "12%" }}>
              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography gutterBottom variant="h5" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                  {translate("common.page.label.workSpaceName")}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={7} sm={7} lg={7} xl={7}>
                <TextField
                  value={this.state.workspaceName}
                  required
                  id="outlined-name"
                  margin="normal"
                  onChange={event => {
                    this.handleTextChange("workspaceName", event);
                  }}
                  variant="outlined"
                  style={{ width: "60%" }}
                />
              </Grid>
              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography gutterBottom variant="h5" component="h2" style={{ width: "80%", paddingTop: "25px" }}>
                  {translate("newSentenceExtraction.page.label.confiFile")} &emsp;&emsp;{" "}
                  <a
                    href={
                      this.state.defaultConfig
                        ? `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org"}/download/${
                            this.state.defaultConfig.path
                          }`
                        : ""
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <Link component="button" variant="body2">
                      {translate("newSentenceExtraction.page.link.globalConfig")}
                    </Link>
                  </a>
                </Typography>
                <br />
              </Grid>
              <Grid item xs={7} sm={7} lg={7} xl={7} style={{ marginTop: "-7px", height: "56px" }}>
                <Grid container spacing={8}>
                  <Grid item xs={4} sm={4} lg={4} xl={4}>
                    <FileUpload accept=".yaml" buttonName="Upload" handleChange={this.handleChange.bind(this)} name="configFile" />
                  </Grid>

                  <Grid item xs={4} sm={4} lg={4} xl={4}>
                    <TextField
                      value={this.state.configName}
                      id="outlined-name"
                      disabled
                      margin="normal"
                      variant="outlined"
                      style={{ width: "80%" }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={12} lg={12} xl={12}>
                <ProcessingWorkspace
                  handleWorkspaceSelected={this.handleWorkspaceSelected.bind(this)}
                  target={this.state.target}
                  selectedWorkspaces={this.state.selectedWorkspaces}
                />
              </Grid>

              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography
                  variant="subtitle2"
                  color="inherit"
                  style={{ textAlign: "justify", color: "#ACACAC", marginTop: "8%", width: "80%", marginLeft: "2px" }}
                >
                  {this.state.processData}
                </Typography>
                <br />
              </Grid>

              <Grid item xs={7} sm={7} lg={7} xl={7} style={{ marginTop: "-7px", height: "56px" }}>
                <Grid container spacing={8}>
                  <Grid item xs={4} sm={4} lg={4} xl={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{ width: "80%", marginTop: "6%", height: "56px" }}
                      onClick={this.handleBack.bind(this)}
                    >
                      {translate("common.page.button.back")}
                    </Button>
                  </Grid>
                  <Grid item xs={4} sm={4} lg={4} xl={4}>
                    <Button
                      disabled={!this.state.selectedWorkspaces.length}
                      variant="contained"
                      color="primary"
                      style={{ width: "80%", marginTop: "6%", height: "56px" }}
                      onClick={this.handleProcessSubmit.bind(this)}
                    >
                      {translate("common.page.button.start")}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}

        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={3000}
            onClose={this.handleClose}
            variant="success"
            message={this.state.message1}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  configUplaod: state.configUplaod,
  fetchDefaultConfig: state.fetchDefaultConfig,
  supportLanguage: state.supportLanguage,
  createWorkspaceDetails: state.createWorkspaceDetails
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateWorkspace));
