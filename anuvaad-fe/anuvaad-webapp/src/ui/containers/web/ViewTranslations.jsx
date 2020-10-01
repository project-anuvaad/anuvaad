import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import FetchTranslationSentences from "../../../flux/actions/apis/translation_sentences";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";

class Corpus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      sentences: [],
      download: false,
      downloadData: []
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
    if (this.props.match.params.basename) {
      const api = new FetchTranslationSentences(this.props.match.params.basename);
      this.props.APITransport(api);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.corpus !== this.props.corpus) {
      this.setState({
        hindi: this.props.corpus.hindi,
        hindi_score: this.props.corpus.hindi_scores,
        english: this.props.corpus.english,
        english_score: this.props.corpus.english_scores
      });
    }
    if (prevProps.sentences !== this.props.sentences) {
      this.setState({
        sentences: this.props.sentences
      });
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

  calculateScoreCount(scores) {
    let count = 0;
    let item_count = 0;
    if (scores && Array.isArray(scores)) {
      scores.map(score => {
        if (score.conf) {
          item_count++;
        }
        count += score.conf ? parseInt(score.conf, 10) : 0;
        return true;
      });
    }
    if (item_count === 0) {
      item_count = 1;
    }
    return count / item_count;
  }

  handleEditButton(index) {
    const { sentences } = this.state;
    sentences[index].isEditable = true;
    this.setState({
      sentences
    });
  }

  handleSaveButton(index) {
    const { sentences } = this.state;
    sentences[index].isEditable = false;
    this.setState({
      sentences,
      download: false
    });
  }

  handleDownload() {
    const { sentences } = this.state;
    const downloadDataHeader = ["Hindi", "English"];
    const downloadData = [];
    downloadData.push(downloadDataHeader);
    sentences.map(sentence => {
      const row = [sentence.source, sentence.target];
      downloadData.push(row);
      return true;
    });
    this.setState({
      downloadData,
      download: true
    });
  }

  render() {
    return (
      <div>
        <Grid container spacing={24} style={{ padding: 24 }}>
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Typography component="h2" variant="title" gutterBottom>
              {translate("common.page.label.translation")}
            </Typography>
          </Grid>
          {/* <CSVDownload data={csvData} target="_blank" /> */}
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            {this.props.apistatus.progress ? (
              <CircularProgress />
            ) : (
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{translate("common.page.label.source")}</TableCell>
                      <TableCell align="right">{translate("common.page.label.target")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.sentences &&
                      Array.isArray(this.state.sentences) &&
                      this.state.sentences.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell component="th" scope="row">
                            {row.source}
                          </TableCell>
                          <TableCell align="right">{row.target}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Paper>
            )}
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
  sentences: state.translation_sentences
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
