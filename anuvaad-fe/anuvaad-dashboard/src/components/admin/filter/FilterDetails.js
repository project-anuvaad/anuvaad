import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class FilterDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addItem: false,
      language: "en",
    };
    this.manageAddItem = this.manageAddItem.bind(this);
  }

  uploadFile = (event) => {
    event.preventDefault();
    let file = event.target.file.files[0];
    if (file) {
      console.log(file);
      // let fileName = file.name,
      //   fileDirectory = "rain";
      // S3.uploadFile(file, fileName, fileDirectory);
    }
  };

  manageFileSelection = (event) => {
    document.getElementById("file").click();
  };

  handleFileChange = (event) => {
    document.getElementById("uploadFile").value = event.target.files[0].name;
  };

  manageAddItem = (event) => {
    if (this.state.addItem === false) {
      this.setState({
        addItem: true,
      });
    }
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
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <div className="dropdown mr-5 mt-1 d-none d-md-flex d-lg-flex langDropdown">
                      <Link to="/admin/filters" className="formAnchor white-70">
                        FILTERS
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
                        {"Filter 1"}{" "}
                      </span>
                      <div
                        className="dropdown-menu mr-5 cursorStyleOne smallDDMenu"
                        aria-labelledby="dropdownRoleLink"
                        // onClick={this.handleLanguageChange}
                      >
                        <p
                          className="dropdown-item dateFilterTextColor"
                          href="#"
                          value="Filter 1"
                        >
                          Filter 1
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mt-5 white-90">
                  <div className="col-md-8">
                    <div className="form-group">
                      <div className="col-md-5">
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
                      <div className="col-md-5">
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
                    <div className="row col-md-12 mt-5 mb-5">
                      <div className="col-md-5">
                        <h6>Items</h6>
                        <form
                          onSubmit={(event) => this.uploadFile(event)}
                          className="mt-4"
                        >
                          <div className="form-group has-search">
                            <div className="row">
                              <div className="col-md-10">
                                <label htmlFor="file">
                                  {strings.uploadFile}(.xcl, .csv)
                                </label>
                                <i className="material-icons upload form-control-feedback">
                                  file_upload
                                </i>
                                <input
                                  type="text"
                                  className="form-control admin-table-bg no-radius"
                                  id="uploadFile"
                                  placeholder={strings.browseForFile}
                                  onClick={(event) =>
                                    this.manageFileSelection(event)
                                  }
                                  readOnly
                                />
                                <input
                                  type="file"
                                  id="file"
                                  style={{ display: "none" }}
                                  className="form-control"
                                  onChange={(event) =>
                                    this.handleFileChange(event)
                                  }
                                  accept=".xlsx, .xls, .csv"
                                />
                              </div>
                              <div className="row col-md-2 associated-btn">
                                <button
                                  type="submit"
                                  id="submit"
                                  className="btn theme no-radius"
                                >
                                  Upload
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                        <div className="col-md-12 mb-4">
                          <span
                            className="pointer white-70"
                            onClick={(event) => this.manageAddItem(event)}
                          >
                            <i className="material-icons absolute">add</i>{" "}
                            <span className="button-text">Add new item</span>
                          </span>
                        </div>
                        {this.state.addItem && (
                          <div className="form-group">
                            {/* <div className="col-md-12"> */}
                            <input
                              type="text"
                              name="display-name"
                              className="form-control input-bg-2"
                              placeholder={strings.typeHere}
                              autoComplete="off"
                            />
                            {/* </div> */}
                          </div>
                        )}
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Andhra Pradesh</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Bihar</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Gujarat</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Jammu & Kashmir</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Kerala</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Haryana</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Assam</span>
                        </div>
                        <div className="col-md-12 p-3 admin-table-bg mt-2">
                          <span className="font-12">Karnataka</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FilterDetails;
