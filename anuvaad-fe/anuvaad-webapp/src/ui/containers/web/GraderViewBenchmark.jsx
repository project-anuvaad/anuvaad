import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Pagination from "material-ui-flat-pagination";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import UpdateSentencesGrade from "../../../flux/actions/apis/upgrade-sentence-grade";
import AppBar from "../../components/web/common/Appbar";
import Grader from "../../components/web/common/Grader";
import FetchBenchmarkCompareModel from "../../../flux/actions/apis/fetchenchmarkcomparemodel";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../assets/localisation";

class BenchmarkGrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputStatus: "ALL",
      checkedB: false,
      apiCall: false,
      pending: null,
      PendingpageNumber: 1,
      AllPageNumber: 1,
      score: {},
      apiCalled: false,
      sentences: [],
      pageCount: 1,
      status: "",
      page: 0,
      offset: 0,
      tocken: false,

      TableHeaderValues: ["Source Sentence", "Target Sentence", "Machine translated reference", "Grade"],

      role: JSON.parse(localStorage.getItem("roles"))
    };
  }

  componentDidMount() {
    const api = new FetchBenchmarkCompareModel(this.props.base, this.state.pageCount, 1);
    this.props.APITransport(api);
  }

  handleChangePage(event, offset) {
    this.setState({ offset, sentences: [] });

    if (this.state.base) {
      const api = new FetchBenchmarkCompareModel(
        this.state.base,

        this.state.pageCount,
        offset + 1,
        this.state.inputStatus
      );
      this.props.APITransport(api);
    }
  }

  handleFetchBenchmark(base) {
    const api = new FetchBenchmarkCompareModel(this.state.base, this.state.pageCount, 1);
    this.props.APITransport(api);
  }

  handleSubmit = () => {
    const api = new UpdateSentencesGrade(this.state.sentences, this.props.match.params.modelid);
    this.setState({ dialogOpen: false, apiCall: true, showLoader: true, tocken: false, sentences: [] });
    this.props.APITransport(api);
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.base !== prevState.base) {
      return {
        base: nextProps.base,
        apiCall: true,
        sentences: [],
        offset: 0
      };
    } return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.base !== this.state.base) {
      this.setState({ base: this.state.base });
      const api = new FetchBenchmarkCompareModel(this.props.base, this.state.pageCount, this.state.offset + 1, this.state.inputStatus);
      this.props.APITransport(api);
    }

    if (prevProps.updateGrade !== this.props.updateGrade) {
      const api1 = new FetchBenchmarkCompareModel(
        this.state.base,

        this.state.pageCount,
        this.state.offset + 1 === this.state.count
          ? this.state.offset + 1
          : this.state.inputStatus === "PENDING" && this.state.offset + 1 === this.state.pending
          ? this.state.offset
          : this.state.offset + 2,
        this.state.inputStatus
      );

      this.setState({
        showLoader: true,
        offset:
          this.state.offset + 1 === this.state.count
            ? this.state.offset
            : this.state.inputStatus === "PENDING" && this.state.offset + 1 === this.state.pending
            ? this.state.offset - 1
            : this.state.offset + 1,
        sentences: []
      });
      this.props.APITransport(api1);
    }

    if (prevProps.fetchBenchmarkCompareModel !== this.props.fetchBenchmarkCompareModel) {
      this.setState({
        apiCall: false,
        sentenceCancel: prevProps.fetchBenchmarkCompareModel.data,
        sentences: this.props.fetchBenchmarkCompareModel.data,
        count: this.props.fetchBenchmarkCompareModel.count,
        score: this.props.fetchBenchmarkCompareModel.sum,
        pending: this.props.fetchBenchmarkCompareModel.pending
      });
    }
  }

  onStarClick(nextValue, prevValue, name, index) {
    const {sentences} = this.state;
    sentences[index][name] = nextValue;
    this.setState({ sentences });
  }

  handleSwitchChange = () => {
    if (this.state.checkedB) {
      const api = new FetchBenchmarkCompareModel(this.props.base, this.state.pageCount, 1, translate("common.page.text.allCaps"));
      this.props.APITransport(api);
      this.setState({ inputStatus: "ALL", offset: 0 });
    } else {
      const api = new FetchBenchmarkCompareModel(this.props.base, this.state.pageCount, 1, translate("common.page.text.pendingCaps"));
      this.props.APITransport(api);
      this.setState({ inputStatus: "PENDING", offset: 0 });
    }
    this.setState({ checkedB: !this.state.checkedB, sentences: [] });
  };

  render() {
    const value = (
      <Switch
        checked={this.state.checkedB}
        onChange={() => {
          this.handleSwitchChange();
        }}
        value="checkedB"
        color="secondary"
      />
    );
    return (
      <div>
        <Typography variant="h5" color="inherit" style={{ marginTop: "20px", marginLeft: "20px" }}>
          <b>{translate("graderViewBenchmark.page.label.sentencesFrom") + this.props.label}</b>
        </Typography>
        <Grid container spacing={4} style={{ padding: "20px" }}>
          {this.state.sentences && this.state.sentences.length > 0 && <AppBar pending={this.state.pending} count={this.state.count} val={value} />}

          {this.state.sentences.length > 0 && (
            <Typography variant="h5" color="inherit" style={{ marginTop: "20px" }}>
              <b>{translate("commonCorpus.page.text.sourceSentence")}</b>
              <br />
            </Typography>
          )}
          <Grid item xs={12} sm={12} lg={12} xl={12}>
            <Typography variant="body1" color="inherit" style={{ marginTop: "20px" }}>
              {" "}
              {this.state.sentences.length > 0 && this.state.sentences[0].source}
            </Typography>
          </Grid>

          {this.state.sentences.map((value, i) => {
            const val = i === 0 ? "A" : "B";
            return (
              <Grid item xs={6} sm={6} lg={6} xl={6}>
                <Grader
                  title={`Model ${  val}`}
                  index={i}
                  description={value.target}
                  handleStarClick={this.onStarClick.bind(this)}
                  data={value}
                  meaning="rating"
                  structure="context_rating"
                  vocabulary="spelling_rating"
                />
              </Grid>
            );
          })}
        </Grid>
        {/*  */}

        {this.state.sentences && this.state.sentences.length > 0 && (
          <Toolbar style={{ marginRight: "3%", marginTop: "20px" }}>
            <Typography variant="h5" color="inherit" style={{ flex: 1 }} />
            <Button
              variant="contained"
              disabled={
                this.state.sentences[0] && this.state.sentences[1]
                  ? !(this.state.sentences[0].rating &&
                    this.state.sentences[1].rating &&
                    this.state.sentences[0].context_rating &&
                    this.state.sentences[1].context_rating &&
                    this.state.sentences[0].spelling_rating &&
                    this.state.sentences[1].spelling_rating)
                  : true
              }
              onClick={event => {
                this.handleSubmit(this.state.sentences);
              }}
              color="primary"
              aria-label="edit"
              style={{ width: "170px", marginBottom: "4%", marginTop: "1px" }}
            >
              {this.state.offset + 1 === this.state.count
                ? translate("common.page.button.save")
                : this.state.inputStatus === "PENDING" && this.state.offset + 1 === this.state.pending
                ? translate("common.page.button.save")
                : translate("graderViewBenchmark.page.label.save&Next")}
            </Button>
          </Toolbar>
        )}
        {this.state.sentences && this.state.sentences.length > 0 && (
          <Pagination
            align="right"
            limit={1}
            offset={this.state.offset}
            centerRipple
            total={this.state.inputStatus === "PENDING" ? this.state.pending : this.state.count}
            onClick={(event, offset) => {
              this.handleChangePage(event, offset);
            }}
          />
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
  fetchBenchmarkCompareModel: state.fetchBenchmarkCompareModel,
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
