import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Fab from "@material-ui/core/Fab";
import DeleteIcon from "@material-ui/icons/Delete";
import Snackbar from "../../components/web/common/Snackbar";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import QuestionUpload from "../../../flux/actions/apis/questionupload";
import FetchQuestions from "../../../flux/actions/apis/fetchquestions";
import { translate } from "../../../assets/localisation";

class AddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questionType: "",
      question: "",
      questionTypeList: ["Rating", "Yes/No"],
      message1: translate("addQuestion.page.message.questionListUpdated"),
      values: [],
      questionList: [],
      open: false
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchQuestions();
    APITransport(apiObj);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.feedbackQuestions !== this.props.feedbackQuestions) {
      this.setState({ questionList: this.props.feedbackQuestions });
    }

    if (prevProps.createWorkspaceDetails !== this.props.createWorkspaceDetails) {
      this.setState({ open: true, message1: translate("addQuestion.page.message.questionListUpdated") });
      setTimeout(() => {
        this.setState({ open: false });
      }, 3000);
    }
  }

  handleTextChange(event, i) {
    const questionList = [...this.state.questionList];
    questionList[i].question = event.target.value;

    this.setState({ questionList });
  }

  handleSelectChange = (event, i) => {
    const questionList = [...this.state.questionList];

    const data = this.state.questionList.length >= i + 1 ? this.state.questionList[i] : {};
    data.type = event.target.value;
    questionList[i] = data;

    this.setState({ questionList });
  };

  handleDelete(event, i) {
    const questionList = [...this.state.questionList];
    questionList[i].status = "DELETED";
    this.setState({ questionList, open: true, message1: translate("addQuestion.page.message.deleteList") });
    setTimeout(() => {
      this.setState({ open: false });
    }, 3000);
    this.handleSubmit();
  }

  addClick() {
    this.setState(prevState => ({ questionList: [...prevState.questionList, { question: "", type: "", status: "" }] }));
  }

  handleSubmit() {
    const { APITransport } = this.props;
    let count = 0;
    this.state.questionList.map((el, i) => {
      if (el.question && el.type) {
        count += 1;
      }
      return true;
    });

    if (count === this.state.questionList.length) {
      const apiObj = new QuestionUpload(this.state.questionList);
      APITransport(apiObj);
    } else {
      alert(translate("addQuestion.page.alert.questionError"));
    }
  }

  form() {
    return this.state.questionList.map(
      (el, i) =>
        el.status !== "DELETED" && (
          <Grid container spacing={24} style={{ marginTop: "1 %", marginLeft: "12%" }}>
            <Grid item xs={5} sm={5} lg={5} xl={5}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "65%", paddingTop: "30px" }}>
                {translate("addQuestion.page.label.question")}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <TextField
                value={el.question || ""}
                required
                multiline
                type="text"
                id="outlined-name"
                margin="normal"
                onChange={event => {
                  this.handleTextChange(event, i);
                }}
                variant="outlined"
                style={{ width: "60%" }}
              />{" "}
              <Fab
                color="red"
                aria-label="Delete"
                onClick={event => {
                  this.handleDelete(event, i);
                }}
                style={{ marginTop: "2.1%", backgroundColor: "white", color: "red" }}
              >
                <DeleteIcon />
              </Fab>
            </Grid>

            <Grid item xs={5} sm={5} lg={5} xl={5}>
              <Typography gutterBottom variant="title" component="h2" style={{ width: "80%", paddingTop: "25px" }}>
                {translate("addQuestion.page.label.questionType")} &emsp;&emsp;{" "}
              </Typography>
              <br />
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{ height: "56px" }}>
              <Select
                style={{ width: "60%", marginTop: "5px" }}
                value={this.state.questionList && this.state.questionList[i] && el.type ? el.type : ""}
                onChange={event => {
                  this.handleSelectChange(event, i);
                }}
                input={<OutlinedInput name="questionType" id="outlined-age-simple" />}
              >
                {this.state.questionTypeList.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        )
    );
  }

  render() {
    return (
      <div>
        <Paper style={{ margin: "1% 3%", paddingTop: "5px", paddingBottom: "1%" }} elevation={4}>
          <Typography
            gutterBottom
            variant="title"
            component="h2"
            style={{
              marginTop: "-.7%",
              paddingLeft: "44%",
              background: '#ECEFF1',
              paddingTop: "25px",
              paddingBottom: "16px"
            }}
          >
            {translate("addQuestion.page.label.addQuestion")}
          </Typography>
          <br />
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

            <Grid item xs={2} sm={2} lg={2} xl={2}>
              <Button
                variant="contained"
                color="primary"
                style={{ width: "80%", marginTop: "6%", height: "46px", borderRadius: "20px" }}
                onClick={this.addClick.bind(this)}
              >
                {translate("common.page.button.add")}
              </Button>
            </Grid>
            {this.state.questionList.length > 0 && (
              <Grid item xs={2} sm={2} lg={2} xl={2}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "81%", marginTop: "6%", height: "46px", borderRadius: "20px"  }}
                  onClick={this.handleSubmit.bind(this)}
                >
                  {translate("common.page.button.submit")}
                </Button>
              </Grid>
            )}
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
  createWorkspaceDetails: state.createWorkspaceDetails,
  feedbackQuestions: state.feedbackQuestions
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddQuestion));
