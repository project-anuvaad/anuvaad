import React from "react";
import GetHtmlLink from "../../../../flux/actions/editor/getHtmlLink";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { v4 as uuid4 } from "uuid";
import { clearHighlighBlock } from "../../../../flux/actions/users/translator_actions";
import { bindActionCreators } from "redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { highlightSource } from "../../../../utils/HtmlHighlightProcess";
import { Paper } from "@material-ui/core";
import SwitchView from "../../../../flux/actions/apis/document_translate/getViewOption";
import { Document, Page } from "react-pdf/dist/entry.webpack";

const $ = require("jquery");

class PageCardHtml extends React.Component {
  constructor(props) {
    super(props);
    this.prev_sid = React.createRef();
    this.page_no = React.createRef();
    this.state = {
      loaded: false,
      url: "",
      scale: 1.0,
      pageScale: 0,
      msg: "Loading...",
    };
  }

  componentDidMount() {
    if (this.props.link.count < 1) {
      $("#paper").html("Loading...");
      this.getHTML();
    }
    this.props.SwitchView(this.props.option);
  }

  componentDidUpdate(prevProps) {
    const { highlightBlock } = this.props;
    let { link } = this.props.link;
    let { filename } = this.props.match.params;
    if (filename && filename.split(".").pop() === "docx" && link) {
      this.handleComponentUpdate(
        prevProps,
        link,
        filename,
        this.handleDocxView,
        highlightBlock
      );
    } else if (filename && filename.split(".").pop() === "pptx" && link) {
      this.handleComponentUpdate(
        prevProps,
        link,
        filename,
        this.handlePptxView,
        highlightBlock
      );
    }
  }

  handleComponentUpdate = (
    prevProps,
    link,
    filename,
    handleView,
    highlightBlock
  ) => {
    if (
      prevProps.link.count &&
      prevProps.link.count !== this.props.link.count
    ) {
      if (
        (filename && filename.split(".").pop() === "docx") ||
        (filename && filename.split(".").pop() === "pptx" && link)
      ) {
        handleView(link);
      }
    } else if (
      prevProps.link.count &&
      prevProps.link.count === this.props.link.count &&
      !this.state.loaded
    ) {
      handleView(link);
    }
    if (this.props.link.count && this.props.option !== prevProps.option) {
      handleView(link);
    }

    if (this.page_no !== this.props.active_page && this.state.loaded) {
      this.page_no = this.props.active_page;
      let source = this.getSource(this.props.fetchContent, this.page_no);
      if (this.prev_sid) {
        this.removeFontTag();
      }
      if (source) {
        this.processScrollIntoView("none", source);
      }
      this.props.clearHighlighBlock();
    }
    if (this.page_no === this.props.active_page && !this.state.loaded) {
      handleView(link);
    }

    if (highlightBlock.block) {
      let { src } = highlightBlock.block;
      if (
        highlightBlock.current_sid !== highlightBlock.prev_sid &&
        highlightBlock.prev_sid
      ) {
        this.removeFontTag();
        this.processScrollIntoView("orange", src);
      } else if (highlightBlock.current_sid && !highlightBlock.prev_sid) {
        this.processScrollIntoView("orange", src);
      }
    }
  };

  handleDocxView = (link) => {
    if (link) {
      if (this.props.option === "View1") {
        this.fetchHtmlData(link["HTML"]["LIBRE"]);
      } else if (this.props.option === "View2") {
        this.fetchHtmlData(link["HTML"]["PDFTOHTML"]);
      }
    }
  };

  handlePptxView = (link) => {
    if (link) {
      if (this.props.option === "View1") {
        this.fetchHtmlData(link["HTML"]["PDFTOHTML"]);
      } else if (this.props.option === "View2") {
        this.fetchHtmlData(link["PDF"]["LIBRE"]);
      }
    }
  };

  getHTML = () => {
    let { jobid } = this.props.match.params;
    let { APITransport } = this.props;
    jobid = jobid.split("|").shift();
    let obj = new GetHtmlLink([jobid]);
    APITransport(obj);
  };

  highlightSentence = (paper, startIndex, totalLen, color, id) => {
    let coloredText = paper.substr(startIndex, totalLen);
    let firstHalf = paper.substr(0, startIndex);
    let secondHalf = `<font id=${id} style='background-color:${color};padding:1px 0'>${coloredText}</font>`;
    let thirdHalf = paper.substr(startIndex + totalLen);
    $("#paper").html(`${firstHalf}${secondHalf}${thirdHalf}`);
  };

