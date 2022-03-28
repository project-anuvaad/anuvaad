import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class AddVisualizationModal extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div
        className="modal fade show"
        id="addVisualizationModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addVisualizationModalLabel"
        aria-hidden="true"
        // aria-modal="true"
        // style={{ paddingRight: "8px", display: "block" }}
      >
        <div className="modal-dialog modal-lg" role="document" style={{ minHeight: "50vh" }}>
          <div className="modal-content">
            <div className="modal-body">
              <div className="row modal-body-container">
                <div
                  className="row col-md-8 modal-left"
                  style={{ minHeight: "45vh" }}
                >
                  <div
                    className="col-md-12"
                    style={{ minHeight: "45vh", position: "relative" }}
                  ></div>
                  <div className="col-md-12" style={{ position: "absolute" }}>
                    <div className="row col-md-12 mt-4">
                      <h5>Add Visualization</h5>
                    </div>
                    <div className="row col-md-12 mt-3">
                      <div className="row col-md-12">
                        <div className="form-group has-search">
                          <span className="fa fa-search form-control-feedback"></span>
                          <input
                            type="text"
                            className="form-control"
                            id="search-users"
                            placeholder="Search for a visualization"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row col-md-12 mb-5">
                      <div className="row col-12">
                        <div className="col-md-12 role visualization-item mt-2">
                          <img
                            className="ml-2 mr-2"
                            src="/img/bar-chart.png"
                            alt=""
                          />
                          <span>Visualization 1</span>
                        </div>
                        <div className="col-md-12 role visualization-item mt-2">
                          <img
                            className="ml-2 mr-2"
                            src="/img/pi-chart.png"
                            alt=""
                          />
                          <span>Visualization 2</span>
                        </div>
                        <div className="col-md-12 role visualization-item mt-2">
                          <img
                            className="ml-2 mr-2"
                            src="/img/bar-chart.png"
                            alt=""
                          />
                          <span>Visualization 3</span>
                        </div>
                        <div className="col-md-12 role visualization-item mt-2">
                          <img
                            className="ml-2 mr-2"
                            src="/img/line-chart.png"
                            alt=""
                          />
                          <span>Visualization 4</span>
                        </div>
                        <div className="col-md-12 role visualization-item mt-2">
                          <img
                            className="ml-2 mr-2"
                            src="/img/bar-chart.png"
                            alt=""
                          />
                          <span>Visualization 5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row col-md-4 modal-right">
                  <div
                    className="col-md-12"
                    style={{ minHeight: "45vh", position: "relative" }}
                  ></div>
                  <div className="col-md-12" style={{ position: "absolute" }}>
                    <div className="col-md-12 mt-4">
                      <h5 className="pl-2">Added</h5>
                    </div>
                    <div className="row col-12 mt-4">
                      <div className="col-md-12 role visualization-item mt-2 blue-border">
                        <img
                          className="ml-2 mr-2"
                          src="/img/bar-chart.png"
                          alt=""
                        />
                        <span>Visualization 6</span>
                      </div>
                      <div className="col-md-12 role visualization-item mt-2 blue-border">
                        <img
                          className="ml-2 mr-2"
                          src="/img/bar-chart.png"
                          alt=""
                        />
                        <span>Visualization 7</span>
                      </div>
                      <div className="col-md-12 role visualization-item mt-2 blue-border">
                        <img
                          className="ml-2 mr-2"
                          src="/img/bar-chart.png"
                          alt=""
                        />
                        <span>Visualization 8</span>
                      </div>
                      <div className="col-md-12 role visualization-item mt-2 blue-border">
                        <img
                          className="ml-2 mr-2"
                          src="/img/bar-chart.png"
                          alt=""
                        />
                        <span>Visualization 9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-modal default"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button type="button" className="btn btn-modal primary">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddVisualizationModal;
