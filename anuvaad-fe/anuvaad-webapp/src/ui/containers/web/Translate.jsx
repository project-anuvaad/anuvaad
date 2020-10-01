import React from "react";
import { withRouter } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core";
import TranslateAPI from "../../../flux/actions/apis/translate";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import history from "../../../web.history";
import { translate } from "../../../assets/localisation";

class Translate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      add_name: "",
      doamin: "",
      text: "",
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
      comment: "",
      open: false,
      showLoader: false
    };
  }

  componentDidMount() {
    this.setState({
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {}
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.apistatus !== this.props.apistatus) {
      this.setState({ showLoader: true });
      setTimeout(() => {
        history.push(`${process.env.PUBLIC_URL}/translations`);
      }, 3000);
    }
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFileChange = e => {
    if (e.target.files[0]) {
      this.setState({
        file: e.target.files[0]
      });
    }
  };

  handleMultiFileChange = e => {
    if (e.target.files[0]) {
      this.setState({
        [e.target.name]: e.target.files[0]
      });
    }
  };

  handleSubmit() {
    const { APITransport } = this.props;
    const apiObj = new TranslateAPI(this.state.hindiFile);
    APITransport(apiObj);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.CorpusContainer}>
        {this.state.showLoader ? (
          <CircularProgress />
        ) : (
          <Paper style={{ margin: "5%" }} elevation={2}>
            <br />
            <Typography gutterBottom variant="h5" component="h2" className={classes.typography}>
              {translate("dashboard.page.heading.title")}
            </Typography>
            <br />
            <br />
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <label className={classes.label}>{translate("common.page.label.hindi")}</label>&nbsp;
              <input type="file" className={classes.textField} name="hindiFile" onChange={this.handleMultiFileChange.bind(this)} accept=".txt" />
              <div style={{ color: "red" }}>{this.state.hindiError}</div>
            </Grid>
            <br />
            <br />
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{ marginBottom: "5%" }}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => {
                  history.push(`${process.env.PUBLIC_URL}/translations`);
                }}
              >
                {translate("common.page.button.cancel")}
              </Button>
              <Button variant="contained" color="primary" className={classes.buttons} onClick={this.handleSubmit.bind(this)}>
                {translate("dashboard.page.heading.title")}
              </Button>
            </Grid>
          </Paper>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corpus: state.corpus
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(Translate)));
