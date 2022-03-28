import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import ReportTopPanel from "./ReportTopPanel";
import Sidebar from "../common/Sidebar";
import ReportPreviewModal from "../modal/ReportPreviewModal";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ReportDetails extends Component {
  constructor(props) {
    super(props);
    this.state = { language: "en" };
  }

  // openFullScreen = () => {
  //   var elem = document.getElementById("borderless");
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.mozRequestFullScreen) {
  //     /* Firefox */
  //     elem.mozRequestFullScreen();
  //   } else if (elem.webkitRequestFullscreen) {
  //     /* Chrome, Safari and Opera */
  //     elem.webkitRequestFullscreen();
  //   } else if (elem.msRequestFullscreen) {
  //     /* IE/Edge */
  //     elem.msRequestFullscreen();
  //   }
  // };

  openFullScreen = () => {
    document.getElementById("reportPreviewModal").style.display = "block";
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
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section">
                <Sidebar location={this.props.location} />
              </div>
              <div className="col-md-10 admin-right-section">
                <ReportTopPanel location={this.props.location} />
                <div className="row mt-5">
                  <div className="col-md-5 white-90">
                    <div className="form-group">
                      <div className="col-md-8">
                        <label htmlFor="unique-name">Unique Name</label>
                        <input
                          type="text"
                          name="unique-name"
                          className="form-control input-bg-2"
                          placeholder={strings.typeHere}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-8">
                        <label htmlFor="display-name">Display Name</label>
                        <input
                          type="text"
                          name="display-name"
                          className="form-control input-bg-2"
                          placeholder={strings.typeHere}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-12">
                        <label htmlFor="display-name">
                          Type of data source
                        </label>
                        <div>
                          <button className="btn default admin-table-bg">
                            <i className="material-icons absolute">
                              description
                            </i>
                            <span className="button-text">Form</span>
                          </button>
                          <button className="btn default admin-table-bg active">
                            <i className="material-icons absolute">code</i>
                            <span className="button-text">API</span>
                          </button>
                          <button className="btn default admin-table-bg">
                            <i className="material-icons absolute">
                              file_upload
                            </i>
                            <span className="button-text">Upload</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-md-8">
                        <label htmlFor="source">Source</label>
                        <input
                          type="text"
                          name="source"
                          className="form-control input-bg-2"
                          placeholder={strings.typeHere}
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-7"></div>
                </div>
                <div className="row col-md-12 mt-5">
                  <div className="col-md-5">
                    <h6>Customize the report</h6>
                  </div>
                  <div className="col-md-6">
                    <div className="pull-right white-70">
                      <button className="btn action">
                        <i className="material-icons absolute">history</i>
                        <span className="button-text">Restore to original</span>
                      </button>
                      <button className="btn action">
                        <i className="material-icons absolute">reorder</i>
                        <span className="button-text">Enable Reorder</span>
                      </button>
                      <button
                        className="btn action"
                        onClick={event => this.openFullScreen(event)}
                      >
                        <i className="material-icons absolute">
                          remove_red_eye
                        </i>
                        <span className="button-text">Show Preview</span>
                      </button>
                    </div>
                  </div>
                  <div className="col-md-1 pt-2">
                    <span className="ml-2 checkbox">
                      <input type="checkbox" name="selecl-all-permissions" />
                      <label htmlFor="checkbox"> Select all</label>
                    </span>
                  </div>
                  <div className="col-md-12 mt-4 mb-5">
                    <table
                      className="table borderless table-striped users-list"
                      id="borderless"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <span className="checkbox">
                              <input
                                type="checkbox"
                                className="mr-2 mt-2"
                                name="selecl-all-permissions"
                              />
                              <label htmlFor="checkbox"> Column 1</label>
                            </span>
                          </td>
                          <td>
                            <span className="checkbox">
                              <input
                                type="checkbox"
                                className="mr-2 mt-2"
                                name="selecl-all-permissions"
                              />
                              <label htmlFor="checkbox"> Column 2</label>
                            </span>
                          </td>
                          <td>
                            <span className="checkbox">
                              <input
                                type="checkbox"
                                className="mr-2 mt-2"
                                name="selecl-all-permissions"
                              />
                              <label htmlFor="checkbox"> Column 3</label>
                            </span>
                          </td>
                          <td>
                            <span className="checkbox">
                              <input
                                type="checkbox"
                                className="mr-2 mt-2"
                                name="selecl-all-permissions"
                              />
                              <label htmlFor="checkbox"> Column 4</label>
                            </span>
                          </td>
                          <td>
                            <span className="checkbox">
                              <input
                                type="checkbox"
                                className="mr-2 mt-2"
                                name="selecl-all-permissions"
                              />
                              <label htmlFor="checkbox"> Column 5</label>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>Row 1</td>
                          <td>Adam John</td>
                          <td>Uploaded on 10/03/220</td>
                          <td>Entry</td>
                          <td>Entry</td>
                        </tr>
                        <tr>
                          <td>Row 2</td>
                          <td>Barun Joshi</td>
                          <td>Uploaded on 11/03/220</td>
                          <td>Entry</td>
                          <td>Entry</td>
                        </tr>
                        <tr>
                          <td>Row 3</td>
                          <td>Anupriya Bose</td>
                          <td>Uploaded on 12/03/220</td>
                          <td>Entry</td>
                          <td>Entry</td>
                        </tr>
                        <tr>
                          <td>Row 4</td>
                          <td>Ajay Singh</td>
                          <td>Uploaded on 13/03/220</td>
                          <td>Entry</td>
                          <td>Entry</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReportPreviewModal />
      </div>
    );
  }
}

export default ReportDetails;
