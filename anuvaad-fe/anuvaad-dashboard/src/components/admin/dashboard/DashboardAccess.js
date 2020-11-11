import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import DashboardTopPanel from "./DashboardTopPanel";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class DashboardAccess extends Component {
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
                <DashboardTopPanel location={this.props.location} />
                <div className="col-md-12 p-4 mt-3 access-roles">
                  <p>2 User Roles</p>
                  <div>
                    <button type="button" className="btn theme">
                      Add
                    </button>
                    <button type="button" className="btn default blue-border">
                      <span class="profileCircle textColor">SA</span> Country
                      ManagerSuper Admin
                    </button>
                    <button type="button" className="btn default blue-border">
                      <span class="profileCircle textColor">CM</span> Country
                      Manager
                    </button>
                    <span className="pull-right white-70">
                      <i className="fa fa-chevron-down mr-3"></i>
                      Expand more
                    </span>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-12 mb-4">6 Visualizations</div>
                  <div className="col-md-4">
                    <div className="dashboard-item bordered p-3">
                      <h6>
                        Visualization 1 (Display name 1){" "}
                        <i className="material-icons pull-right">more_vert</i>
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
                        <button className="btn btn-role pull-right">
                          2 roles
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="dashboard-item bordered p-3">
                      <h6>
                        Visualization 2
                        <i className="material-icons pull-right">more_vert</i>
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
                        <button className="btn btn-role pull-right">
                          2 roles
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="dashboard-item bordered p-3">
                      <h6>
                        Visualization 3
                        <i className="material-icons pull-right">more_vert</i>
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
                        <button className="btn btn-role pull-right">
                          2 roles
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="dashboard-item bordered p-3">
                      <h6>
                        Visualization 4
                        <i className="material-icons pull-right">more_vert</i>
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
                        <button className="btn btn-role pull-right">
                          2 roles
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="dashboard-item bordered p-3">
                      <h6>
                        Visualization 5
                        <i className="material-icons pull-right">more_vert</i>
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
                        <button className="btn btn-role pull-right">
                          2 roles
                        </button>
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="dashboard-item bordered p-3">
                      <h6>
                        Visualization 6
                        <i className="material-icons pull-right">more_vert</i>
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
                        <button className="btn btn-role pull-right active">
                          1 role
                        </button>
                      </p>
                    </div>
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

export default DashboardAccess;
