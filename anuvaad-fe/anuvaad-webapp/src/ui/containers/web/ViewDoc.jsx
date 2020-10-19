// MyApp.js
import CircularProgress from "@material-ui/core/CircularProgress";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import Dialog from "../../components/web/common/Dialog";
import CONFIGS from "../../../configs/configs";

class ViewDocs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      node: null,
      srcLoading: false,
      tgtLoading: false
    };
    this.handleSaveDoc = this.handleSaveDoc.bind(this);
    this.loadDocx = this.loadDocx.bind(this);
    this.loadDocxTgt = this.loadDocxTgt.bind(this);
  }

  componentDidMount() {
    this.src.addEventListener("click", this.handleTextSelect.bind(this));
    this.tgt.addEventListener("click", this.handleTextSelect.bind(this));
    if (this.props.match.params.basename) {
      this.setState({ srcLoading: true, tgtLoading: true, basename: this.props.match.params.basename });
      this.loadDocx(this.props.match.params.basename);
      this.loadDocxTgt(this.props.match.params.basename);
    }
  }

  loadDocx(basename) {
    fetch(`${CONFIGS.BASE_URL_AUTO}/download-docx?filename=${basename}.docx`, {
      method: "GET"
    })
      .then(response => response.blob())
      .then(blob => {
        const container = document.getElementById("doc-src");
        this.setState({
          srcLoading: false
        });
        window.docx.renderAsync(blob, container, null, { debug: true }).then(x => {
          console.log(x);
        });
      });
    // var file = document.getElementById("files").files[0];
  }

  loadDocxTgt(basename) {
    fetch(`${CONFIGS.BASE_URL_AUTO}/download-docx?filename=${basename}_t.docx`, {
      method: "GET"
    })
      .then(response => response.blob())
      .then(blob => {
        const container = document.getElementById("doc-tgt");
        this.setState({
          tgtLoading: false
        });
        window.docx.renderAsync(blob, container, null, { debug: true }).then(x => {
          console.log(x);
        });
      });
    // var file = document.getElementById("files2").files[0];
    // var container = document.getElementById("doc-tgt");

    // window.docx.renderAsync(file, container, null, { debug: true })
    //     .then(function (x) { console.log(x); });
  }

  handleTextSelect() {
    const sel = window.getSelection();
    if (sel && sel.focusNode) {
      this.setState({
        dialogOpen: true,
        node: sel.focusNode
      });
      // sel.focusNode.textContent = ''
    }
  }

  handleDialogSave(node, text) {
    node.textContent = text;
    this.setState({
      dialogOpen: false
    });
  }

  handleSaveDoc() {
    // var container = document.getElementById("doc-src");
    // this.Export2Doc(container)
    // let api = new HtmlToDoc(container.innerHTML)
    // this.props.APITransport(api)
    // var converted = htmlDocx.asBlob(container.outerHTML);
  }

  render() {
    return (
      <div>
        {this.state.srcLoading || this.state.tgtLoading ? <CircularProgress /> : null}
        <Dialog open={this.state.dialogOpen} node={this.state.node} handleClick={this.handleDialogSave.bind(this)} />
        <div id="doc-src" ref={elem => (this.src = elem)} style={{ width: "50%", display: "inline-block" }} />
        <div id="doc-tgt" ref={elem => (this.tgt = elem)} style={{ width: "50%", display: "inline-block" }} />
      </div>
    );
  }

  onError(e) {
    console.log(e);
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(connect(null, mapDispatchToProps)(ViewDocs));
