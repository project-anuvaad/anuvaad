import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Snackbar from "../../../components/web/common/Snackbar";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import TabDetals from "./WorkspaceDetailsTab";
import history from "../../../../web.history";
import FetchLanguage from "../../../../flux/actions/apis/fetchlanguage";
import ProcessingWorkspace from "./ProcessingWorkspace";
import MTProcessWorkspace from "../../../../flux/actions/apis/createworkspace";
import { translate } from "../../../../assets/localisation";

class CreateWorkspace extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      target: "",
      selectedWorkspaces: [],
      workspaceName: "",
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
  }

  componentDidUpdate(prevProps) {
    if (prevProps.supportLanguage !== this.props.supportLanguage) {
      const languages = [];
      this.props.supportLanguage.map(lang => {
        if (lang.language_code !== "en") {
          languages.push(lang);
        }
        return true;
      });
      this.setState({
        language: languages
      });
    }

    if (prevProps.createWorkspaceDetails !== this.props.createWorkspaceDetails) {
      this.setState({
        open: true
      });

      setTimeout(() => {
        history.push(`${process.env.PUBLIC_URL}/stage2/workspace-details`);
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

  handleWorkspaceSelected(selectedWorkspaces) {
    this.setState({
      selectedWorkspaces
    });
  }

  handleProcessSubmit() {
    const { APITransport } = this.props;
    if (this.state.selectedWorkspaces && this.state.selectedWorkspaces.length > 0) {
      const apiObj2 = new MTProcessWorkspace(
        this.state.selectedWorkspaces,
        this.state.workspaceName,
        this.state.useLatest,
        this.state.target.language_code
      );
      APITransport(apiObj2);
      this.setState({ load: true });
    } else {
      alert(translate("common.page.label.selectWorkspaceFromList"));
    }
  }

  handleCheckboxChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleSubmit() {
    //const { APITransport } = this.props;
    if (this.state.workspaceName && this.state.target.language_code) {
      this.setState({
        step: 2
      });
    } else {
      alert(translate("common.page.label.pageWarning"));
    }
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
                  {translate("common.page.label.targetLang")} &emsp;&emsp;{" "}
                </Typography>
                <br />
              </Grid>
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ height: "56px" }}>
                <Select
                  style={{ width: "60%" }}
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
              <Grid item xs={5} sm={5} lg={5} xl={5} style={{ height: "56px" }} />
              <Grid item xs={6} sm={6} lg={6} xl={6} style={{ height: "56px" }}>
                <FormControlLabel
                  control={<Checkbox value="useLatest" checked={this.state.useLatest} onChange={this.handleCheckboxChange("useLatest")} />}
                  label={translate("common.page.label.useLatestTranslate")}
                />
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

              <Grid item xs={12} sm={12} lg={12} xl={12}>
                <ProcessingWorkspace
                  handleWorkspaceSelected={this.handleWorkspaceSelected.bind(this)}
                  selectedWorkspaces={this.state.selectedWorkspaces}
                />
              </Grid>

              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography
                  variant="subtitle2"
                  color="inherit"
                  style={{ textAlign: "justify", color: "#ACACAC", marginTop: "11%", width: "80%", marginLeft: "2px" }}
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
                  onClick={this.handleProcessSubmit.bind(this)}
                >
                  {translate("common.page.button.start")}
                </Button>
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
  workspaceDetails: state.workspaceDetails,
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
