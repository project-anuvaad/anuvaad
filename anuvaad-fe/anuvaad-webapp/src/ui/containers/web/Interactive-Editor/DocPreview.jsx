import React from "react";
import Grid from "@material-ui/core/Grid";
import "../../../styles/web/InteractivePreview.css";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { Document, Page } from "react-pdf/dist/entry.webpack";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Toolbar from "@material-ui/core/Toolbar";
import { translate } from "../../../../assets/localisation";

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

    // let pageScale = parentDiv.clientWidth / page.originalWidth
    if (this.state.scale !== pageScale) {
      this.setState({ scale: pageScale, pageScaleWidth });
    }
  };

  render() {
    const { pageNo, fileDetails, numPages } = this.props;
    const url =
      fileDetails &&
      fileDetails.download_source_path &&
      `${process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "https://auth.anuvaad.org"}/anuvaad/v1/download?file=${
      fileDetails.download_source_path ? fileDetails.download_source_path : ""
      }`;

    return (
      <div>
        {/* //   <Paper elevation={2} style={{ height: "98%", paddingBottom: "10px" }}> */}
        {/* <Toolbar style={{ color: "#000000", background: "9E9E9E" }}>
          <Grid item xs={3} sm={3} lg={3} xl={3}>
            <Typography value="" variant="h6" gutterBottom style={{ width: "100%", flex: 1, color: '#1C9AB7' }}>
              {translate("intractive_translate.page.preview.originalPDF")}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} lg={6} xl={6}>
            {numPages &&pageNo && (
              <Grid container spacing={8}>
                <Grid item xs={4} sm={4} lg={4} xl={4} style={{textAlign: 'right'}}>
                  <Button
                    style={{ fontWeight: "bold", width: "60%" }}
                    color="primary"
                    disabled={pageNo <= 1}
                    onClick={event => {
                      this.props.handlePageChange(-1);
                    }}
                  >
                    {" "}
                    <ChevronLeftIcon size="large" />
                  </Button>
                </Grid>
                <Grid item xs={4} sm={4} lg={4} xl={4} style={{textAlign: 'center'}}>
                  <Button style={{ fontWeight: "bold", width: "100%", pointerEvents: "none" }} color="primary">
                    {`${pageNo} / ${numPages}`}
                  </Button>
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4} style={{textAlign: 'left'}}>
                  <Button
                    color="primary"
                    disabled={numPages <= pageNo}
                    onClick={event => {
                      this.props.handlePageChange(1);
                    }}
                    style={{ fontWeight: "bold", width: "60%" }}
                  >
                    <ChevronRightIcon size="large" />{" "}
                  </Button>
                </Grid>
              </Grid>
            )}
          </Grid>
          {/* <Grid item xs={3} sm={3} lg={3} xl={3} style={{textAlign: "right", display: "flex", flexDirection: "row", justifyContent: "right"}}>
            {this.props.zoom ? (
              <Button
                color="secondary"
                disabled={numPages <= pageNo}
                onClick={event => {
                  this.props.handleChange();
                }}
                style={{ fontWeight: "bold"}}
              >
                <ZoomOutIcon size="Large" style={{color: '#233466'}}/>
              </Button>
            ) : (
                <Button
                  color="primary"
                  disabled={numPages <= pageNo}
                  onClick={event => {
                    this.props.handleChange();
                  }}
                  style={{ fontWeight: "bold"}}
                >
                  <ZoomInIcon size="Large" style={{color: '#233466'}}/>
                </Button>
              )}
          </Grid> */}
        {/* </Toolbar> */}
        <div style={{ maxHeight: window.innerHeight - 260, overflowY: "auto", display: "flex", flexDirection: "row", justifyContent: "center" }} id="pdfDocument">
          <Document file={url} onLoadSuccess={this.props.onDocumentLoadSuccess} style={{ align: "center", display: "flex", flexDirection: "row", justifyContent: "center" }}>


            <Page scale={this.state.pageScaleWidth} pageNumber={Number(pageNo)} onLoadSuccess={this.onPageLoad} />
            {/* <Page scale={!this.props.zoom ? this.state.scale : this.state.pageScaleWidth} pageNumber={Number(this.props.pageNo +1) } onLoadSuccess={this.onPageLoad} /> */}


          </Document>
        </div>
        {/* </Paper> */}
      </div>
    );
  }
}



export default PdfPreview;