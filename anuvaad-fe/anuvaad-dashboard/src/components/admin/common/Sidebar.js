import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  render() {
    // console.log(this.props);
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <ul className="menu-items">
        <Link to="/admin/dashboards">
          <li
            className={`${
              this.props.location.pathname.match("/admin/dashboards")
                ? "active white-90"
                : "white-90"
            }`}
          >
            Dashboard
          </li>
        </Link>
        <Link to="/admin/roles">
          <li
            className={`${
              this.props.location.pathname.match("/admin/roles") ||
              this.props.location.pathname.match("/admin/users")
                ? "active white-90"
                : "white-90"
            }`}
          >
            Users and Roles
          </li>
        </Link>
        <Link to="/admin/visualizations">
          <li
            className={`${
              this.props.location.pathname.match("/admin/visualizations")
                ? "active white-90"
                : "white-90"
            }`}
          >
            Visualizations
          </li>
        </Link>
        <Link to="/admin/filters">
          <li
            className={`${
              this.props.location.pathname.match("/admin/filters")
                ? "active  white-90"
                : "white-90"
            }`}
          >
            Filters
          </li>
        </Link>
        <Link to="/admin/forms">
          <li
            className={`${
              this.props.location.pathname.match("/admin/forms")
                ? "active  white-90"
                : "white-90"
            }`}
          >
            Forms
          </li>
        </Link>
        <Link to="/admin/reports">
          <li
            className={`${
              this.props.location.pathname.match("/admin/reports")
                ? "active  white-90"
                : "white-90"
            }`}
          >
            Reports
          </li>
        </Link>
      </ul>
    );
  }
}

export default Sidebar;
