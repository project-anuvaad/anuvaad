import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import DashboardTopPanel from "./DashboardTopPanel";
import Sidebar from "../common/Sidebar";
import AddVisualizationModal from "../modal/AddVisualizationModal";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class DashboardLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showColumns: false,
      language: "en"
    };
    this.toggleColumns = this.toggleColumns.bind(this);
  }

  toggleColumns = () => {
    if (this.state.showColumns === true) {
      this.setState({
        showColumns: false
      });
    } else {
      this.setState({
        showColumns: true
      });
    }
  };

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
                <DashboardTopPanel location={this.props.location} />
                <div className="row col-md-12 mt-5">
                  <div className="col-md-6 pl-4 mb-2">
                    <button
                      type="button"
                      className="btn theme"
                      data-toggle="modal"
                      data-target="#addVisualizationModal"
                    >
                      Add Visualization
                    </button>
                  </div>
                  <div className="col-md-6">
                    <div className="pull-right white-70 mr-5">
                      <button className="btn action">
                        <i className="material-icons absolute">reorder</i>
                        <span className="button-text">Enable Reorder</span>
                      </button>
                      <button className="btn action">
                        <i className="material-icons absolute">
                          remove_red_eye
                        </i>
                        <span className="button-text">Show Preview</span>
                      </button>
                      <button
                        className="btn action"
                        onClick={event => this.toggleColumns(event)}
                      >
                        <i className="material-icons absolute">view_week</i>
                        <span className="button-text">
                          {this.state.showColumns
                            ? "Hide Columns"
                            : "Show Columns"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div
                    className="row col-md-12"
                    style={{ minHeight: "90vh", position: "relative" }}
                  >
                    {this.state.showColumns && (
                      <>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                        <div className="col-md-1">
                          <div className="col-highlighter"></div>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    className="row col-md-12"
                    style={{ position: "absolute" }}
                  >
                    <div className="row col-md-12 item-container">
                      <div className="col-md-8">
                        <div className="dashboard-item bordered p-3">
                          <h6>
                            Visualization 1 (Display name 1){" "}
                            <i className="material-icons pull-right">
                              more_vert
                            </i>
                          </h6>
                          <p className="white-70">
                            No of regristrations
                            <br />
                            States
                          </p>
                          <p className="white-70">
                            <i className="material-icons secondary-color">
                              bar_chart
                            </i>
                            <span className="chart-title">Column Chart</span>
                          </p>
                          <h6>Width</h6>
                          <div className="dropdown mt-3 d-none d-md-flex d-lg-flex langDropdown">
                            <div
                              className="dropdown-toggle dropdownColumnLink"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {"8 Columns"}{" "}
                            </div>
                            <div
                              className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                              aria-labelledby="dropdownRoleLink"
                              // onClick={this.handleLanguageChange}
                            >
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="4 Columns"
                              >
                                4 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="8 Columns"
                              >
                                8 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="12 Columns"
                              >
                                12 Columns
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="dashboard-item bordered p-3">
                          <h6>
                            Visualization 2
                            <i className="material-icons pull-right">
                              more_vert
                            </i>
                          </h6>
                          <p className="white-70">
                            No of regristrations
                            <br />
                            States
                          </p>
                          <p className="white-70">
                            <i className="material-icons secondary-color">
                              pie_chart
                            </i>
                            <span className="chart-title">Pie Chart</span>
                          </p>
                          <h6>Width</h6>
                          <div className="dropdown mt-3 d-none d-md-flex d-lg-flex langDropdown">
                            <div
                              className="dropdown-toggle dropdownColumnLink"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {"4 Columns"}{" "}
                            </div>
                            <div
                              className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                              aria-labelledby="dropdownRoleLink"
                              // onClick={this.handleLanguageChange}
                            >
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="4 Columns"
                              >
                                4 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="8 Columns"
                              >
                                8 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="12 Columns"
                              >
                                12 Columns
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="dashboard-item bordered p-3">
                          <h6>
                            Visualization 3
                            <i className="material-icons pull-right">
                              more_vert
                            </i>
                          </h6>
                          <p className="white-70">
                            No of regristrations
                            <br />
                            States
                          </p>
                          <p className="white-70">
                            <i className="material-icons secondary-color">
                              bar_chart
                            </i>
                            <span className="chart-title">Column Chart</span>
                          </p>
                          <h6>Width</h6>
                          <div className="dropdown mt-3 d-none d-md-flex d-lg-flex langDropdown">
                            <div
                              className="dropdown-toggle dropdownColumnLink"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {"4 Columns"}{" "}
                            </div>
                            <div
                              className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                              aria-labelledby="dropdownRoleLink"
                              // onClick={this.handleLanguageChange}
                            >
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="4 Columns"
                              >
                                4 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="8 Columns"
                              >
                                8 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="12 Columns"
                              >
                                12 Columns
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="dashboard-item bordered p-3">
                          <h6>
                            Visualization 4
                            <i className="material-icons pull-right">
                              more_vert
                            </i>
                          </h6>
                          <p className="white-70">
                            No of regristrations
                            <br />
                            States
                          </p>
                          <p className="white-70">
                            <i className="material-icons secondary-color">
                              show_chart
                            </i>
                            <span className="chart-title">Line Chart</span>
                          </p>
                          <h6>Width</h6>
                          <div className="dropdown mt-3 d-none d-md-flex d-lg-flex langDropdown">
                            <div
                              className="dropdown-toggle dropdownColumnLink"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {"4 Columns"}{" "}
                            </div>
                            <div
                              className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                              aria-labelledby="dropdownRoleLink"
                              // onClick={this.handleLanguageChange}
                            >
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="4 Columns"
                              >
                                4 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="8 Columns"
                              >
                                8 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="12 Columns"
                              >
                                12 Columns
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="dashboard-item bordered p-3">
                          <h6>
                            Visualization 5
                            <i className="material-icons pull-right">
                              more_vert
                            </i>
                          </h6>
                          <p className="white-70">
                            No of regristrations
                            <br />
                            States
                          </p>
                          <p className="white-70">
                            <i className="material-icons secondary-color">
                              bar_chart
                            </i>
                            <span className="chart-title">Column Chart</span>
                          </p>
                          <h6>Width</h6>
                          <div className="dropdown mt-3 d-none d-md-flex d-lg-flex langDropdown">
                            <div
                              className="dropdown-toggle dropdownColumnLink"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {"4 Columns"}{" "}
                            </div>
                            <div
                              className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                              aria-labelledby="dropdownRoleLink"
                              // onClick={this.handleLanguageChange}
                            >
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="4 Columns"
                              >
                                4 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="8 Columns"
                              >
                                8 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="12 Columns"
                              >
                                12 Columns
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="dashboard-item bordered p-3">
                          <h6>
                            Visualization 6
                            <i className="material-icons pull-right">
                              more_vert
                            </i>
                          </h6>
                          <p className="white-70">
                            No of regristrations
                            <br />
                            States
                          </p>
                          <p className="white-70">
                            <i className="material-icons secondary-color">
                              bar_chart
                            </i>
                            <span className="chart-title">Column Chart</span>
                          </p>
                          <h6>Width</h6>
                          <div className="dropdown mt-3 d-none d-md-flex d-lg-flex langDropdown">
                            <div
                              className="dropdown-toggle dropdownColumnLink"
                              href="#"
                              role="button"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              {"12 Columns"}{" "}
                            </div>
                            <div
                              className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                              aria-labelledby="dropdownRoleLink"
                              // onClick={this.handleLanguageChange}
                            >
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="4 Columns"
                              >
                                4 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="8 Columns"
                              >
                                8 Columns
                              </p>
                              <p
                                className="dropdown-item dateFilterTextColor"
                                href="#"
                                value="12 Columns"
                              >
                                12 Columns
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddVisualizationModal />
      </div>
    );
  }
}

export default DashboardLayout;
