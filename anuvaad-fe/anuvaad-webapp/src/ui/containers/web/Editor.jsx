import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core";
import ReactQuill from "react-quill";
import FetchModels from "../../../flux/actions/apis/fetchenchmarkmodel";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import "react-quill/dist/quill.snow.css";
import { JsonTable } from "react-json-to-html";

const styles = {
  editor: {
    width: "80%"
  }
};

const data = [
  { y: "53", x: "441", text: "1", style: "position:absolute;top:53px;left:441px;white-space:nowrap", class: "ft10" },
  { y: "109", x: "157", text: " ", style: "position:absolute;top:109px;left:157px;white-space:nowrap", class: "ft11" },
  { y: "108", x: "574", text: "(Non Reportable)", style: "position:absolute;top:108px;left:574px;white-space:nowrap", class: "ft12" },
  { y: "135", x: "255", text: " IN THE SUPREME COURT OF INDIA", style: "position:absolute;top:135px;left:255px;white-space:nowrap", class: "ft11" },
  { y: "161", x: "275", text: " CIVIL APPELLATE JURISDICTION", style: "position:absolute;top:161px;left:275px;white-space:nowrap", class: "ft11" },
  { y: "211", x: "278", text: "CIVIL APPEAL NO. 3975 OF 2010", style: "position:absolute;top:211px;left:278px;white-space:nowrap", class: "ft12" },
  { y: "266", x: "150", text: "H.P.Puttaswamy", style: "position:absolute;top:266px;left:150px;white-space:nowrap", class: "ft11" },
  { y: "266", x: "594", text: " ..……. Appellant", style: "position:absolute;top:266px;left:594px;white-space:nowrap", class: "ft11" },
  { y: "317", x: "378", text: " Versus", style: "position:absolute;top:317px;left:378px;white-space:nowrap", class: "ft11" },
  {
    y: "367",
    x: "108",
    text: " Thimmamma & Ors. ……,..Respondents",
    style: "position:absolute;top:367px;left:108px;white-space:nowrap",
    class: "ft11"
  },
  {
    y: "446",
    x: "330",
    text: " J U D G M E N T ANIRUDDHA BOSE,J.",
    style: "position:absolute;top:446px;left:330px;white-space:nowrap",
    class: "ft12"
  },
  {
    y: "609",
    x: "108",
    text:
      " The main dispute involved in this appeal concerns the question of necessity of presence of a purchaser of immovable property before the authority under the Registration Act, 1908 at the time of effecting registration of a deed of conveyance. In the suit, out of which this appeal arises, the plaintiff claimed declaration of himself as the lawful owner in possession of the suit property. The plaintiff is the appellant before us. This suit was instituted on 31 st March 1989 and was registered as Original Suit No.132 of 1989 in the Court of Civil Judge (Junior Division)",
    style: "position:absolute;top:609px;left:108px;white-space:nowrap",
    class: "ft12"
  }
];
class Editor1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: false,
      value: "",
      isFocus: false,
      text:
        "<p>The intermediary who fails to comply with the direction issued under sub-section (1) shall be punished with an imprisonment for a term which may extend to seven years and shall also be liable to fine</p><p>The intermediary who fails to comply with the direction issued under sub-section (1) shall be punished with an imprisonment for a term which may extend to seven years and shall also be liable to fine</p>"
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const api = new FetchModels(1573290229, 17, 1, 1);
    APITransport(api);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.fetchBenchmarkModel !== this.props.fetchBenchmarkModel) {
      this.setState({
        sentences: this.props.fetchBenchmarkModel.data,
        count: this.props.fetchBenchmarkModel.count
      });
    }
  }

  handleSelected = (event, text) => {
    const quillRef = this.reactQuillRef.getEditor();
    const range = quillRef.getSelection();
    const position = range ? range.index : 0;
    quillRef.insertText(position, text);
  };

  handleChange(value) {
    this.setState({ text: value });
  }

  keyPress(e) {
    if (e.keyCode === 9) {
      const { APITransport } = this.props;
      const api = new FetchModels(1573290229, 17, 5, 1);
      APITransport(api);
      this.setState({ token: true });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        onClick={() => {
          this.setState({ token: false });
        }}
      >
        <div
          style={{
            marginLeft: "14%",
            marginTop: "5%",
            width: "70%",
            marginBottom: "50%"
          }}
        >
          <ReactQuill
            className={classes.editor}
            ref={el => {
              this.reactQuillRef = el;
            }}
            modules={Editor1.modules}
            value={<JsonTable json={data} />}
            onKeyDown={this.keyPress.bind(this)}
            onChange={this.handleChange.bind(this)}
            theme="snow"
          />

          <div>{this.state.text}</div>
        </div>
      </div>
    );
  }
}

Editor1.modules = {
  toolbar: [
    [{ font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ indent: "-1" }, { indent: "+1" }],
    ["direction", { align: [] }],
    ["link"],
    ["clean"]
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
};

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchBenchmarkModel: state.fetchBenchmarkModel,
  benchmarkTranslate: state.benchmarkTranslate
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Editor1)));
