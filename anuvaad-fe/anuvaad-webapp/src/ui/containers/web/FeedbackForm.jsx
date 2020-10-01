import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import StarRatings from "react-star-ratings";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import FetchQuestions from "../../../flux/actions/apis/fetchfeedbackpending";
import SaveFeedback from "../../../flux/actions/apis/savefeedback";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import history from "../../../web.history";
import Snackbar from "../../components/web/common/Snackbar";
import { translate } from "../../../assets/localisation";

class FeedbackForm extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      value: "var",
      questionList: [],
      rating: 0,
      title: ""
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchQuestions();
    APITransport(apiObj);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.feedbackQuestions !== this.props.feedbackQuestions) {
      this.setState({
        questionList: this.props.feedbackQuestions.feedback_questions,
        title: this.props.feedbackQuestions.title,
        basename: this.props.feedbackQuestions.basename
      });
    }
    if (prevProps.createWorkspaceDetails !== this.props.createWorkspaceDetails) {
      this.setState({ open: true, message1: translate("feedback.page.text.feedbackSubmitted") });
      setTimeout(() => {
        this.setState({ open: false });
        if (this.props.match.params.page === "translate") {
          history.push("/doctranslate");
        } else if (this.props.match.params.page === "upload") {
          history.push("/viewtranslate");
        }
      }, 3000);
    }
  }

  handleSubmit() {
    let count = 0;
    this.state.questionList.map((el, i) => (count = "answer" in el ? count + 1 : count));
    if (count === this.state.questionList.length) {
      const { APITransport } = this.props;
      const apiObj = new SaveFeedback(this.state.questionList, this.state.basename);
      APITransport(apiObj);
    } else {
      alert(translate("feedback.page.text.feedbackAlert"));
    }
  }

  handleRadioChange = (i, event) => {
    const a = [...this.state.questionList];
    a[i].answer = event.target.value;
    this.setState({ questionList: a });
  };

  changeRating(newRating, name) {
    const a = [...this.state.questionList];
    a[name].answer = newRating;
    this.setState({ questionList: a });
  }

  form() {
    return this.state.questionList.map((el, i) => (
      <Grid container spacing={24} style={{ marginTop: "1 %", marginLeft: "12%" }} key={i}>
        <Grid item xs={4} sm={4} lg={4} xl={4}>
          <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
            {el.question}
          </Typography>
          <br />
        </Grid>
        <Grid item xs={7} sm={7} lg={7} xl={7} style={{ paddingTop: "27px" }}>
          {el.type === "Rating" ? (
            <StarRatings
              rating={this.state.questionList[i].answer ? this.state.questionList[i].answer : 0}
              starRatedColor="red"
              name={i.toString()}
              changeRating={this.changeRating.bind(this)}
              numberOfStars={10}
            />
          ) : (
            <FormControl component="fieldset">
              <RadioGroup
                aria-label="position"
                style={{ height: "20px" }}
                value={this.state.questionList[i].answer && this.state.questionList[i].answer}
                onChange={this.handleRadioChange.bind(this, i)}
                row
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio style={{ color: "red", marginLeft: "10%" }} />}
                  label={translate("common.page.label.yes")}
                  labelPlacement="end"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio style={{ color: "red", marginLeft: "100%" }} />}
                  label={translate("common.page.label.no")}
                  labelPlacement="end"
                />
              </RadioGroup>
            </FormControl>
          )}
        </Grid>
      </Grid>
    ));
  }

  render() {
    return (
      <div>
        {Object.getOwnPropertyNames(this.props.feedbackQuestions).length ? (
          <Paper style={{ marginLeft: "3%", marginRight: "10%", marginTop: "1%", paddingTop: "5px", paddingBottom: "3%" }} elevation={4}>
            <Typography
              gutterBottom
              variant="title"
              component="h2"
              style={{
                marginTop: "-.7%",
                paddingLeft: "33%",
                background: '#ECEFF1',
                paddingTop: "25px",
                paddingBottom: "16px"
              }}
            >
              {translate("feedbackForm.page.label.feedbackFor")} {this.state.title}
            </Typography>
            {this.form()}

            <Grid container spacing={24} style={{ marginTop: "1 %", marginLeft: "12%" }}>
              <Grid item xs={5} sm={5} lg={5} xl={5}>
                <Typography
                  variant="subtitle2"
                  color="inherit"
                  style={{ textAlign: "justify", color: "#ACACAC", marginTop: "10%", width: "80%", marginLeft: "2px" }}
                />
                <br />
              </Grid>

              <Grid item xs={4} sm={4} lg={4} xl={4}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "62%", marginTop: "6%", height: "56px" }}
                  onClick={this.handleSubmit.bind(this)}
                >
                  {translate("common.page.button.submit")}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          ""
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
  feedbackQuestions: state.feedbackQuestions,
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FeedbackForm));
