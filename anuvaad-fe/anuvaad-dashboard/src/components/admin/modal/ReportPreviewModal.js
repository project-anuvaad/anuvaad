import React, { Component } from "react";
// import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ReportPreviewModal extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  closeModal = (event) => {
    document.getElementById("reportPreviewModal").style.display = "none";
  };

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div
        className="modal fade show"
        id="reportPreviewModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="addUserModalLabel"
        aria-hidden="true"
        // aria-modal="true"
        // style={{ paddingRight: "8px", display: "block" }}
      >
        <div
          className="modal-dialog modal-xxl"
          role="document"
          style={{ minHeight: "50vh" }}
        >
          <div className="modal-content modal-content">
            <div className="pull-right preview-btn-container">
              <button
                type="button"
                className="btn btn-modal default btn-close-preview pull-right"
                data-dismiss="modal"
                onClick={(event) => this.closeModal(event)}
              >
                <span className="mr-2">X</span> Close Preview
              </button>
            </div>
            <div className="modal-body">
              <div className="row modal-body-container">
                <div className="col-md-12 admin-right-section pl-5">
                  <div className="col-md-12 mt-5">
                    <h6>Name of the report</h6>
                  </div>
                  <div className="row col-md-12 mt-4">
                    <div className="col-md-10">
                      <label>Grade</label>
                      <div className="dropdown mt-2 d-none d-md-flex d-lg-flex">
                        <span
                          className="dropdown-toggle mr-5"
                          href="#"
                          role="button"
                          id="dropdownRoleLink"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          {"Select grade"}{" "}
                        </span>
                        <div
                          className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                          aria-labelledby="dropdownRoleLink"
                          // onClick={this.handleLanguageChange}
                        >
                          <p
                            className="dropdown-item dateFilterTextColor"
                            href="#"
                            value="Select grade"
                          >
                            Select grade
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <span className="pull-right pointer">
                        <i className="material-icons absolute">
                          cloud_download
                        </i>
                        <span className="button-text">Download</span>
                      </span>
                    </div>
                  </div>
                  <div className="row col-md-12 mt-5">
                    <div className="col-12">
                      <table
                        className="table borderless table-striped users-list"
                        id="borderless"
                      >
                        <tbody>
                          <tr>
                            <td width="33%">Filename.csv</td>
                            <td width="33%">Ajay Gosh</td>
                            <td width="33%">Uploaded on 10/03/220</td>
                          </tr>
                          <tr>
                            <td width="33%">Filename.csv</td>
                            <td width="33%">Ajay Gosh</td>
                            <td width="33%">Uploaded on 10/03/220</td>
                          </tr>
                          <tr>
                            <td width="33%">Filename.csv</td>
                            <td width="33%">Ajay Gosh</td>
                            <td width="33%">Uploaded on 10/03/220</td>
                          </tr>
                        </tbody>
                      </table>
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

export default ReportPreviewModal;
