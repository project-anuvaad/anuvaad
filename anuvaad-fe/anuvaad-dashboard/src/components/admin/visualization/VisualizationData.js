import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import VisualizationTopPanel from "./VisualizationTopPanel";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class VisualizationData extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar />
          <HeaderNavBar pathName={this.props} history={this.props.history} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section">
                <Sidebar location={this.props.location} />
              </div>
              <div className="col-md-10 admin-right-section">
                <VisualizationTopPanel location={this.props.location} />
                <div className="row mt-5">
                  <div className="col-md-5 white-90">
                    <div className="form-group">
                      <div className="col-md-8">
                        <label htmlFor="unique-name">Unique Name</label>
                        <input
                          type="text"
                          name="unique-name"
                          className="form-control input-bg-2"
                          placeholder={strings.typeHere}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-8">
                        <label htmlFor="display-name">Display Name</label>
                        <input
                          type="text"
                          name="display-name"
                          className="form-control input-bg-2"
                          placeholder={strings.typeHere}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-12">
                        <label htmlFor="display-name">
                          Type of data source
                        </label>
                        <div>
                          <button className="btn default admin-table-bg">
                            <i className="material-icons absolute">
                              description
                            </i>
                            <span className="button-text">Form</span>
                          </button>
                          <button className="btn default admin-table-bg active">
                            <i className="material-icons absolute">code</i>
                            <span className="button-text">API</span>
                          </button>
                          <button className="btn default admin-table-bg">
                            <i className="material-icons absolute">
                              file_upload
                            </i>
                            <span className="button-text">Upload</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-8">
                        <label htmlFor="source">Source</label>
                        <input
                          type="text"
                          name="source"
                          className="form-control input-bg-2"
                          placeholder={strings.typeHere}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-12">
                        <label htmlFor="chart-type">Chart Type</label>
                        <div>
                          <button className="btn default admin-table-bg mb-3 active">
                            <i className="material-icons secondary-color absolute">
                              bar_chart
                            </i>
                            <span className="button-text">Column Chart</span>
                          </button>
                          <button className="btn default admin-table-bg mb-3">
                            <i className="material-icons secondary-color absolute">
                              table_chart
                            </i>
                            <span className="button-text">Table Chart</span>
                          </button>
                          <button className="btn default admin-table-bg mb-3">
                            <i className="material-icons secondary-color rotate-270 absolute">
                              bar_chart
                            </i>
                            <span className="button-text">Bar Chart</span>
                          </button>
                          <button className="btn default admin-table-bg mb-3">
                            <i className="material-icons secondary-color absolute">
                              scatter_plot
                            </i>
                            <span className="button-text">Scatter Chart</span>
                          </button>
                          <button className="btn default admin-table-bg mb-3">
                            <i className="material-icons secondary-color absolute">
                              bubble_chart
                            </i>
                            <span className="button-text">Bubble Chart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7">Revenue Visualization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VisualizationData;
