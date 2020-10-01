import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import FileUpload from "../../../components/web/common/FileUpload";
import Snackbar from "../../../components/web/common/Snackbar";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import TabDetals from "./WorkspaceDetailsTab";
import history from "../../../../web.history";
import ConfigUpload from "../../../../flux/actions/apis/configupload";
import FetchDefaultConfig from "../../../../flux/actions/apis/fetchdefaultconfig";
import RunExperiment from "../../../../flux/actions/apis/runexperiment";
import Spinner from "../../../components/web/common/Spinner";
import { translate } from "../../../../assets/localisation";

class NewSentanceExtraction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configFile: "",
      csvFile: "",
      workspaceName: "",
      configName: "",
      csvName: "",
      value: 1,
      load: false,
      count: 1,

      message: translate("common.page.label.message"),

      csvData: translate("common.page.label.csvData"),
      processData: translate("common.page.label.processData")
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchDefaultConfig();
    APITransport(apiObj);
    this.setState({ showLoader: true });
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

  renderMessage() {
    if (this.props.apistatus.message) {
      this.setState({ load: false });
      return <Snackbar message={this.props.apistatus.message} variant={this.props.apistatus.error ? "error" : "success"} />;
    }
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
    // this.setState({
    //   [key]: new Blob(event.target.files[0]),
    //   configName: key == "configFile" ? event.target.files[0].name : this.state.configName,
    //   csvName: key == "csvFile" ? event.target.files[0].name : this.state.csvName
    // });
  };

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value,
      name: key
    });
  }

  renderApi() {
    if (this.state.count === 2) {
      const { APITransport } = this.props;
      const apiObj = new RunExperiment(
        this.state.workspaceName,
        "configFile" in this.props.configUplaod && this.props.configUplaod.configFile,
        "csvFile" in this.props.configUplaod && this.props.configUplaod.csvFile
      );
      this.state.csvFile && APITransport(apiObj);
      this.setState({ count: 1 });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.configUplaod !== this.props.configUplaod) {
      this.setState({ files: this.props.configUplaod, count: this.state.count + 1 });
      this.renderApi();
    }

    if (prevProps.fetchDefaultConfig !== this.props.fetchDefaultConfig) {
      this.setState({ defaultConfig: this.props.fetchDefaultConfig.data[0], defaultCsv: this.props.fetchDefaultConfig.data[1] });
    }

    if (prevProps.workspaceDetails !== this.props.workspaceDetails) {
      this.setState({
        open: true,
        load: false,
        workspaceName: "",
        configFile: "",
        csvFile: "",
        files: {},
        configName: "",
        csvName: ""
      });

      setTimeout(() => {
        history.push(`${process.env.PUBLIC_URL}/workspace-details`);
      }, 3000);
      //
    }
  }

  handleSubmit() {
    if (this.state.workspaceName && this.state.configFile && this.state.csvFile) {
      const { APITransport } = this.props;

      const apiObj = new ConfigUpload(this.state.configFile, "configFile");
      this.state.configFile && APITransport(apiObj);
      const apiObj2 = new ConfigUpload(this.state.csvFile, "csvFile");
      this.state.csvFile && APITransport(apiObj2);
      this.setState({ load: true });
    } else {
      alert(translate("common.page.label.pageWarning"));
    }
    // history.push(`${process.env.PUBLIC_URL}/token-extraction`);
  }

  render() {
    return (
      <div>
        <TabDetals activeStep={this.state.value} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }} />
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
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{ marginTop: "-7px", height: "56px" }}>
              <Grid container spacing={8}>
                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <FileUpload
                    accept=".yaml"
                    buttonName={translate("common.page.button.upload")}
                    handleChange={this.handleChange.bind(this)}
                    name="configFile"
                  />
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <TextField value={this.state.configName} id="outlined-name" disabled margin="normal" variant="outlined" style={{ width: "80%" }} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Typography
                variant="subtitle2"
                color="inherit"
                style={{ textAlign: "justify", color: "#ACACAC", marginRight: "28%", marginTop: "40px" }}
              >
                {this.state.csvData}
              </Typography>
            </Grid>
            <Grid item xs={5} sm={5} lg={5} xl={5}>
              <Typography gutterBottom variant="h5" component="h2" style={{ width: "80%", paddingTop: "25px" }}>
                {translate("common.page.label.csvFile")} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                <a
                  href={
                    this.state.defaultConfig
                      ? `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org"}/download/${
                          this.state.defaultCsv.path
                        }`
                      : ""
                  }
                  style={{ textDecoration: "none" }}
                >
                  <Link component="button" variant="body2">
                    {translate("newSentenceExtraction.page.link.SampleCsv")}
                  </Link>
                </a>
              </Typography>
              <br />
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Grid container spacing={8}>
                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <FileUpload
                    accept=".csv"
                    buttonName={translate("common.page.button.upload")}
                    handleChange={this.handleChange.bind(this)}
                    name="csvFile"
                  />
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <TextField value={this.state.csvName} id="outlined-name" disabled margin="normal" variant="outlined" style={{ width: "80%" }} />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={5} sm={5} lg={5} xl={5}>
              <Typography
                variant="subtitle2"
                color="inherit"
                style={{ textAlign: "justify", color: "#ACACAC", marginTop: "7%", width: "80%", marginLeft: "2px" }}
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
                {translate("common.page.button.start")}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {this.renderMessage()}

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

        {this.state.load && <Spinner />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  configUplaod: state.configUplaod,
  workspaceDetails: state.workspaceDetails,
  fetchDefaultConfig: state.fetchDefaultConfig
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewSentanceExtraction));
