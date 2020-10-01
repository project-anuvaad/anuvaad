import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import BackIcon from "@material-ui/icons/ChevronLeft";
import Snackbar from "../../../components/web/common/Snackbar";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import history from "../../../../web.history";
import FileUpload from "../../../components/web/common/FileUpload";
import ConfigUpload from "../../../../flux/actions/apis/configupload";
import SaveDataSource from "../../../../flux/actions/apis/savetool2datasource";
import { translate } from "../../../../assets/localisation";

class CreateWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      target: "",
      source: "",
      csvName: "",
      workspaceName: "",
      sourceLanguage: [],
      language: [],
      file: [],
      message1: translate("tool2.page.message1.fileadded"),
      csvData: translate("newSentenceExtraction.page.label.csvData"),
      processData: translate("common.page.processData.pressNextToSelect")
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.configUplaod !== this.props.configUplaod) {
      this.setState({ files: this.props.configUplaod });

      const csvFilepath = "csvFile" in this.props.configUplaod && this.props.configUplaod.csvFile;

      if (csvFilepath) {
        const { APITransport } = this.props;

        const apiObj2 = new SaveDataSource(this.state.workspaceName, csvFilepath);
        APITransport(apiObj2);
      }
    }

    if (prevProps.createWorkspaceDetails !== this.props.createWorkspaceDetails) {
      this.setState({
        open: true
      });
      setTimeout(() => {
        history.push(`${process.env.PUBLIC_URL}/stage2/datasource`);
      }, 3000);
    }
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value,
      name: key
    });
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit() {
    if (this.state.workspaceName && this.state.csvName) {
      const { APITransport } = this.props;

      const apiObj = new ConfigUpload(this.state.csvFile, "csvFile");
      this.state.csvName && APITransport(apiObj);
      this.setState({ load: true });
    } else {
      alert(translate("common.page.label.pageWarning"));
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
  };

  render() {
    return (
      <div>
        <Toolbar style={{ marginTop: "20px", marginRight: "3%", marginLeft: "3%", padding: "0px", marginBottom: "15px" }}>

          <Typography variant="title" color="inherit" style={{ flex: 1 }} />

          <Button
            variant="extendedFab"
            color="primary"
            onClick={() => {
              history.push(`${process.env.PUBLIC_URL}/stage2/datasource`);
            }}
          >
            <BackIcon /> {translate("common.page.button.back")}
          </Button>
        </Toolbar>

        <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "1%", paddingTop: "5px", paddingBottom: "3%" }} elevation={4}>
          <Typography
            gutterBottom
            variant="title"
            component="h2"
            style={{
              marginTop: "-.7%",
              paddingLeft: "40%",
              background: '#ECEFF1',
              paddingTop: "25px",
              paddingBottom: "16px"
            }}
          >
            {translate("common.page.label.addDataSource")}
          </Typography>
          <br />
          <Grid container spacing={24} style={{ marginTop: "1 %", marginLeft: "12%" }}>
            <Grid item xs={5} sm={5} lg={5} xl={5}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
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
              <Typography gutterBottom variant="title" component="h2" style={{ width: "80%", paddingTop: "25px" }}>
                {translate("common.page.label.csvFile")} &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
              </Typography>
              <br />
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Grid container spacing={8}>
                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <FileUpload accept=".csv" buttonName="Upload" handleChange={this.handleChange.bind(this)} name="csvFile" />
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
                style={{ textAlign: "justify", color: "#ACACAC", marginTop: "10%", width: "80%", marginLeft: "2px" }}
               />
              <br />
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "60%", marginTop: "6%", height: "56px" }}
                onClick={this.handleSubmit.bind(this)}
              >
                {translate("common.page.button.submit")}
              </Button>
            </Grid>
          </Grid>
        </Paper>

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
