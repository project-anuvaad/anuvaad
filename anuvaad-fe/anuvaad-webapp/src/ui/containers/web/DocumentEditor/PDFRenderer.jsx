import React from "react";
import "../../../styles/web/InteractivePreview.css";
import { Document, Page } from "react-pdf/dist/entry.webpack";

import DownloadFile from "../../../../flux/actions/apis/download/download_file"

class PDFRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      scale: 1.0,
      msg: "Loading..."
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

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  componentDidMount() {
    this.setState({ msg: "Loading..." })
    let user_profile = JSON.parse(localStorage.getItem('userProfile'));
    let obj = new DownloadFile(this.props.filename, user_profile.userID)

    const apiReq1 = fetch(obj.apiEndPoint(), {
      method: 'get',
      headers: obj.getHeaders().headers
    }).then(async response => {
      if (!response.ok) {
        this.setState({ msg: "Failed to load file..." })
        // console.log("api failed")
      } else {
        this.setState({ msg: null })

        const buffer = new Uint8Array(await response.arrayBuffer());
        let res = Buffer.from(buffer).toString('base64')

        fetch("data:image/jpeg;base64," + res)
          .then(res => res.blob())
          .then(blob => {
            let url = URL.createObjectURL(blob);
            this.setState({ url })
          });
      }
    }).catch((error) => {
      this.setState({ msg: "Failed to load file..." })
      // console.log('api failed because of server or network', error)
    });

  }

  renderPDF = (url, pageNo) => {
    return (
      <div style={{ maxHeight: "88vh", overflowY: "auto", display: "flex", flexDirection: "row", justifyContent: "center" }} id="pdfDocument">
        <Document loading={""} noData = {this.state.msg} file={this.state.url} onLoadSuccess={this.onDocumentLoadSuccess} style={{ align: "center", display: "flex", flexDirection: "row", justifyContent: "center" }}>
          {/* {
                Array.from(
                  new Array(this.state.numPages),
                  (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                    />
                  ),
                )
              } */}
          <Page scale={this.state.pageScaleWidth} pageNumber={Number(pageNo)} onLoadSuccess={this.onPageLoad} />
        </Document>
      </div>
    )
  }

  render() {
    const { pageNo, filename } = this.props;
    const url = `${process.env.REACT_APP_APIGW_BASE_URL ? process.env.REACT_APP_APIGW_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${filename}`;

    return (
      <div>
        {this.renderPDF(url, pageNo)}
      </div>
    )

  }

}

export default PDFRenderer;