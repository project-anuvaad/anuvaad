import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ListDashboards extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
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
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <button type="button" className="btn theme">
                      Add Dashboard
                    </button>
                  </div>
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-4">
                    <Link to="/admin/dashboards/1/layout">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3">
                              <span className="form-title">Dashboard 1</span>{" "}
                              <br />{" "}
                              <span className="recordCount">2.4k Records</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/dashboards/2/layout">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3">
                              <span className="form-title">Dashboard 2</span>{" "}
                              <br />{" "}
                              <span className="recordCount white-70">
                                1.2k Records
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/dashboards/3/layout">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3">
                              <span className="form-title">Dashboard 3</span>{" "}
                              <br />{" "}
                              <span className="recordCount">3.2k Records</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/dashboards/4/layout">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3">
                              <span className="form-title">Dashboard 4</span>{" "}
                              <br />{" "}
                              <span className="recordCount">3.2k Records</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListDashboards;
