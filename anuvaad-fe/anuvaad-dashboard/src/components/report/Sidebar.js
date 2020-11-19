import React, { Component } from "react";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../translations.js";

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
    var ar = [1, 2, 3, 4, 5];
    return (
      <>
        <div className="col-md-12 mt-4">
          <div className="form-group has-search">
            <i className="material-icons form-control-feedback">search</i>
            <input
              type="text"
              className="form-control search-items has-search"
              id="search-items"
              placeholder="Search for an item"
            />
          </div>
        </div>
        <h6 className="pl-3 mt-4">3 items</h6>
        <ul className="report-items">
          {ar.map((item, index) => (
            <li
              key={index}
              className={`${
                this.props.location.pathname.match("/reports/" + item)
                  ? "active white-90"
                  : "white-70"
              }`}
            >
              <Link to={"/reports/" + item + "/details"}>
                <div className="row col-12">
                  <div className="col-2">
                    <span className="mt-4 profileCircle textColor text-uppercase">
                      TA
                    </span>
                  </div>
                  <div className="col-10">
                    <p
                      className="pt-4 pl-3 one-line"
                      title="Teacher Assessment Report"
                    >
                      <span className="form-title">
                        Teacher Assessment Report {item}
                      </span>
                      <br />
                      <span className="recordCount">3k {strings.records}</span>
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }
}

export default Sidebar;
