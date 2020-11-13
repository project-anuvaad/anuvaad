import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class VisualizationTopPanel extends Component {
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
              <Link to="/admin/visualizations" className="formAnchor white-70">
                VISUALIZATIONS
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
                {"Visualization 1"}{" "}
              </span>
              <div
                className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                aria-labelledby="dropdownRoleLink"
                // onClick={this.handleLanguageChange}
              >
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="Visualization 1"
                >
                  Visualization 1
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="row col-md-12">
          <div className="col-md-12 mt-4">
            <Link
              to={"/admin/visualizations/1/data"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match(
                  "/admin/visualizations/[0-9]*/data"
                )
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              Data
            </Link>
            <Link
              to={"/admin/visualizations/1/access"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match(
                  "/admin/visualizations/[0-9]*/access"
                )
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              Access
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default VisualizationTopPanel;
