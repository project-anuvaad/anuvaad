import React from "react";
import ChartType from "./ChartType";
import "file-saver";
import domtoimage from "dom-to-image";
import Modal from "react-modal";
import * as clipboard from "clipboard-polyfill";
import S3 from "../../../helpers/s3";
import _ from "lodash";
import ExportChart from "../../../helpers/exportJsonToExcel";

/**
 * GenericChart component to display the
 * generated charttypes in the page layout
 */

Modal.setAppElement("#root");

class GenericCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalData: {
        name: "",
        data: [],
        chartDataName: "",
        dimensions: "",
      },
      modalIsOpen: false,
      imageBlob: "",
      imageBase64: "",
      s3URL: "",
      telegramURL: "",
    };
    this.getModalData = this.getModalData.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.uploadForShare = this.uploadForShare.bind(this);
  }

  filterImage = (node) => {
    return (
      node.id !== "dropdownMenuButton" &&
      node.id !== "zoomIn" &&
      node.id !== "zoomOut" &&
      node.id !== "zoomInBtn" &&
      node.id !== "zoomOutBtn"
    );
  };

  filterImageTwo = (node) => {
    return (
      node.id !== "exit" &&
      node.id !== "downloadAsData" &&
      node.id !== "downloadAsImage" &&
      node.id !== "dropdownMenuButtonShare"
    );
  };

  openModal = () => {
    this.setState({
      modalIsOpen: true,
    });
  };

  afterOpenModal = () => {
    setTimeout(() => {
      domtoimage
        .toBlob(document.getElementById("modalView"), {
          filter: this.filterImageTwo,
        })
        .then((blob) => {
          this.setState({
            imageBlob: blob,
          });
          const item = new clipboard.ClipboardItem({
            "image/png": blob,
          });
          clipboard.write([item]);
        });
    }, 800);
  };

  closeModal = () => {
    this.setState({
      modalIsOpen: false,
    });
  };

  getModalData = (name, data, cdName, dimensions) => {
    // console.log(name, data, cdName);
    this.setState(
      {
        modalData: {
          ...this.state.modalData,
          name: name,
          data: data,
          chartDataName: cdName,
          dimensions: dimensions,
        },
        showModal: true,
      },
      () => {
        this.openModal();
      }
    );
  };

  uploadForShare = (data) => {
    S3.uploadFile(data, this.state.modalData.name, "png");
    setTimeout(() => {
      let url = localStorage.getItem("fileURL");
      this.setState({
        telegramURL:
          "https://telegram.me/share/url?url=" + encodeURIComponent(url),
      });
    }, 1000);
  };

  renderCharts(d, chartData, index) {
    let chartCode = _.chain(d.charts).first().get("id").value();
    let chartType = _.chain(d.charts)
      .first()
      .get("chartType")
      .toUpper()
      .value();

    switch (d.vizType.toUpperCase()) {
      case "CHART":
        return (
          <div
            key={index}
            className={`col-sm-12 col-md-${d.dimensions.width} col-lg-${d.dimensions.width} mt-2 mb-3`}
          >
            <div
              className="chart-wrapper h-100 cardChart chartWrapperPadding"
              id={d.name.replace(/\s/g, "")}
            >
              <div className="row">
                <h5 className="pb-5 pt-2 pl-3">{d.name}</h5>
                <span
                  className="material-icons cursorStyleOne mt-3 full-screen-button ml-3"
                  onClick={() => {
                    this.getModalData(
                      d.name,
                      d.charts,
                      chartData.name,
                      d.dimensions
                    );
                    setTimeout(() => {
                      this.uploadForShare(this.state.imageBlob);
                    }, 900);
                  }}
                >
                  fullscreen
                </span>

                <Modal
                  id="modalView"
                  isOpen={this.state.modalIsOpen}
                  onAfterOpen={this.afterOpenModal}
                  onRequestClose={this.closeModal}
                  contentLabel={this.state.modalData.name}
                  className="custom-modal"
                  bodyOpenClassName="afterOpen"
                  overlayClassName="custom-modal-overlay"
                >
                  <div className="col-xs-12 col-sm-12 col-md-11 col-lg-8 col-xl-8 float-right custom-modal-font-2">
                    <div
                      className="cursorStyleOne"
                      onClick={this.closeModal}
                      id="exit"
                    >
                      <span className="float-right">Exit</span>
                      <span className="material-icons float-right mr-1">
                        fullscreen_exit
                      </span>
                    </div>
                    <div className="cursorStyleOne" id="downloadAsData">
                      <span
                        className="float-right mr-3"
                        onClick={() =>
                          chartType === "TABLE"
                            ? ExportChart.tableToCsv(d.name)
                            : ExportChart.toCsv(d.name, chartCode)
                        }
                      >
                        Download data
                      </span>
                    </div>

                    <div
                      className="cursorStyleOne custom-dd-1 float-right"
                      id="dropdownMenuButtonShare"
                    >
                      <span className="float-right mr-3">Share</span>
                      <span className="material-icons float-right mr-1">
                        share
                      </span>

                      <div className="custom-modal-dropdown-1">
                        <a
                          className="dropdown-item email-button"
                          href="mailto:?subject=Message%20from%20RAIN&amp;body=http%3A%2F%2Frain.idc.tarento.com%2F"
                          target="_self"
                          rel="noopener noreferrer"
                          aria-label="Share by E-Mail"
                        >
                          Share via Email
                        </a>
                        <a
                          className="dropdown-item whatsapp-button"
                          href="whatsapp://send?text=Message%20from%20RAIN%20http%3A%2F%2Frain.idc.tarento.com%2F"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on WhatsApp"
                        >
                          Share via WhatsApp
                        </a>

                        <a
                          className="dropdown-item telegram-button"
                          href={this.state.telegramURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Telegram"
                        >
                          Share via Telegram
                        </a>
                      </div>
                    </div>
                    <div
                      id="downloadAsImage"
                      className="cursorStyleOne"
                      onClick={() =>
                        domtoimage
                          .toBlob(document.getElementById("modalView"), {
                            filter: this.filterImageTwo,
                          })
                          .then((blob) => {
                            this.setState(
                              {
                                imageBlob: blob,
                              },
                              () => {
                                let reader = new FileReader();
                                reader.readAsDataURL(this.state.imageBlob);

                                reader.onload = function () {
                                  this.image = reader.result;
                                };
                                window.saveAs(
                                  this.state.imageBlob,
                                  this.state.modalData.name
                                );
                              }
                            );
                          })
                      }
                    >
                      <span className="float-right  mr-3">
                        Download as image
                      </span>
                      <span className="material-icons float-right mr-2">
                        cloud_download
                      </span>
                    </div>

                    {/*<a
                        class="resp-sharing-button__link"
                        href="https://telegram.me/share/url?text=&amp;url=http%3A%2F%2Frain.idc.tarento.com%2F"
                        target="_blank"
                        rel="noopener"
                        aria-label="Share on Telegram"
                      >
                        <div class="resp-sharing-button resp-sharing-button--telegram resp-sharing-button--large">
                          <div
                            aria-hidden="true"
                            class="resp-sharing-button__icon resp-sharing-button__icon--solid"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                            >
                              <path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z" />
                            </svg>
                          </div>
                          Share on Telegram
                        </div>
                      </a>*/}
                  </div>
                  <div>
                    <h2>{this.state.modalData.name}</h2>
                  </div>
                  <div className="col-xs-12 col-sm-12 col-md-9 col-lg-8 col-xl-8 centerAlign">
                    <ChartType
                      key={index}
                      chartData={this.state.modalData.data}
                      label={this.state.modalData.name}
                      section={this.state.modalData.chartDataName}
                      pathName={this.props}
                      dimensions={this.state.modalData.dimensions}
                    />
                  </div>
                </Modal>

                <img
                  className="cursorStyleOne mt-3 downloadBtn ml-3 downloadIcon"
                  src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
                  title="Download as PNG"
                  alt="download chart"
                  width="13"
                  height="13"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                ></img>
                <div
                  className="dropdown-menu dropdown-menu-custom"
                  aria-labelledby="dropdownMenuButton"
                  style={{ marginLeft: "-18em" }}
                >
                  <p
                    className="dropdown-item cursorStyleOne metricTextColor"
                    onClick={() =>
                      domtoimage
                        .toBlob(
                          document.getElementById(d.name.replace(/\s/g, "")),
                          {
                            filter: this.filterImage,
                          }
                        )
                        .then((blob) => window.saveAs(blob, d.name))
                    }
                  >
                    Download as PNG
                  </p>
                  <p
                    className="dropdown-item cursorStyleOne metricTextColor"
                    onClick={() =>
                      chartType === "TABLE"
                        ? ExportChart.tableToCsv(d.name)
                        : ExportChart.toCsv(d.name, chartCode)
                    }
                  >
                    Download as CSV
                  </p>
                </div>
              </div>
              <ChartType
                key={index}
                chartData={d.charts}
                label={d.name}
                section={chartData.name}
                pathName={this.props}
                dimensions={d.dimensions}
              />
            </div>
          </div>
        );
      case "METRICCOLLECTION":
        return (
          <div
            key={index}
            className={`col-sm-12 col-md-${d.dimensions.width} col-lg-${d.dimensions.width} mt-2 mb-3`}
          >
            <div
              className="chart-wrapper h-100 cardChart chartWrapperPadding"
              id={d.name.replace(/\s/g, "")}
            >
              <div className="row">
                <h5 className="pb-5 pt-2 pl-3">{d.name}</h5>
                <img
                  className="cursorStyleOne mt-3 downloadBtn ml-3 downloadIcon"
                  src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
                  title="Download as PNG"
                  alt="download chart"
                  width="13"
                  height="13"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                ></img>
                <div
                  className="dropdown-menu dropdown-menu-custom"
                  aria-labelledby="dropdownMenuButton"
                  style={{ marginLeft: "-18em" }}
                >
                  <p
                    className="dropdown-item cursorStyleOne metricTextColor"
                    onClick={() =>
                      domtoimage
                        .toBlob(
                          document.getElementById(d.name.replace(/\s/g, "")),
                          {
                            filter: this.filterImage,
                          }
                        )
                        .then((blob) => window.saveAs(blob, d.name))
                    }
                  >
                    Download as PNG
                  </p>
                </div>
              </div>
              <ChartType
                key={index}
                chartData={d.charts}
                label={d.name}
                section={chartData.name}
              />
            </div>
          </div>
        );
      default:
        return <div></div>;
    }
  }
  render() {
    let { chartData, row } = this.props;

    return (
      <div key={row} className="row">
        {chartData.vizArray.map((d, i) => this.renderCharts(d, chartData, i))}
      </div>
    );
  }
}

export default GenericCharts;
