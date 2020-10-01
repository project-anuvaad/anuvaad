import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import TabDetals from "./WorkspaceDetailsTab";
import StepDetals from "./TockenExtractionSteps";
import history from "../../../../web.history";
import FetchWorkspaceDetails from "../../../../flux/actions/apis/fetchworkspacedetails";
import { translate } from "../../../../assets/localisation";

class ApplyToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      processData: translate("common.page.processData.pressNext"),
      activeStep: 0,
      workspaceDetails: ""
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
  }

  handleSubmit() {
    history.push(`${process.env.PUBLIC_URL}/upload-token/${this.props.match.params.name}/${this.props.match.params.session_id}`);
  }

  handleChange = (key, event) => {
    this.setState({
      [key]: event.target.files[0],
      configName: key === "configFile" ? event.target.files[0].name : this.state.configName,
      csvName: key === "csvFile" ? event.target.files[0].name : this.state.csvName
    });
  };

  render() {
    return (
      <div>
        <TabDetals activeStep={this.state.value} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }} />
        <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "3%", paddingTop: "10px", paddingBottom: "3%" }} elevation={4}>
          <StepDetals workSpace={this.props.match.params.name} activeStep={this.state.activeStep} />
          <Grid container spacing={24} style={{ marginTop: "3%", marginLeft: "12%" }}>
            <Grid item xs={4} sm={4} lg={4} xl={4}>
              <Typography gutterBottom variant="title" component="h2">
                {translate("common.page.label.positiveTocken")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={7} sm={7} lg={7} xl={7}>
              <Grid container spacing={8}>
                <Grid item xs={1} sm={1} lg={1} xl={1} />
                <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "-10px" }}>
                  <a
                    href={`${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org"}/download/${
                      this.state.workspaceDetails.token_file
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="primary" style={{ width: "85%", height: "56px" }}>
                      {translate("common.page.button.download&View")}
                    </Button>{" "}
                  </a>
                </Grid>

                <Grid item xs={5} sm={5} lg={5} xl={5}>
                  <Typography gutterBottom variant="title" component="h2">
                    {translate("common.page.label.found")} {this.state.workspaceDetails.token_count ? this.state.workspaceDetails.token_count : 0}{" "}
                    {translate("common.page.label.tokens")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "40px" }}>
              <Typography gutterBottom variant="title" component="h2">
                {translate("uploadTocken.page.label.negativeTocken")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={7} sm={7} lg={7} xl={7} style={{ marginTop: "30px" }}>
              <Grid container spacing={8}>
                <Grid item xs={1} sm={1} lg={1} xl={1} />
                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <a
                    href={`${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org"}/download/${
                      this.state.workspaceDetails.negative_token_file
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="primary" style={{ width: "85%", height: "56px" }}>
                      {translate("common.page.button.download&View")}
                    </Button>{" "}
                  </a>
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <Typography gutterBottom variant="title" component="h2" style={{ marginTop: "10px" }}>
                    {translate("common.page.label.found")}
                    {this.state.workspaceDetails.negative_token_count ? this.state.workspaceDetails.negative_token_count : 0}{" "}
                    {translate("common.page.label.tokens")}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "56px" }}>
              <Typography variant="subtitle1" color="inherit" style={{ textAlign: "justify", color: "#ACACAC", width: "80%", marginLeft: "2px" }}>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ApplyToken));
