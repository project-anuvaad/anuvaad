import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import TabDetals from "./WorkspaceDetailsTab";
import StepDetals from "./TockenExtractionSteps";
import FileUpload from "../../../components/web/common/FileUpload";
import history from "../../../../web.history";
import tokenUpload from "../../../../flux/actions/apis/configupload";
import UploadApiToken from "../../../../flux/actions/apis/uploadtoken";
import Snackbar from "../../../components/web/common/Snackbar";
import Spinner from "../../../components/web/common/Spinner";
import FetchWorkspaceDetails from "../../../../flux/actions/apis/fetchworkspacedetails";
import { translate } from "../../../../assets/localisation";

class UploadToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      processData: translate("common.page.processData.pressNext"),
      activeStep: 1,
      positiveToken: "",
      negativeToken: "",
      workspaceName: this.props.match.params.name,
      session_id: this.props.match.params.session_id,
      message: translate("common.page.message.step2Completed"),
      load: false,
      positiveChecked: false,
      negativeChecked: false
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const api = new FetchWorkspaceDetails(this.props.match.params.session_id);
    APITransport(api);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchWorkspaceDetails !== this.props.fetchWorkspaceDetails) {
      this.setState({ workspaceDetails: this.props.fetchWorkspaceDetails.data });
    }

    if (prevProps.uploadTokenValue !== this.props.uploadTokenValue) {
      this.setState({ open: true, load: false, files: [], negativeToken: "", positiveToken: "" });

      setTimeout(() => {
        history.push(`${process.env.PUBLIC_URL}/existing-workspace`);
      }, 3000);
    }

    if (prevProps.configUplaod !== this.props.configUplaod) {
      this.setState({ files: this.props.configUplaod });

      const positiveTockenValue = this.state.positiveChecked
        ? this.state.positiveToken
        : "positiveToken" in this.props.configUplaod
        ? this.props.configUplaod.positiveToken
        : "";
      const negativeTockenValue = this.state.negativeChecked
        ? this.state.negativeToken
        : "negativeToken" in this.props.configUplaod
        ? this.props.configUplaod.negativeToken
        : "";

      if (positiveTockenValue && negativeTockenValue) {
        const { APITransport } = this.props;
        const apiObj = new UploadApiToken(this.state.session_id, this.state.workspaceName, positiveTockenValue, negativeTockenValue);
        APITransport(apiObj);
        this.setState({ load: true });
      }
    }
  }

  handleSubmit() {
    if (this.state.workspaceName && this.state.positiveToken && this.state.negativeToken) {
      const { APITransport } = this.props;
      if (!this.state.positiveChecked) {
        const apiObj = new tokenUpload(this.state.positiveToken, "positiveToken");
        this.state.positiveToken && APITransport(apiObj);
      }
      if (!this.state.negativeChecked) {
        const apiObj2 = new tokenUpload(this.state.negativeToken, "negativeToken");
        this.state.negativeToken && APITransport(apiObj2);
        this.setState({ load: true });
      }
      if (this.state.positiveChecked && this.state.negativeChecked) {
        const apiObj = new UploadApiToken(this.state.session_id, this.state.workspaceName, this.state.positiveToken, this.state.negativeToken);

        APITransport(apiObj);
        this.setState({ load: true });
      }
    } else {
      alert(translate("common.page.alert.fileUpload"));
    }

    // history.push(`${process.env.PUBLIC_URL}/sentence-extraction`);
  }

  handleChange = (key, event) => {
    this.setState({
      [key]: event.target.files[0],
      positiveToken: key === "positiveToken" ? event.target.files[0].name : this.state.positiveToken,
      negativeToken: key === "negativeToken" ? event.target.files[0].name : this.state.negativeToken
    });
  };

  handleSwitchChange = name => event => {
    this.setState({
      [name]: event.target.checked,
      positiveToken: name === "positiveChecked" ? (event.target.checked ? this.state.workspaceDetails.token_file : "") : this.state.positiveToken,
      negativeToken:
        name === "negativeChecked" ? (event.target.checked ? this.state.workspaceDetails.negative_token_file : "") : this.state.negativeToken
    });
  };

  render() {
    return (
      <div>
        <TabDetals activeStep={this.state.value} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }} />
        <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "3%", paddingTop: "10px", paddingBottom: "3%" }} elevation={4}>
          <StepDetals workSpace={this.props.match.params.name} activeStep={this.state.activeStep} />
          <Grid container spacing={24} style={{ marginTop: "1%", marginLeft: "12%" }}>
            <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "30px" }}>
              <Typography gutterBottom variant="h5" component="h2">
                {translate("common.page.label.positiveTocken")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={2} sm={2} lg={2} xl={2} style={{ paddingTop: "30px" }}>
              <FormControlLabel
                control={<Checkbox checked={this.state.positiveChecked} color="primary" onChange={this.handleSwitchChange("positiveChecked")} />}
                label={translate("common.page.select.fromPrevious")}
              />
            </Grid>
            <Grid item xs={7} sm={7} lg={7} xl={7}>
              <Grid container spacing={8}>
                <Grid item xs={1} sm={1} lg={1} xl={1}>
                  <Typography gutterBottom variant="h5" component="h2" style={{ paddingTop: "28px" }}>
                    {translate("uploadTocken.page.label.or")}
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={4} lg={3} xl={3}>
                  <FileUpload
                    accept=".csv"
                    buttonName="Upload"
                    disabled={this.state.positiveChecked}
                    handleChange={this.handleChange.bind(this)}
                    name="positiveToken"
                  />
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "-35px" }}>
                  <br />
                  <br />

                  <TextField
                    value={this.state.positiveToken}
                    id="outlined-name"
                    disabled
                    margin="normal"
                    variant="outlined"
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2} sm={2} lg={2} xl={2} style={{ marginTop: "30px" }}>
              <Typography gutterBottom variant="h5" component="h2">
                {translate("uploadTocken.page.label.negativeTocken")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={2} sm={2} lg={2} xl={2} style={{ paddingTop: "30px" }}>
              <FormControlLabel
                control={<Checkbox checked={this.state.negativeChecked} color="primary" onChange={this.handleSwitchChange("negativeChecked")} />}
                label={translate("common.page.select.fromPrevious")}
              />
            </Grid>
            <Grid item xs={7} sm={7} lg={7} xl={7}>
              <Grid container spacing={8}>
                <Grid item xs={1} sm={1} lg={1} xl={1}>
                  <Typography gutterBottom variant="h5" component="h2" style={{ paddingTop: "28px" }}>
                    {translate("uploadTocken.page.label.or")}
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={4} lg={3} xl={3}>
                  <FileUpload
                    accept=".csv"
                    disabled={this.state.negativeChecked}
                    buttonName="Upload"
                    handleChange={this.handleChange.bind(this)}
                    name="negativeToken"
                  />
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "-35px" }}>
                  <br />
                  <br />

                  <TextField
                    value={this.state.negativeToken}
                    id="outlined-name"
                    disabled
                    margin="normal"
                    variant="outlined"
                    style={{ width: "100%" }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "56px" }}>
              <Typography variant="subtitle2" color="inherit" style={{ textAlign: "justify", color: "#ACACAC", width: "80%", marginLeft: "2px" }}>
                {this.state.processData}
              </Typography>
              <br />
            </Grid>

            <Grid item xs={7} sm={7} lg={7} xl={7}>
              <Grid container spacing={8}>
                <Grid item xs={1} sm={1} lg={1} xl={1} />
                <Grid item xs={8} sm={8} lg={8} xl={8} style={{ marginTop: "40px" }}>
                  <Button variant="contained" color="primary" style={{ width: "87%", height: "60px" }} onClick={this.handleSubmit.bind(this)}>
                    {translate("common.page.button.next")}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>

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
  uploadTokenValue: state.uploadTokenValue,
  fetchWorkspaceDetails: state.fetchWorkspaceDetails
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UploadToken));
