import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class AddUserToRoleModal extends Component {
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
        id="addUserToRoleModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addUserToRoleModalLabel"
        aria-hidden="true"
        // aria-modal="true"
        // style={{ paddingRight: "8px", display: "block" }}
      >
        <div
          className="modal-dialog modal-lg"
          role="document"
          style={{ minHeight: "50vh" }}
        >
          <div className="modal-content">
            <div className="modal-body">
              <div className="row modal-body-container">
                <div className="row col-md-8 modal-left">
                  <div
                    className="col-md-12"
                    style={{ minHeight: "45vh", position: "relative" }}
                  ></div>
                  <div className="col-md-12" style={{ position: "absolute" }}>
                    <div className="row col-md-12 mt-4">
                      <h5 className="pl-3">Add user</h5>
                    </div>
                    <div className="row col-md-12 mt-3">
                      <div className="col-md-8">
                        <div className="form-group has-search">
                          <span className="fa fa-search form-control-feedback"></span>
                          <input
                            type="text"
                            className="form-control"
                            id="search-users"
                            placeholder="Search for a user"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row col-md-12 mt-2 mb-5">
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
                            </tr>
                            <tr>
                              <td>
                                <span className="profileCircle textColor text-uppercase">
                                  BJ
                                </span>{" "}
                                Barun Joshi
                              </td>
                              <td>11/03/220</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="profileCircle textColor text-uppercase">
                                  AB
                                </span>{" "}
                                Anupriya Bose
                              </td>
                              <td>12/03/220</td>
                            </tr>
                            <tr>
                              <td>
                                <span className="profileCircle textColor text-uppercase">
                                  AS
                                </span>{" "}
                                Ajay Singh
                              </td>
                              <td>13/03/220</td>
                            </tr>
                          </tbody>
                        </table>
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
                      <h5 className="pl-2">Add role</h5>
                    </div>
                    <div className="col-md-11 mt-4">
                      <div className="form-group has-search">
                        <span className="fa fa-search form-control-feedback"></span>
                        <input
                          type="text"
                          className="form-control"
                          id="search-roles"
                          placeholder="Search for a role"
                        />
                      </div>
                    </div>
                    <div className="row col-12">
                      <div className="col-md-12 role ml-2 blue-border">
                        <span className="profileCircle textColor text-uppercase">
                          AM
                        </span>
                        Area Manager
                      </div>
                    </div>
                    <div className="row col-12">
                      <div className="col-md-12 ml-2">
                        <hr />
                      </div>
                    </div>
                    <div className="row col-12 mb-2">
                      <div className="col-md-12 role ml-2">
                        <span className="profileCircle textColor text-uppercase">
                          SA
                        </span>
                        Super Admin
                      </div>
                    </div>
                    <div className="row col-12 mb-2">
                      <div className="col-md-12 role ml-2">
                        <span className="profileCircle textColor text-uppercase">
                          CM
                        </span>
                        Country Manager
                      </div>
                    </div>
                    <div className="row col-12 mb-2">
                      <div className="col-md-12 role ml-2">
                        <span className="profileCircle textColor text-uppercase">
                          FR
                        </span>
                        Fourth Role
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

export default AddUserToRoleModal;
