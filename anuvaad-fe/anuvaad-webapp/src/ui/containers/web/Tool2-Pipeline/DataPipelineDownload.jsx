import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import BackIcon from "@material-ui/icons/ChevronLeft";
import FetchWorkspaceDetails from "../../../../flux/actions/apis/fetchworkspacedetails";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import history from "../../../../web.history";
import { translate } from "../../../../assets/localisation";

class DataPipelineDownload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      activeStep: 2
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

  handleChange = (key, event) => {
    this.setState({
      activeStep: 3,
      [key]: event.target.files[0],
      configName: key === "configFile" ? event.target.files[0].name : this.state.configName,
      csvName: key === "csvFile" ? event.target.files[0].name : this.state.csvName
    });
  };

  render() {
    return (
      <div>
        <Toolbar style={{ marginTop: "20px", marginRight: "3%", marginLeft: "3%", padding: "0px" }}>
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

        <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "2%", paddingTop: "10px", paddingBottom: "3%" }} elevation={4}>
          <Grid container spacing={24} style={{ marginTop: "3%", marginLeft: "12%" }}>
            <Grid item xs={4} sm={4} lg={4} xl={4}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {translate("common.page.label.workSpaceName")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={7} sm={7} lg={7} xl={7}>
              <TextField
                disabled
                value={this.props.match.params.name}
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

            <Grid item xs={4} sm={4} lg={4} xl={4} style={{ marginTop: "10px" }}>
              <Typography gutterBottom variant="title" component="h2">
                {translate("sentenceExtraction.page.label.ExtractedSent")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={7} sm={7} lg={7} xl={7} style={{ marginTop: "30px" }}>
              <Grid container spacing={8}>
                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <a
                    href={`${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org"}/download/${
                      this.state.workspaceDetails ? this.state.workspaceDetails.sentence_file : ""
                    }`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button variant="contained" color="primary" style={{ width: "85%", height: "56px", marginTop: "-33px" }}>
                      {translate("common.page.button.download&View")}
                    </Button>{" "}
                  </a>
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <Typography gutterBottom variant="title" component="h2" style={{ marginTop: "-20px" }}>
                    {translate("common.page.label.found")} {this.state.workspaceDetails && this.state.workspaceDetails.sentence_count}{" "}
                    {translate("common.page.label.sentence")}
                  </Typography>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataPipelineDownload));
