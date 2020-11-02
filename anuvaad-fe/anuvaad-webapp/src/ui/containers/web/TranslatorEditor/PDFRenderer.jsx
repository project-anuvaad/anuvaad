import React from "react";
import "../../../styles/web/InteractivePreview.css";
import { Document, Page } from "react-pdf/dist/entry.webpack";

class PDFRenderer extends React.Component {
    constructor(props) {
        super(props);
        this.textInput = React.createRef();
        this.state = {
            scale: 1.0
        };
    }

    onPageLoad = page => {
        const parentDiv     = document.querySelector("#pdfDocument");
        let pageScale       = parentDiv.clientHeight / page.originalHeight;
        let pageScaleWidth  = parentDiv.clientWidth / page.originalWidth;
        if (this.state.scale !== pageScale) {
          this.setState({ scale: pageScale, pageScaleWidth });
        }
    };

    onDocumentLoadSuccess = () => {

    }

    renderPDF = (url, pageNo) => {
        return (
            <div style={{ maxHeight: window.innerHeight - 150, overflowY: "auto", display: "flex", flexDirection: "row", justifyContent: "center" }} id="pdfDocument">
                <Document file={url} onLoadSuccess={this.onDocumentLoadSuccess} style={{ align: "center", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                    <Page scale={this.state.pageScaleWidth} pageNumber={Number(pageNo)} onLoadSuccess={this.onPageLoad} />
                </Document>
            </div>
        )
    }

    render() {
        const { pageNo, filename } = this.props;
        const url = `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${filename}`;

        return  (
            <div>
                {this.renderPDF(url, pageNo)}
            </div>
        )

    }

}

export default PDFRenderer;