import React, { Component } from "react";
import PropTypes from "prop-types";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

/**
 * User Management landing page
 */
let strings = new LocalizedStrings(translations);

class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

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
          <div className="col-md-12 mt-5 mb-5">
            <div className="row col-md-12">
              <div
                className="col-md-3 mt-2 mb-2 leftSection"
                style={{ height: "75vh" }}
              >
                <h5 className="m-2">{strings.userRoles}</h5>
                <div className="itemList m-2 ">
                  <h6 className="p-4">{strings.admin}</h6>
                </div>
              </div>
              <div
                className="col-md-9 mt-2 mb-2 rightSection"
                style={{ height: "75vh" }}
              >
                <div className="p-5">
                  <button type="button" className="col-md-12 btn addUserBtn">
                    {strings.addUser}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddUser;
