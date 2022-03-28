import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import * as moment from "moment";
import { UserService } from "../../../../services/user.service";
import { defaults } from "react-chartjs-2";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";

/**
 * Header Navbar Component
 * Holds menus and placed after BrandNavBar component
 */

let strings = new LocalizedStrings(translations);

class HeaderNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      active: false,
      currentDate: "",
      currentUser: "",
      theme: "",
      currentTheme: "",
      genAvatar: "",
      colorTrigger: ""
    };
    this.getCurrentDate = this.getCurrentDate.bind(this);
    this.logout = this.logout.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("language")) {
      this.setState({
        language: localStorage.getItem("language")
      });
    }
    localStorage.getItem("currentTheme") === "Dark theme"
      ? this.setState(
          { theme: "dark", currentTheme: "Light theme", colorTrigger: true },
          () => {
            document.documentElement.setAttribute(
              "data-theme",
              this.state.theme
            );
          }
        )
      : this.setState(
          { theme: "light", currentTheme: "Dark theme", colorTrigger: false },
          () => {
            document.documentElement.setAttribute(
              "data-theme",
              this.state.theme
            );
          }
        );
    // this.setState({
    //   theme: 'light',
    //   currentTheme: 'Dark theme'
    // }, () => {document.documentElement.setAttribute("data-theme", this.state.theme)});

    this.getCurrentDate();
  }

  /**
   * Function to get current date, year, month and
   * converting those into the required format
   * using moment.js
   */
  async getCurrentDate() {
    let date = new Date();
    await this.setState({
      currentDate: moment(date).format("dddd, Do MMMM YYYY")
    });
    let userDetails = localStorage.getItem("user");
    userDetails = JSON.parse(userDetails);
    let userName = userDetails.username;
    let name = userName.split("@");
    this.setState(
      {
        currentUser: name[0]
      },
      () => this.nameAvatar()
    );
  }

  /**
   * Logout function
   */
  logout = () => {
    UserService.logout();
    this.props.history.push("/login");
  };

  nameAvatar = () => {
    let genAvat = this.state.currentUser
      .split(/\s/)
      .reduce((res, letter) => (res += letter.slice(0, 1)), "");
    this.setState({
      genAvatar: genAvat
    });
    // return this.state.genAvatar;
  };

  handleLanguageChange(e) {
    e.preventDefault();
    let lang = e.target.innerHTML;
    lang = lang.toLowerCase();
    if (lang.length === 2) {
      this.setState(
        prevState => ({
          language: lang
        }),
        () => {
          localStorage.setItem("language", this.state.language);
          this.props.pathName.history.push({
            pathName: "/reports",
            state: { language: this.state.language }
          });
          this.props.pathName.history.push({
            pathName: "/admin/dashboards",
            state: { language: this.state.language }
          });
        }
      );
    } else {
      this.setState(
        prevState => ({
          language: "en"
        }),
        () => {
          localStorage.setItem("language", this.state.language);
          this.props.pathName.history.push({
            pathName: "/reports",
            state: { language: this.state.language }
          });
          this.props.pathName.history.push({
            pathName: "/admin/dashboards",
            state: { language: this.state.language }
          });
        }
      );
    }
  }

  // static getDerivedStateFromProps() {
  //
  // }

  /**
   * Function to change theme from the dropdown
   */
  changeTheme = () => {
    this.state.currentTheme === "Dark theme"
      ? this.setState(
          { theme: "dark", currentTheme: "Light theme", colorTrigger: true },
          () => {
            document.documentElement.setAttribute(
              "data-theme",
              this.state.theme
            );
          }
        )
      : this.setState(
          { theme: "light", currentTheme: "Dark theme", colorTrigger: false },
          () => {
            document.documentElement.setAttribute(
              "data-theme",
              this.state.theme
            );
          }
        );
    localStorage.setItem("currentTheme", this.state.currentTheme);
    defaults.global.defaultFontColor = "grey";
    this.props.pathName.history.push({
      pathName: "/dashboards",
      state: { colorTrigger: this.state.colorTrigger }
    });
  };

  render() {
    strings.setLanguage(this.state.language);
    return (
      <nav className="navbar col-md-10 col-lg-10 col-xl-10 tabText navHeight tabText mainNavBarbuiltBorder">
        <div className="row">
          <NavLink
            activeClassName="active"
            className={`anchor paddingTop10 pl-4 pr-4 pt-3 pb-2 mainBarPosition ${
              this.props.pathName.location.pathname.match("/home")
                ? "active"
                : ""
            }`}
            to="/dashboards"
          >
            {strings.dashboards}
            <hr
              className={
                this.props.pathName.location.pathname === "/dashboards"
                  ? "btmLine anchor"
                  : "btmLineNone"
              }
            />
            <hr
              className={
                this.props.pathName.location.pathname === "/home"
                  ? "btmLine anchor"
                  : "btmLineNone"
              }
            />
          </NavLink>
          {/* <NavLink
            activeClassName="active"
            className="anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition"
            to="/forms"
          >
            {strings.forms}
            <hr
              className={
                this.props.pathName.location.pathname.match("/forms") &&
                !this.props.pathName.location.pathname.match("/admin/forms")
                  ? "btmLine anchor"
                  : "btmLineNone"
              }
            />
          </NavLink>
          <NavLink
            activeClassName="active"
            className={`anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition ${
              this.props.pathName.location.pathname.match("/reports") &&
              !this.props.pathName.location.pathname.match("/admin/reports")
                ? "active"
                : ""
            }`}
            to="/reports/1/details"
          >
            {strings.reports}
            <hr
              className={
                this.props.pathName.location.pathname.match("/reports") &&
                !this.props.pathName.location.pathname.match("/admin/reports")
                  ? "btmLine anchor"
                  : "btmLineNone"
              }
            />
          </NavLink>
          <NavLink
            activeClassName="active"
            className={`anchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 d-none d-md-inline d-lg-inline mainBarPosition ${
              this.props.pathName.location.pathname.match("/admin")
                ? "active"
                : ""
            }`}
            to="/admin/dashboards"
          >
            {strings.admin}
            <hr
              className={
                this.props.pathName.location.pathname.match("/admin")
                  ? "btmLine anchor"
                  : "btmLineNone"
              }
            />
          </NavLink> */}
        </div>
        <div className="moveRight paddingTop10 textColorPopup">
          <div className="row pt-2">
            <p className="d-none d-md-none d-lg-flex mt-1 datePosition">
              {this.state.currentDate}
            </p>
            {/*Dropdown one*/}
            {/* <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown cursorStyleOne">
              <p
                className="dropdown-toggle mr-5"
                href="#"
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {this.state.language.toUpperCase() ||
                  localStorage.getItem("language").toUpperCase()}{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </p>
              <div
                className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                aria-labelledby="dropdownMenuLink"
                onClick={this.handleLanguageChange}
              >
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="en"
                >
                  EN
                </p>
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="gu"
                >
                  GU
                </p>
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="hi"
                >
                  HI
                </p>
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="kn"
                >
                  KN
                </p>
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="ml"
                >
                  ML
                </p>
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="se"
                >
                  SE
                </p>
                <p
                  className="dropdown-item dateFilterTextColor"
                  href="#"
                  value="ta"
                >
                  TA
                </p>
              </div>
            </div> */}
            {/*Dropdown two for small screens*/}
            <div className="dropdown">
              <p
                className="d-md-none d-lg-none d-sm-flex pr-3"
                role="button"
                id="dropdownMenuLinkThree"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="mt-1">{this.state.currentUser}</span>
                <span
                  className="ml-2 cursorStyleOne profileCircle textColorPopup text-uppercase"
                  style={{ marginBottom: "0.5em" }}
                >
                  {this.state.genAvatar}
                  {/*<img src="img/userProfile.png" width="25" height="25" alt="user profile"/>*/}
                </span>
              </p>
              <div
                className="dropdown-menu profileDropdown mr-5 cursorStyleOne pr-5"
                aria-labelledby="dropdownMenuLinkThree"
              >
                <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.changeTheme}
                >
                  {this.state.currentTheme}
                </p>
                <NavLink exact to="/helpPage">
                  <p className="dropdown-item dateFilterTextColor">Help</p>
                </NavLink>
                <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.logout}
                >
                  Logout
                </p>
              </div>
            </div>
            {/*Dropdown two*/}
            <div className="dropdown">
              <p
                className="mr-5 d-none d-md-flex d-lg-flex"
                role="button"
                id="dropdownMenuLinkTwo"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="mt-1">{this.state.currentUser}</span>
                <span
                  className="ml-3 cursorStyleOne profileCircle textColorPopup text-uppercase"
                  style={{ marginBottom: "0.5em" }}
                >
                  {this.state.genAvatar}
                  {/*<img src="img/userProfile.png" width="25" height="25" alt="user profile"/>*/}
                </span>
              </p>
              <div
                className="dropdown-menu profileDropdown mr-5 cursorStyleOne"
                aria-labelledby="dropdownMenuLinkTwo"
              >
                <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.changeTheme}
                >
                  {this.state.currentTheme}
                </p>
                <NavLink exact to="/helpPage">
                  <p className="dropdown-item dateFilterTextColor">Help</p>
                </NavLink>
                <p
                  className="dropdown-item dateFilterTextColor"
                  onClick={this.logout}
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default HeaderNavBar;
