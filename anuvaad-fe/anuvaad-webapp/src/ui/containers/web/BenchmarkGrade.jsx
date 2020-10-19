import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ReadMoreAndLess from "react-read-more-less";
import Divider from "@material-ui/core/Divider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { CSVDownload } from "react-csv";
import StarRatingComponent from "react-star-rating-component";
import { Tooltip } from "@material-ui/core";
import Pagination from "material-ui-flat-pagination";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import FetchBenchmarkModel from "../../../flux/actions/apis/fetchenchmarkmodel";
import UpdateSentencesGrade from "../../../flux/actions/apis/upgrade-sentence-grade";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import Dialog from "../../components/web/common/SimpleDialog";
import { translate } from "../../../assets/localisation";

const theme = createMuiTheme();
class BenchmarkGrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputStatus: "ALL",
      apiCall: false,
      pending: null,
      PendingpageNumber: 1,
      AllPageNumber: 1,
      score: {},
      apiCalled: false,
      sentences: [],
      pageCount: 5,
      status: "",
      page: 0,
      offset: 0,
      tocken: false,
      MenuItemValues: ["All", "Pending"],
      TableHeaderValues: ["Source Sentence", "Target Sentence", "Machine translated reference", "Grade"],
      TableHeaderDescription: [
        "Source Sentence",
        "Target Sentence",
        "how good the contextual meaning of the sentence",
        "How well sequenced and properly framed the output is, given the meaning was conveyed",
        "Vocabulary/Lexicon- This  captures two things- first, proper words to express the meaning of those sentences, including correct proper nouns(names, places etc.). Secondly, it includes if the output contains more better words i.e a better synonym, this is helpful in relative comparison, when you want to give more weight to न्यायाधीश in comparison to जस्टिस",
        this.props.match.params.basename === "1570785751" ? "How much accurately name are translated" : "Aggrecate Score",
        "Aggrecate Score"
      ],

      role: JSON.parse(localStorage.getItem("roles"))
    };
  }

  componentDidMount() {
    this.setState({
      TableHeaderValues: [
        "Source Sentence",
        "Target Sentence",
        "Meaning of sentence",
        "Structure of sentence",
        "Vocabulary / Lexicon",
        this.props.match.params.basename === "1570785751" ? "Names Accuracy" : "Aggregate score",
        "Aggregate score",
        "Comments"
      ]
    });
    if (this.props.match.params.basename && this.props.match.params.modelid && !this.state.dialogOpen) {
      const api = new FetchBenchmarkModel(
        this.props.match.params.basename,
        this.props.match.params.modelid,
        this.state.pageCount,
        this.state.offset + 1
      );

      this.props.APITransport(api);
    }
  }

  handleChangePage = (event, offset) => {
    const value = this.state.tocken ? (!!this.state.apiCall) : true;
    this.setState({ offset, lock: false, dialogOpen: !!this.state.tocken });
    if (this.props.match.params.basename && value) {
      const api = new FetchBenchmarkModel(
        this.props.match.params.basename,
        this.props.match.params.modelid,
        this.state.pageCount,
        offset + 1,
        this.state.inputStatus
      );
      this.props.APITransport(api);
    }
  };

  handleStatusChange = event => {
    const value = this.state.tocken ? (!!this.state.apiCall) : true;
    event.target.value === "ALL" && this.setState({ AllPageNumber: this.state.offset + 1 });
    this.setState({ inputStatus: event.target.value, offset: 0, dialogOpen: !!this.state.tocken });
    if (value) {
      const api = new FetchBenchmarkModel(
        this.props.match.params.basename,
        this.props.match.params.modelid,
        this.state.pageCount,
        event.target.value === "PENDING" ? 1 : this.state.AllPageNumber,
        event.target.value
      );
      this.props.APITransport(api);
    }
  };

  handleSelectChange = event => {
    const value = this.state.tocken ? (!!this.state.apiCall) : true;
    this.setState({ pageCount: event.target.value, offset: 0, dialogOpen: !!this.state.tocken });
    if (value) {
      const api = new FetchBenchmarkModel(
        this.props.match.params.basename,
        this.props.match.params.modelid,
        event.target.value,
        1,
        this.state.inputStatus
      );
      this.props.APITransport(api);
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.updateGrade !== this.props.updateGrade) {
      const apivalue = new FetchBenchmarkModel(
        this.props.match.params.basename,
        this.props.match.params.modelid,
        this.state.pageCount,
        this.state.offset + 1,
        this.state.inputStatus
      );
      this.props.APITransport(apivalue);
    }

    if (prevProps.fetchBenchmarkModel !== this.props.fetchBenchmarkModel) {
      this.setState({
        apiCall: false,
        sentenceCancel: prevProps.fetchBenchmarkModel.data,
        sentences: this.props.fetchBenchmarkModel.data,
        count: this.props.fetchBenchmarkModel.count,
        score: this.props.fetchBenchmarkModel.sum,
        pending: this.props.fetchBenchmarkModel.pending
      });
    }
  }

  handleChange = (name, index) => event => {
    const sentence = this.state.sentences;
    sentence[index].comments = event.target.value;
    this.setState({ sentences: sentence });
    this.setState({ comments: event.target.value, sentences: sentence, tocken: true });
  };

  handleStarClick(nextValue, prevValue, name) {
    const sentence = this.state.sentences;
    sentence[parseInt(name, 10)].rating = nextValue;
    this.setState({ sentences: sentence });
    this.setState({ rating: nextValue, sentences: sentence, tocken: true });
  }

  handleNameStarClick(nextValue, prevValue, name) {
    const sentence = this.state.sentences;
    sentence[parseInt(name, 10)].name_accuracy_rating = nextValue;
    this.setState({ sentences: sentence });
    this.setState({ name_accuracy_rating: nextValue, sentences: sentence, tocken: true });
  }

  handleSpellStarClick(nextValue, prevValue, name) {
    const sentence = this.state.sentences;
    sentence[parseInt(name, 10)].spelling_rating = nextValue;
    this.setState({ spelling_rating: nextValue, sentences: sentence, tocken: true });
  }

  handleContextStarClick(nextValue, prevValue, name) {
    const sentence = this.state.sentences;
    sentence[parseInt(name, 10)].context_rating = nextValue;
    this.setState({ context_rating: nextValue, sentences: sentence, tocken: true });
  }

  handleSubmit = () => {
    const api = new UpdateSentencesGrade(this.state.sentences, this.props.match.params.modelid);
    this.setState({ dialogOpen: false, apiCall: true, tocken: false });
    this.props.APITransport(api);
  };

  handleClose = () => {
    const api = new UpdateSentencesGrade(this.state.sentenceCancel, this.props.match.params.modelid);
    this.setState({ dialogOpen: false, apiCall: true, tocken: false });
    this.props.APITransport(api);
  };

  calculateScore() {
    const result =
      this.props.match.params.basename === "1570785239"
        ? ((this.state.score.context_rating ? this.state.score.context_rating * 2 : 0) +
            (this.state.score.spelling_rating ? this.state.score.spelling_rating * 6 : 0) +
            (this.state.score.grammer_grade ? this.state.score.grammer_grade * 2 : 0)) /
          10
        : this.props.match.params.basename === "1570785751"
        ? ((this.state.score.context_rating ? this.state.score.context_rating * 2 : 0) +
            (this.state.score.spelling_rating ? this.state.score.spelling_rating * 1 : 0) +
            (this.state.score.grammer_grade ? this.state.score.grammer_grade * 1 : 0) +
            (this.state.score.name_accuracy_rating ? this.state.score.name_accuracy_rating * 6 : 0)) /
          10
        : (this.state.score.context_rating * 6 + this.state.score.grammer_grade * 3 + this.state.score.spelling_rating * 1) / 10;
    return result;
  }

  render() {
    const CorpusDetails = (
      <TableBody>
        {this.state.sentences &&
          Array.isArray(this.state.sentences) &&
          this.state.sentences.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                <ReadMoreAndLess
                  ref={this.ReadMore}
                  className="read-more-content"
                  readMoreText={translate("commonCorpus.page.text.readMore")}
                  readLessText=""
                >
                  {row.source}
                </ReadMoreAndLess>
              </TableCell>
              <TableCell>
                <ReadMoreAndLess
                  ref={this.ReadMore}
                  className="read-more-content"
                  readMoreText={translate("commonCorpus.page.text.readMore")}
                  readLessText=""
                >
                  {row.target}
                </ReadMoreAndLess>
              </TableCell>

              <TableCell>
                <div style={{ width: "100px" }}>
                  <StarRatingComponent
                    name={index.toString()}
                    starCount={5}
                    value={row.context_rating ? row.context_rating : 0}
                    onStarClick={this.handleContextStarClick.bind(this)}
                  />
                </div>
              </TableCell>

              <TableCell>
                <div style={{ width: "100px" }}>
                  <StarRatingComponent
                    name={index.toString()}
                    starCount={5}
                    value={row.rating ? row.rating : 0}
                    onStarClick={this.handleStarClick.bind(this)}
                  />
                </div>
              </TableCell>

              <TableCell>
                <div style={{ width: "110px" }}>
                  <StarRatingComponent
                    name={index.toString()}
                    starCount={5}
                    value={row.spelling_rating ? row.spelling_rating : 0}
                    onStarClick={this.handleSpellStarClick.bind(this)}
                  />
                </div>
              </TableCell>

              {this.props.match.params.basename === "1570785751" && (
                <TableCell>
                  <div style={{ width: "110px" }}>
                    <StarRatingComponent
                      name={index.toString()}
                      starCount={5}
                      value={row.name_accuracy_rating ? row.name_accuracy_rating : 0}
                      onStarClick={this.handleNameStarClick.bind(this)}
                    />
                  </div>
                </TableCell>
              )}

              <TableCell>
                <div style={{ width: "40px" }}>
                  {this.props.match.params.basename === "1570785239"
                    ? ((row.context_rating ? row.context_rating * 2 : 0) +
                        (row.spelling_rating ? row.spelling_rating * 6 : 0) +
                        (row.rating ? row.rating * 2 : 0)) /
                      10
                    : this.props.match.params.basename === "1570785751"
                    ? ((row.context_rating ? row.context_rating * 2 : 0) +
                        (row.spelling_rating ? row.spelling_rating * 1 : 0) +
                        (row.rating ? row.rating * 1 : 0) +
                        (row.name_accuracy_rating ? row.name_accuracy_rating * 6 : 0)) /
                      10
                    : ((row.context_rating ? row.context_rating * 6 : 0) +
                        (row.spelling_rating ? row.spelling_rating * 1 : 0) +
                        (row.rating ? row.rating * 3 : 0)) /
                      10}
                </div>
              </TableCell>
              <TableCell>
                <div style={{ width: "210px" }}>
                  <TextField
                    id="standard-multiline-flexible"
                    multiline
                    rowsMax="4"
                    value={row.comments ? row.comments : ""}
                    onChange={this.handleChange("comments", index)}
                    margin="normal"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    );

    return (
      <div>
        {this.state.download ? <CSVDownload data={this.state.downloadData} target="_blank" /> : ""}
        <Grid container spacing={24} style={{ padding: 5 }}>
          <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "38px" }}>
            <Toolbar style={{ marginRight: "-1.2%", paddingBottom: "2%" }}>
              <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
              <Typography variant="h6" gutterBottom>
                {translate("common.page.text.rowsPerPage")}&nbsp;&nbsp;&nbsp;&nbsp;
                <Select width="50%" value={this.state.pageCount} onChange={this.handleSelectChange} displayEmpty>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                </Select>
              </Typography>
            </Toolbar>
            <Paper>
              <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Grid container spacing={24} style={{ padding: 5 }}>
                  <Grid item xs={3} sm={3} lg={3} xl={3}>
                    <Typography variant="h5" color="inherit" style={{ paddingBottom: "8px", paddingLeft: "15px", flex: 1 }}>
                      {this.state.pending === 0 ? translate("benchmarkGrade.page.label.totalGrade") + this.calculateScore() : null}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} lg={3} xl={3}>
                    <Typography variant="h5" color="inherit" style={{ paddingBottom: "8px", flex: 1 }}>
                      {this.state.pending
                        ? (this.state.count && translate("benchMarkGrade.page.label.sentencesPending")) + (this.state.pending && this.state.pending)
                        : this.state.pending === 0 && translate("common.page.label.completed")}
                    </Typography>
                  </Grid>
                  <Grid item xs={3} sm={3} lg={2} xl={2}>
                    {translate("benchmark.page.text.statusFilter")}&nbsp;&nbsp;&nbsp;
                    <Select value={this.state.inputStatus} onChange={this.handleStatusChange} displayEmpty>
                      <MenuItem value="ALL">{translate("common.page.text.all")}</MenuItem>
                      <MenuItem value="PENDING">{translate("common.page.text.pending")}</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={4} sm={4} lg={4} xl={4}>
                    <Pagination
                      align="right"
                      limit={1}
                      offset={this.state.offset}
                      centerRipple
                      total={(this.state.inputStatus === "PENDING" ? this.state.pending : this.state.count) / this.state.pageCount}
                      onClick={(event, offset) => {
                        this.handleChangePage(event, offset);
                      }}
                    />
                  </Grid>
                </Grid>
              </MuiThemeProvider>

              <Divider />
              <Table>
                <TableHead>
                  <TableRow>
                    {this.state.TableHeaderValues.map((item, index) => this.props.match.params.basename === "1570785751" ? (
                        <Tooltip placement="top-start" enterDelay={200} key={item} title={this.state.TableHeaderDescription[index]}>
                          <TableCell width="45%">{item}</TableCell>
                        </Tooltip>
                      ) : (
                        index !== 5 && (
                          <Tooltip placement="top-start" enterDelay={200} key={item} title={this.state.TableHeaderDescription[index]}>
                            <TableCell width="45%">{item}</TableCell>
                          </Tooltip>
                        )
                      ))}
                  </TableRow>
                </TableHead>
                {CorpusDetails}
              </Table>
            </Paper>
          </Grid>
        </Grid>
        {this.state.sentences[0] && (
          <div>
            {this.state.dialogOpen && this.state.tocken && (
              <Dialog
                open={this.state.dialogOpen}
                message={translate("benchMarkGrade.page.alert.SaveChangesalert")}
                title={translate("common.page.label.saveChanges")}
                value={this.state.sentences}
                handleSubmit={this.handleSubmit}
                handleClose={this.handleClose}
              />
            )}
            <Toolbar style={{ marginRight: "3%", marginTop: "20px" }}>
              <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
              <Button
                variant="contained"
                onClick={event => {
                  this.handleSubmit(this.state.sentences);
                }}
                color="primary"
                aria-label="edit"
                style={{ width: "170px", marginBottom: "4%", marginTop: "1px" }}
              >
                {translate("common.page.button.save")}
              </Button>
            </Toolbar>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corpus: state.corpus,
  sentences: state.sentences,
  fetchBenchmarkModel: state.fetchBenchmarkModel,
  updateGrade: state.updateGrade
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BenchmarkGrade));
