import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../dashboard/components/common/HeaderNavBar";
import Sidebar from "./Sidebar";
import FormTopPanel from "./FormTopPanel";
import LocalizedStrings from "react-localization";
import { translations } from "../../translations.js";

let strings = new LocalizedStrings(translations);

class FormUpload extends Component {
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
                    <FormTopPanel location={this.props.location} />
                  </div>
                  <div className="col-md-2">
                    <span className="pull-right pointer">
                      <i className="fa fa-cloud-download mr-1"></i> Download
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
    );
  }
}

export default FormUpload;