  highlight = (source, color, id) => {
    if (source) {
      const paper = $("#paper").html();
      try {
        highlightSource(source, color, id, this.highlightSentence, paper);
      } catch (error) {
        console.log("error occurred!", source);
      }
    }
  };

  getSource = (fetchContent, pageNo) => {
    let tokenized_source;
    fetchContent &&
      fetchContent["result"]["data"].forEach((value) => {
        if (value.page_no === pageNo) {
          tokenized_source = value["text_blocks"].filter((text) => {
            return text.text !== "";
          });
        }
      });
    if (
      Array.isArray(tokenized_source) &&
      tokenized_source[0].hasOwnProperty("tokenized_sentences") &&
      tokenized_source[0]["tokenized_sentences"][0]
    )
      return tokenized_source[0]["tokenized_sentences"][0]["s0_src"];
  };

  setTagAttrib = (baseUrl, tag, property) => {
    for (let i = 0; i < tag.length; i++) {
      tag[i][property] =
        baseUrl +
        tag[i][property].substr(tag[i][property].lastIndexOf("/") + 1);
    }
  };

  fetchHtmlData = (link) => {
    fetch(link, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "auth-token": `${decodeURI(localStorage.getItem("token"))}`,
      },
    }).then(async (res) => {
      let { filename } = this.props.match.params;
      let type = filename && filename.split(".").pop();
      if (res.status === 200) {
        let html = await res.text();
        $("#paper").html(html);
        let images = document.getElementsByTagName("img");
        let urls = document.getElementsByTagName("a");
        let baseUrl = link.substr(0, link.lastIndexOf("/") + 1);
        this.setTagAttrib(baseUrl, images, "src");
        this.setTagAttrib(baseUrl, urls, "href");
        $("body").css("width", "100%");
        this.setState({ loaded: true });
        this.setState({ url: link, loaded: true });
      } else {
        $("#paper").html("Failed to load...");
      }
    });
  };

  processScrollIntoView = (color, src) => {
    this.prev_sid = uuid4();
    this.highlight(src, color, this.prev_sid);
    let current = document.getElementById(this.prev_sid);
    current &&
      current.scrollIntoView({ behavior: "smooth", inline: "nearest" });
  };

  removeFontTag = () => {
    var font = document.getElementsByTagName("font");
    var counter = font.length - 1;
    for (let i = counter; i >= 0; i--) {
      font[i].outerHTML = font[i].innerHTML;
    }
  };
  onPageLoad = (page) => {
    const parentDiv = document.querySelector("#pdfDocument");
    let pageScale = parentDiv.clientHeight / page.originalHeight;
    let pageScaleWidth = parentDiv.clientWidth / page.originalWidth;
    if (this.state.scale !== pageScale) {
      this.setState({ scale: pageScale, pageScaleWidth });
    }
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  renderPDF = () => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
        id="pdfDocument"
      >
        <Document
          loading={"Loading..."}
          noData={this.state.msg}
          file={this.state.url}
          onLoadSuccess={this.onDocumentLoadSuccess}
          style={{
            align: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Page
            scale={this.state.pageScaleWidth}
            pageNumber={Number(this.props.active_page)}
            onLoadSuccess={this.onPageLoad}
          />
        </Document>
      </div>
    );
  };

  renderDocumentView = () => {
    let { filename } = this.props.match.params;
    return (
      <div style={{ position: "relative" }}>
        {filename && filename.split(".").pop() === "docx" ? (
          <span style={{ zoom: `${this.props.zoomPercent}%` }}>
            <Paper
              elevation={0}
              id="paper"
              style={{ background: "none", padding: "10%" }}
            ></Paper>
          </span>
        ) : (
          <span style={{ zoom: `${this.props.zoomPercent}%` }}>
            {this.props.option === "View2" ? (
              this.renderPDF()
            ) : (
              <Paper
                elevation={0}
                id="paper"
                style={{ background: "none", padding: "10%" }}
              ></Paper>
            )}
          </span>
        )}
      </div>
    );
  };

  render() {
    return <>{this.renderDocumentView()}</>;
  }
}

const mapStateToProps = (state) => ({
  highlightBlock: state.block_highlight,
  active_page: state.active_page_number.page_number,
  fetchContent: state.fetchContent,
  link: state.getHtmlLink,
  option: state.getViewOptions.option,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      clearHighlighBlock,
      APITransport,
      SwitchView,
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(PageCardHtml)
);
