import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import AddUserModal from "../modal/AddUserModal";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ListRoles extends Component {
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
                <div className="row col-md-12">
                  <div className="col-md-12 mt-5">
                    <Link
                      to={"/admin/roles"}
                      className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                        this.props.location.pathname.match("/admin/roles")
                          ? "selected"
                          : "grey-text"
                      }`}
                    >
                      Roles
                    </Link>
                    <Link
                      to={"/admin/users"}
                      className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                        this.props.location.pathname.match("/admin/users")
                          ? "selected"
                          : "grey-text"
                      }`}
                    >
                      Users
                    </Link>
                  </div>
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    {/* <button
                      type="button"
                      className="btn theme"
                      data-toggle="modal"
                      data-target="#addUserModal"
                    >
                      New user
                    </button> */}
                    <button type="button" className="btn theme">
                      Add a new role
                    </button>
                    {/* <button type="button" className="btn default">
                      Add role to an existing user
                    </button> */}
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
                        placeholder="Search for a role"
                        autoComplete="off"
                        onKeyUp={event => this.searchDashboardItems(event)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-4">
                    <Link to="/admin/roles/1/edit">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Super Admin</span> <br />{" "}
                              <span className="recordCount">1 User</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/roles/2/edit">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Country Manager</span>{" "}
                              <br />{" "}
                              <span className="recordCount">2 Users</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/roles/3/edit">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Area Manager</span> <br />{" "}
                              <span className="recordCount">4 Users</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-4">
                    <Link to="/admin/roles/4/edit">
                      <div className="dashboard-item bordered">
                        <div className="row col-12">
                          <div className="col-2">
                            <span className="ml-3 profileCircle textColor text-uppercase">
                              DB
                            </span>
                          </div>
                          <div className="col-10">
                            <p className="p-3 one-line">
                              <span className="title">Fourth Role</span> <br />{" "}
                              <span className="recordCount">3 Users</span>
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
        <AddUserModal />
      </div>
    );
  }
}

export default ListRoles;
