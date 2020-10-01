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
import Pagination from "material-ui-flat-pagination";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import UpdateSentencesGrade from "../../../flux/actions/apis/upgrade-sentence-grade";
import FetchSentences from "../../../flux/actions/apis/sentences";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";

const theme = createMuiTheme();
class Corpus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiCalled: false,
      sentences: [],
      pageCount: 5,
      status: "",
      page: 0,
      offset: 0,
      TableHeaderValues: ["Source Sentence", "Target Sentence", "Machine translated reference", "Grade"],
      role: JSON.parse(localStorage.getItem("roles"))
    };
  }

  componentDidMount() {
    if (this.state.role.includes("dev")) {
      this.setState({ TableHeaderValues: ["Source Sentence", "Target Sentence", "Machine translated reference"] });
    } else {
      this.setState({
        TableHeaderValues: ["Source Sentence", "Target Sentence", "Machine translated reference", "Sentence Grade", "Spelling Grade", "Context Grade"]
      });
    }
    if (this.props.match.params.basename) {
      const api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, 1);
      this.props.APITransport(api);
    }
  }

  handleChangePage = (event, offset) => {
    this.setState({ offset, lock: false });
    if (this.props.match.params.basename) {
      const api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, offset + 1, this.state.inputStatus);
      this.props.APITransport(api);
    }
  };

  handleSelectChange = event => {
    this.setState({ pageCount: event.target.value, offset: 0 });
    const api = new FetchSentences(this.props.match.params.basename, event.target.value, 1, this.state.inputStatus);
    this.props.APITransport(api);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.sentences !== this.props.sentences) {
      this.setState({
        sentences: this.props.sentences.data,
        sentenceCancel: this.props.sentences.data,
        count: this.props.sentences.count
      });
    }
  }

  handleStarClick(nextValue, prevValue, name) {
    const { sentences } = this.state;
    sentences[name].rating = nextValue;
    const api = new UpdateSentencesGrade(sentences[name]);
    this.props.APITransport(api);
    this.setState({ rating: nextValue });
  }

  handleSpellStarClick(nextValue, prevValue, name) {
    const { sentences } = this.state;
    sentences[name].spelling_rating = nextValue;
    const api = new UpdateSentencesGrade(sentences[name]);
    this.props.APITransport(api);
    this.setState({ spelling_rating: nextValue });
  }

  handleContextStarClick(nextValue, prevValue, name) {
    const { sentences } = this.state;
    sentences[name].context_rating = nextValue;
    const api = new UpdateSentencesGrade(sentences[name]);
    this.props.APITransport(api);
    this.setState({ context_rating: nextValue });
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
                <ReadMoreAndLess
                  ref={this.ReadMore}
                  className="read-more-content"
                  readMoreText={translate("commonCorpus.page.text.readMore")}
                  readLessText=""
                >
                  {row.translation ? row.translation.replace(/&quot;/g, '"') : ""}
                </ReadMoreAndLess>
              </TableCell>
              {!this.state.role.includes("dev") && (
                <TableCell>
                  <div style={{ width: "100px" }}>
                    <StarRatingComponent
                      name={index}
                      starCount={5}
                      value={row.rating ? row.rating : 0}
                      onStarClick={this.handleStarClick.bind(this)}
                    />
                  </div>
                </TableCell>
              )}
              {!this.state.role.includes("dev") && (
                <TableCell>
                  <div style={{ width: "92px" }}>
                    <StarRatingComponent
                      name={index}
                      starCount={5}
                      value={row.spelling_rating ? row.spelling_rating : 0}
                      onStarClick={this.handleSpellStarClick.bind(this)}
                    />
                  </div>
                </TableCell>
              )}

              {!this.state.role.includes("dev") && (
                <TableCell>
                  <div style={{ width: "92px" }}>
                    <StarRatingComponent
                      name={index}
                      starCount={5}
                      value={row.context_rating ? row.context_rating : 0}
                      onStarClick={this.handleContextStarClick.bind(this)}
                    />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
      </TableBody>
    );

    return (
      <div>
        {this.state.download ? <CSVDownload data={this.state.downloadData} target="_blank" /> : ""}
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12} lg={12} xl={12} style={{ margin: '2% 3%' }}>
            <Toolbar style={{ marginRight: "-1.2%" }}>
              <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
              <Typography variant="h8" gutterBottom>
                {translate("common.page.text.rowsPerPage")}&nbsp;&nbsp;&nbsp;&nbsp;
                <Select width="50%" value={this.state.pageCount} onChange={this.handleSelectChange} displayEmpty>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </Typography>
            </Toolbar>
            <Paper>
              <MuiThemeProvider theme={theme}>
                <CssBaseline />
                <Pagination
                  align="right"
                  limit={1}
                  offset={this.state.offset}
                  centerRipple
                  total={this.state.count / this.state.pageCount}
                  onClick={(event, offset) => {
                    this.handleChangePage(event, offset);
                  }}
                />
              </MuiThemeProvider>

              <Divider />
              <Table>
                <TableHead>
                  <TableRow>
                    {this.state.TableHeaderValues.map(item => (
                      <TableCell width="31%">{item}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {CorpusDetails}
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  corpus: state.corpus,
  sentences: state.sentences
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Corpus));
