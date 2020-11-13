import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ReportTopPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div>
        <div className="row col-md-12 mt-5">
          <div className="col-md-12">
            <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown">
              <Link to="/admin/reports" className="formAnchor white-70">
                REPORTS
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
                {"Report 1"}{" "}
              </span>
              <div
                className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                aria-labelledby="dropdownRoleLink"
                // onClick={this.handleLanguageChange}
              >
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="Report 1"
                >
                  Report 1
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row col-md-12">
          <div className="col-md-12 mt-4">
            <Link
              to={"/admin/reports/1/details"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match(
                  "/admin/reports/[0-9]*/details"
                )
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              General
            </Link>
            <Link
              to={"/admin/reports/1/access"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match(
                  "/admin/reports/[0-9]*/access"
                )
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              Access
            </Link>
            <Link
              to={"/admin/reports/1/filters"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match(
                  "/admin/reports/[0-9]*/filters"
                )
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              Filters
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ReportTopPanel;
