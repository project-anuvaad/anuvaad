import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class FormTopPanel extends Component {
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
              <Link to="/admin/forms" className="formAnchor white-70">
                FORMS
              </Link>{" "}
              <i className="material-icons white-70 ml-2 mr-2">
                arrow_forward_ios
              </i>
              {this.props.form.title && (
                <>
                  <span
                    className="dropdown-toggle mr-5"
                    href="#"
                    role="button"
                    id="dropdownRoleLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    {this.props.form.title}{" "}
                  </span>
                  <div
                    className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                    aria-labelledby="dropdownRoleLink"
                    // onClick={this.handleLanguageChange}
                  >
                    <p
                      className="dropdown-item dateFilterTextColor"
                      href="#"
                      value={this.props.form.title}
                    >
                      {this.props.form.title}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="row col-md-12">
          <div className="col-md-12 mt-4">
            <Link
              to={"/admin/forms/" + this.props.form.id + "/layout"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match("/admin/forms/[0-9]*/layout")
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              Layout
            </Link>
            <Link
              to={"/admin/forms/" + this.props.form.id + "/access"}
              className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                this.props.location.pathname.match("/admin/forms/[0-9]*/access")
                  ? "selected white-90"
                  : "white-70"
              }`}
            >
              Access
            </Link>
            {this.props.location.pathname.match(
              "/admin/forms/[0-9]*/layout"
            ) && (
              <Link
                className="pull-right white-90"
                to={"/admin/forms/" + this.props.form.id + "/edit"}
              >
                <button className="btn action">
                  <i className="material-icons absolute">edit</i>
                  <span className="button-text">Edit Layout</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default FormTopPanel;
