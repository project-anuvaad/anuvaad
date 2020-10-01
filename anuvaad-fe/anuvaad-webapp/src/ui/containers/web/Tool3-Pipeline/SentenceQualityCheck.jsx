import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "../../../components/web/common/Snackbar";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import TabDetals from "./WorkspaceDetailsTab";
import FetchSearch from "../../../../flux/actions/apis/fetchsearchreplace";
import FetchSearchReplace from "../../../../flux/actions/apis/sentencereplace";
import AcceptAll from "../../../../flux/actions/apis/acceptallsentence";
import history from "../../../../web.history";
import { translate } from "../../../../assets/localisation";

const styles = theme => ({
  card: {
    color: "#9C27B0",
    fontSize: 18
  }
});

class SentenceQualityCheck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 1,
      target: "",
      source: "",
      sentence: "",
      sentenceDetails: "",
      selectedWorkspaces: [],
      workspaceName: "",
      sourceLanguage: [],
      language: [],
      step: 1,
      check: false,
      count: 1,
      message1: translate("common.page.label.message"),
      csvData: translate("tool3.sentenceExtraction.label.htStepSkipped"),
      processData: translate("common.page.processData.pressNextToSelect")
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchSearch(this.props.match.params.session_id);
    APITransport(apiObj);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchSearch !== this.props.fetchSearch) {
      if (!Object.getOwnPropertyNames(this.props.fetchSearch.data).length) {
        if (this.state.check) {
          this.setState({ open: true, sentence: {}, message1: translate("common.page.label.processCompleted") });
          setTimeout(() => {
            history.push(`${process.env.PUBLIC_URL}/stage3/existing-workspace`);
          }, 2000);
        } else {
          alert(translate("tool3.sentenceQualityCheck.label.workspaceEmpty"));
          history.push(`${process.env.PUBLIC_URL}/stage3/workspace-details`);
        }
      }
      this.setState({ sentence: this.props.fetchSearch.data, count: this.props.fetchSearch.count });
    }

    if (prevProps.sentenceReplace !== this.props.sentenceReplace) {
      if (this.state.count !== 1) {
        const { APITransport } = this.props;
        this.setState({ check: true });
        const apiObj = new FetchSearch(this.props.match.params.session_id);
        APITransport(apiObj);
      } else {
        this.setState({ open: true, sentence: {}, message1: translate("common.page.label.processCompleted") });
        setTimeout(() => {
          history.push(`${process.env.PUBLIC_URL}/stage3/existing-workspace`);
        }, 2000);
      }
    }
  }

  handleTextChange(key, event) {
    const sentenceList = this.state.sentence;
    sentenceList[key] = event.target.value;
    this.setState({
      sentence: sentenceList,
      name: key
    });
  }

  handleSubmit = (value, val) => {
    if (val) {
      value.accepted = true;
    }
    const { APITransport } = this.props;
    const apiObj = new FetchSearchReplace(value);
    APITransport(apiObj);
  };

  handleSubmitAll = (value, val) => {
    const { APITransport } = this.props;
    if (value.changes && value.changes.length > 0) {
      const apiObj = new AcceptAll(value);
      APITransport(apiObj);
    } else {
      alert(translate("tool3.sentenceQualityCheck.label.noSentenceToAccept"));
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <TabDetals activeStep={this.state.value} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }} />
        <Paper style={{ marginLeft: "3%", marginRight: "3%", marginTop: "3%", paddingTop: "10px", paddingBottom: "3%" }} elevation={4}>
          <Grid container spacing={24} style={{ marginTop: "3%", marginLeft: "12%" }}>
            <Grid item xs={4} sm={4} lg={4} xl={4}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {translate("common.page.label.workSpaceName")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={8} sm={8} lg={8} xl={8}>
              <Card style={{ width: "70%" }} className={classes.card}>
                <CardContent>{this.props.match.params.name}</CardContent>
              </Card>
            </Grid>

            <Grid item xs={2} sm={2} lg={2} xl={2}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "100%", paddingTop: "30px" }}>
                {translate("tool3.sentenceQualityCheck.label.foundSentences")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={2} sm={2} lg={2} xl={2}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {this.state.sentence.found_sentences && `${this.state.sentence.found_sentences} / ${this.state.sentence.total_sentences}`}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={8} sm={8} lg={8} xl={8}>
              <Card style={{ width: "70%" }} className={classes.card}>
                <CardContent>
                  {this.state.sentence.source &&
                    (this.state.sentence.found_sentences && this.state.sentence.changes && Array.isArray(this.state.sentence.changes)
                      ? this.state.sentence.changes.map(changes => (
                          <p key={changes.source_search}>
                            {`Source ngram : ${changes.source_search}, Target ngram : ${changes.target_search}, Replacement ngram : ${changes.replace}`}
                          </p>
                        ))
                      : `Source ngram : ${this.state.sentence.source_search}, Target ngram : ${this.state.sentence.target_search}, Replacement ngram : ${this.state.sentence.replace}`)}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={4} sm={4} lg={4} xl={4}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {translate("commonCorpus.page.text.sourceSentence")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={8} sm={8} lg={8} xl={8}>
              <Card style={{ width: "70%", marginTop: "15px" }} className={classes.card}>
                <CardContent>{this.state.sentence.source}</CardContent>
              </Card>
            </Grid>

            <Grid item xs={4} sm={4} lg={4} xl={4}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {translate("commonCorpus.page.text.targetSentence")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={8} sm={8} lg={8} xl={8}>
              <TextField
                value={this.state.sentence.target ? this.state.sentence.target : ""}
                required
                multiline
                id="outlined-name"
                margin="normal"
                onChange={event => {
                  this.handleTextChange("target", event);
                }}
                variant="outlined"
                style={{ width: "70%" }}
              />
            </Grid>

            <Grid item xs={4} sm={4} lg={4} xl={4}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {translate("tool3.sentenceQualityCheck.label.replacedSentence")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={8} sm={8} lg={8} xl={8}>
              <Card style={{ width: "70%" }} className={classes.card}>
                <CardContent>{this.state.sentence.updated}</CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Typography
                variant="subtitle2"
                color="inherit"
                style={{ textAlign: "center", color: "#ACACAC", marginRight: "20%", marginTop: "10px" }}
              >
                {this.state.csvData}
              </Typography>
            </Grid>

            <Grid item xs={3} sm={3} lg={3} xl={3}>
              <Button
                variant="contained"
                color="primary"
                value="rejected"
                style={{ width: "90%", marginLeft: "50px", marginTop: "3%", height: "56px" }}
                onClick={event => {
                  this.handleSubmit(this.state.sentence, false);
                }}
              >
                {this.state.count > 1 ? "Ignore and Next" : "Ignore"}
              </Button>
            </Grid>
            <Grid item xs={3} sm={3} lg={3} xl={3}>
              <Button
                variant="contained"
                value="accepted"
                color="primary"
                style={{ width: "90%", marginLeft: "25px", marginTop: "3%", height: "56px" }}
                onClick={event => {
                  this.handleSubmit(this.state.sentence, true);
                }}
              >
                {this.state.count > 1 ? "Accept and Next" : "Accept"}
              </Button>
            </Grid>
            <Grid item xs={3} sm={3} lg={3} xl={3}>
              <Button
                variant="contained"
                value="accepted"
                color="primary"
                style={{ width: "90%", marginTop: "3%", height: "56px" }}
                onClick={event => {
                  this.handleSubmitAll(this.state.sentence, true);
                }}
              >
                {translate("tool3.sentenceQualityCheck.label.acceptAll")}{" "}
                {this.state.sentence.changes && this.state.sentence.changes.length > 0 && this.state.sentence.changes[0].source_search}
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {this.state.open && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={2000}
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
  fetchSearch: state.fetchSearch,
  sentenceReplace: state.sentenceReplace
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(SentenceQualityCheck)));
