import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../dashboard/components/common/HeaderNavBar";
import Sidebar from "./Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../translations.js";

let strings = new LocalizedStrings(translations);

class ListReports extends Component {
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
                <div className="row col-md-12 mt-5">
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
                    <button className="btn action pull-right pointer">
                      <i className="material-icons absolute">cloud_download</i>
                      <span className="button-text">Download</span>
                    </button>
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
    );
  }
}

export default ListReports;
