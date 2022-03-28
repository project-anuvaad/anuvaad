import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ListVisualizations extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  searchDashboardItems = event => {
    var input, filter, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formItems = document.getElementsByClassName("dashboard-item");
    for (i = 0; i < formItems.length; i++) {
      a = formItems[i].getElementsByClassName("title")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        formItems[i].parentNode.parentNode.style.display = "";
      } else {
        formItems[i].parentNode.parentNode.style.display = "none";
      }
    }
  };

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
                      Add Visualization
                    </button>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-3">
                    <div className="form-group has-search">
                      <i className="material-icons form-control-feedback">
                        search
                      </i>
                      <input
                        type="text"
                        className="form-control"
                        id="search-roles"
                        placeholder="Search for a visualization"
                        autoComplete="off"
                        onKeyUp={event => this.searchDashboardItems(event)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">
                            Visualization 1 (Display name 1){" "}
                          </span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 2</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 3</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 4</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 5</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 6</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 7</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 8</span>
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
                        </p>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/visualizations/1/data">
                      <div className="dashboard-item bordered p-3">
                        <h6>
                          <span className="title">Visualization 9</span>
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
                        </p>
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

export default ListVisualizations;
