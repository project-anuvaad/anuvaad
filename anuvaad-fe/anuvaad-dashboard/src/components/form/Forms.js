import React, { Component } from "react";
import PropTypes from "prop-types";
import BrandNavBar from "../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../dashboard/components/common/HeaderNavBar";
import FormDetails from "./Components/FormDetails";
import UploadForm from "./Components/UploadForm";
import Records from "./Components/Records";
import AddForm from "./Components/AddForm";
import { Link } from "react-router-dom";
import LocalizedStrings from "react-localization";
import { translations } from "../../translations.js";
import { FormService } from "./../../services/form.service";
import { APP } from "./../../constants";
import Notify from "./../../helpers/notify";
// const $ = window.$;

/**
 * Forms landing page
 */
let strings = new LocalizedStrings(translations);

class Forms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadFormDetails: true,
      formDetails: {},
      loadUploadForm: false,
      loadRecords: false,
      loadAddForm: false,
      forms: [],
      language: "en",
    };
    this.loadFormDetails = this.loadFormDetails.bind(this);
    this.getFormShortCode = this.getFormShortCode.bind(this);
    this.updateComponent = this.updateComponent.bind(this);
    this.eraseFormDetails = this.eraseFormDetails.bind(this);
  }

  componentDidMount() {
    this.updateComponent(this.props.match.params.id);
  }

  componentDidUpdate(nextProps) {
    if (
      nextProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname === "/forms"
    ) {
      this.eraseFormDetails();
    }
    if (
      nextProps.location.pathname !== this.props.location.pathname &&
      this.props.location.pathname === "/forms/add"
    ) {
      let formItem = document.getElementsByClassName("addFormItem");
      formItem[0].classList.add("active");
    }
  }

  eraseFormDetails = () => {
    let formItem = document.getElementsByClassName("formItem active");
    if (formItem.length) {
      formItem[0].classList.remove("active");
    }
    this.setState({
      formDetails: {},
    });
  };

  updateComponent = (formId) => {
    FormService.get().then(
      (response) => {
        if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
          this.setState({
            forms: response.responseData,
          });
          if (formId) {
            this.loadFormDetails(formId);
          }
        } else {
          Notify.error(response.statusInfo.errorMessage);
        }
      },
      (error) => {
        error.statusInfo
          ? Notify.error(error.statusInfo.errorMessage)
          : Notify.error(error.message);
      }
    );
  };

  getFormShortCode = (name) => {
    let shortCode;
    if (name.length) {
      let words = name.split(" ");
      if (words[0]) {
        shortCode = words[0].charAt(0);
      }
      if (words[1]) {
        shortCode = shortCode + words[1].charAt(0);
      }
    }
    return shortCode;
  };

  loadFormDetails = (formId) => {
    FormService.find(formId).then(
      (response) => {
        if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
          this.setState({
            formDetails: response.responseData,
          });
          console.log(response.responseData);
        } else {
          Notify.error(response.statusInfo.errorMessage);
        }
      },
      (error) => {
        error.statusInfo
          ? Notify.error(error.statusInfo.errorMessage)
          : Notify.error(error.message);
      }
    );
  };

  searchForms = (event) => {
    var input,
      filter,
      formContainer,
      formItems,
      formItemsCount,
      a,
      i,
      txtValue,
      count = 0;
    input = event.target.value;
    filter = input.toUpperCase();
    formContainer = document.getElementById("forms-container");
    formItemsCount = document.getElementById("form-items-count");
    formItems = formContainer.getElementsByClassName("formItem");
    for (i = 0; i < formItems.length; i++) {
      a = formItems[i].getElementsByClassName("form-title")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        count++;
        formItems[i].style.display = "";
      } else {
        formItems[i].style.display = "none";
      }
    }
    formItemsCount.innerHTML = count;
  };

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG">
        <div className="row">
          <BrandNavBar />
          <HeaderNavBar pathName={this.props} history={this.props.history} />
        </div>
        <div className="row tabText">
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section">
                <div className="col-md-12 mt-4">
                  <div className="form-group has-search">
                    <i className="material-icons form-control-feedback">
                      search
                    </i>
                    <input
                      type="text"
                      className="form-control search-items has-search"
                      id="search-input"
                      placeholder={strings.searchForForm}
                      onKeyUp={(event) => this.searchForms(event)}
                    />
                  </div>
                </div>
                <h6 className="pl-3 mt-4 itemsCount">
                  <span id="form-items-count">{this.state.forms.length}</span>{" "}
                  {strings.items}
                </h6>
                <ul className="report-items" id="forms-container">
                  {this.state.forms.map((form, key) => (
                    <li
                      key={key}
                      className={`formItem ${
                        this.props.location.pathname.match("/forms/" + form.id)
                          ? "active white-90"
                          : "white-70"
                      }`}
                    >
                      <Link key={key} to={"/forms/" + form.id + "/details"}>
                        <div
                          className="row col-12"
                          onClick={(event) => this.loadFormDetails(form.id)}
                          id={"form-" + form.id}
                        >
                          <div className="col-2">
                            <span className="mt-4 profileCircle textColor text-uppercase white-90">
                              {this.getFormShortCode(form.title)}
                            </span>
                          </div>
                          <div className="col-10">
                            <p
                              className="pt-4 pl-3 one-line"
                              title={form.title}
                            >
                              <span className="form-title">{form.title}</span>
                              <br />
                              <span className="recordCount">
                                {form.noOfRecords} {strings.records}
                              </span>
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-10 admin-right-section mt-5">
                {this.state.formDetails.id && (
                  <div className="row col-md-12">
                    <div className="col-md-9">
                      <Link
                        to={"/forms/" + this.state.formDetails.id + "/details"}
                        className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                          this.props.location.pathname.match(
                            "/forms/[0-9]*/details"
                          )
                            ? "selected"
                            : ""
                        }`}
                      >
                        {strings.form} {}
                      </Link>
                      <Link
                        to={"/forms/" + this.state.formDetails.id + "/uploads"}
                        className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                          this.props.location.pathname.match(
                            "/forms/[0-9]*/uploads"
                          )
                            ? "selected"
                            : ""
                        }`}
                      >
                        {strings.upload}
                      </Link>
                      <Link
                        to={"/forms/" + this.state.formDetails.id + "/records"}
                        className={`formAnchor paddingTop10 ml-0 pl-4 pr-4 pt-3 pb-2 ${
                          this.props.location.pathname.match(
                            "/forms/[0-9]*/records"
                          )
                            ? "selected"
                            : ""
                        }`}
                      >
                        {strings.allRecords}
                      </Link>
                    </div>
                  </div>
                )}
                {this.props.location.pathname === "/forms" && (
                  <div className="row mt-5">
                    <div className="col-12">
                      <h5 className="fd-main text-center">
                        Select a form from left pane to view details
                      </h5>
                    </div>
                  </div>
                )}
                {this.props.location.pathname.match(
                  "/forms/[0-9]*/details"
                ) && <FormDetails formDetails={this.state.formDetails} />}
                {this.props.location.pathname.match(
                  "/forms/[0-9]*/uploads"
                ) && <UploadForm />}
                {this.props.location.pathname.match(
                  "/forms/[0-9]*/records"
                ) && <Records />}
                {this.props.location.pathname === "/forms/add" && (
                  <AddForm
                    eraseFormDetails={this.eraseFormDetails}
                    updateParent={this.updateComponent}
                    history={this.props.history}
                  />
                )}
                {this.props.location.pathname.match("/forms/[0-9]*/edit") && (
                  <AddForm
                    updateParent={this.updateComponent}
                    history={this.props.history}
                    formId={this.props.match.params.id}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Forms;
