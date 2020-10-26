import React from "react";
import "../../../styles/web/InteractivePreview.css";
import { Document, Page } from "react-pdf/dist/entry.webpack";

class PdfPreview extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      sentences: "",
      sourceSupScripts: "",
      targetSupScripts: "",
      header: "",
      scale: 1.0
    };
  }

  onPageLoad = page => {
    const parentDiv = document.querySelector("#pdfDocument");

    let pageScale = parentDiv.clientHeight / page.originalHeight;

    let pageScaleWidth = parentDiv.clientWidth / page.originalWidth;

    if (this.state.scale !== pageScale) {
      this.setState({ scale: pageScale, pageScaleWidth });
    }
  };

  render() {
    const { pageNo, fileDetails } = this.props;
    const url =
      fileDetails &&
      fileDetails.download_source_path &&
      `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${
      fileDetails.download_source_path ? fileDetails.download_source_path : ""
      }`;

    return (
      <div>
     
        <div style={{ maxHeight: window.innerHeight - 260, overflowY: "auto", display: "flex", flexDirection: "row", justifyContent: "center", paddingTop: "20px" }} id="pdfDocument">
          <Document file={url} onLoadSuccess={this.props.onDocumentLoadSuccess} style={{ align: "center", display: "flex", flexDirection: "row", justifyContent: "center" }}>

            <Page scale={this.state.pageScaleWidth} pageNumber={Number(pageNo)} onLoadSuccess={this.onPageLoad} />

          </Document>
        </div>
      </div>
    );
  }
}

export default PdfPreview;