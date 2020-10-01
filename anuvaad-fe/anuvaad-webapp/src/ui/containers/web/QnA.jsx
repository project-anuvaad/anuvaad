import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import Typography from "@material-ui/core/Typography";
import QNAApi from "../../../flux/actions/apis/qna";
import CircularProgress from "@material-ui/core/CircularProgress";
import { translate } from '../../../assets/localisation';

class QnA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      par: "",
      question1: "",
      question2: "",
      question3: "",
      question4: "",
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: ""
    };
  }

  componentDidMount() {
    this.setState({
      answer1: "",
      answer2: "",
      answer3: "",
      answer4: ""
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.answers !== this.props.answers) {
      this.setState({
        answer1: this.props.answers.q1,
        answer2: this.props.answers.q2,
        answer3: this.props.answers.q3,
        answer4: this.props.answers.q4
      });
    }
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSubmit() {
    const { APITransport } = this.props;

    const apiObj = new QNAApi(this.state.par, this.state.question1, this.state.question2, this.state.question3, this.state.question4);
    APITransport(apiObj);
  }

  render() {
    return (
      <div>
        <Grid container spacing={24} style={{ padding: 24 }}>
          <Grid item xs={6} sm={6} lg={6} xl={6}>
            <TextField
              onChange={event => {
                this.handleTextChange("par", event);
              }}
              id="standard-multiline-static"
              label={translate('qan.page.placeholder.englishPara')}
              multiline
              style={{ width: "100%" }}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6} sm={6} lg={6} xl={6}>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <TextField
                onChange={event => {
                  this.handleTextChange("question1", event);
                }}
                id="standard-multiline-static"
                label={translate('qan.page.placeholder.question1')}
                style={{ width: "100%" }}
                margin="normal"
              />
              {this.props.apistatus.progress ? (
                <CircularProgress />
              ) : (
                  <Typography variant="subtitle2" style={{ paddingTop: "5%" }}>
                    {translate('common.page.button.submit')} {this.state.answer1}
                  </Typography>
                )}
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <TextField
                onChange={event => {
                  this.handleTextChange("question2", event);
                }}
                id="standard-multiline-static"
                label={translate('qan.page.placeholder.question2')}
                style={{ width: "100%" }}
                margin="normal"
              />
              {this.props.apistatus.progress ? (
                <CircularProgress />
              ) : (
                  <Typography variant="subtitle2" style={{ paddingTop: "5%" }}>
                    {translate('common.page.button.submit')} {this.state.answer2}
                  </Typography>
                )}
            </Grid>

            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <TextField
                onChange={event => {
                  this.handleTextChange("question3", event);
                }}
                id="standard-multiline-static"
                label={translate('qan.page.placeholder.question3')}
                style={{ width: "100%" }}
                margin="normal"
              />
              {this.props.apistatus.progress ? (
                <CircularProgress />
              ) : (
                  <Typography variant="subtitle2" style={{ paddingTop: "5%" }}>
                    {translate('common.page.button.submit')} {this.state.answer3}
                  </Typography>
                )}
            </Grid>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <TextField
                onChange={event => {
                  this.handleTextChange("question4", event);
                }}
                id="standard-multiline-static"
                label={translate('qan.page.placeholder.question4')}
                style={{ width: "100%" }}
                margin="normal"
              />
              {this.props.apistatus.progress ? (
                <CircularProgress />
              ) : (
                  <Typography variant="subtitle2" style={{ paddingTop: "5%" }}>
                    {translate('common.page.label.ans')} {this.state.answer4}
                  </Typography>
                )}
            </Grid>
            <br></br>
            <Grid item xs={12} sm={12} lg={12} xl={12}>
              <Button onClick={this.handleSubmit.bind(this)} variant="contained" color="primary">
                {translate('common.page.button.submit')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  answers: state.answers
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(QnA)
);
