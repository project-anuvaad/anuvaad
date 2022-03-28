import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import AddUserToRoleModal from "../modal/AddUserToRoleModal";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class AddRole extends Component {
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
                    <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown">
                      <Link to="/admin/roles" className="formAnchor grey-text">
                        ALL ROLES
                      </Link>{" "}
                      <i className="material-icons white-70 ml-2 mr-2">
                        arrow_forward_ios
                      </i>
                      <span
                        className="dropdown-toggle mr-5"
                        href="#"
                        role="button"
                        id="dropdownRoleLink"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        {"Country Manager"}{" "}
                      </span>
                      <div
                        className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                        aria-labelledby="dropdownRoleLink"
                        // onClick={this.handleLanguageChange}
                      >
                        <p
                          className="dropdown-item dateFilterTextColor"
                          href="#"
                          value="Country Manager"
                        >
                          Country Manager
                        </p>
                        <p
                          className="dropdown-item dateFilterTextColor"
                          href="#"
                          value="Area Manager"
                        >
                          Area Manager
                        </p>
                        <p
                          className="dropdown-item dateFilterTextColor"
                          href="#"
                          value="Fourth Role"
                        >
                          Fourth Role
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <h5>Permissions</h5>
                  </div>
                </div>
                <div className="row col-md-12 mt-4 permissions">
                  <div className="col-md-12">
                    <div className="module-permissions">
                      <span className="module-name">Module 1</span>
                      <span class="checkbox pull-right">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Select all</label>
                      </span>
                    </div>
                  </div>
                  <div className="row col-md-12 mt-3 ml-1">
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4 permissions">
                  <div className="col-md-12">
                    <div className="module-permissions">
                      <span className="module-name">Module 2</span>
                      <span class="checkbox pull-right">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Select all</label>
                      </span>
                    </div>
                  </div>
                  <div className="row col-md-12 mt-3 ml-1">
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4 permissions">
                  <div className="col-md-12">
                    <div className="module-permissions">
                      <span className="module-name">Module 3</span>
                      <span class="checkbox pull-right">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Select all</label>
                      </span>
                    </div>
                  </div>
                  <div className="row col-md-12 mt-3 ml-1">
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                    <div className="col-md-3">
                      <span class="checkbox">
                        <input type="checkbox" name="selecl-all-permissions" />
                        <label for="checkbox"> Checkbox item</label>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <h5>Users</h5>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-12">
                    <button
                      type="button"
                      className="btn theme"
                      data-toggle="modal"
                      data-target="#addUserToRoleModal"
                    >
                      Add a user
                    </button>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-3">
                    <div className="form-group has-search">
                      <span className="fa fa-search form-control-feedback"></span>
                      <input
                        type="text"
                        className="form-control"
                        id="search-roles"
                        placeholder="Search for a user"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4 mb-5">
                  <div className="col-12">
                    <table
                      className="table borderless table-striped users-list"
                      id="borderless"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              AJ
                            </span>{" "}
                            Adam John
                          </td>
                          <td>10/03/220</td>
                          <td>3 roles</td>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              SA
                            </span>
                            <span className="profileCircle textColor text-uppercase">
                              CM
                            </span>
                            <span className="profileCircle textColor text-uppercase">
                              AM
                            </span>
                          </td>
                          <td>
                            <i className="fa fa-ellipsis-h"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              BJ
                            </span>{" "}
                            Barun Joshi
                          </td>
                          <td>11/03/220</td>
                          <td>2 roles</td>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              CM
                            </span>
                            <span className="profileCircle textColor text-uppercase">
                              AM
                            </span>
                          </td>
                          <td>
                            <i className="fa fa-ellipsis-h"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              AB
                            </span>{" "}
                            Anupriya Bose
                          </td>
                          <td>12/03/220</td>
                          <td>1 role</td>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              AM
                            </span>
                          </td>
                          <td>
                            <i className="fa fa-ellipsis-h"></i>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              AS
                            </span>{" "}
                            Ajay Singh
                          </td>
                          <td>13/03/220</td>
                          <td>1 role</td>
                          <td>
                            <span className="profileCircle textColor text-uppercase">
                              AM
                            </span>
                          </td>
                          <td>
                            <i className="fa fa-ellipsis-h"></i>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddUserToRoleModal />
      </div>
    );
  }
}

export default AddRole;
