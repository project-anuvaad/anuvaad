import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ListFilters extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  searchFilterItems = event => {
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
                      Add Filter
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
                        placeholder="Search for a filter"
                        autoComplete="off"
                        onKeyUp={event => this.searchFilterItems(event)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-4">
                    <Link to="/admin/filters/1/details">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              TR
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Time Range</span> <br />{" "}
                              <span className="recordCount">Gobal Default</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/filters/1/details">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              IS
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">India States</span> <br />{" "}
                              <span className="recordCount">States</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/filters/1/details">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              CL
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Courses List</span> <br />{" "}
                              <span className="recordCount">Courses</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/filters/1/details">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              AD
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Ahandra Districts</span>{" "}
                              <br />{" "}
                              <span className="recordCount">Districts</span>
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

export default ListFilters;
