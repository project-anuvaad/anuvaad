import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import FormTopPanel from "./FormTopPanel";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";
import Notify from "../../../helpers/notify";
import { FormService } from "../../../services/form.service";
import { APP } from "../../../constants";

let strings = new LocalizedStrings(translations);

class FormAccess extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formDetails: {},
      language: "en"
    };
    this.loadFormDetails = this.loadFormDetails.bind(this);
  }

  componentDidMount() {
    this.loadFormDetails(this.props.match.params.id);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.location.pathname !== this.props.location.pathname) {
      this.loadFormDetails(this.props.match.params.id);
    }
  }

  loadFormDetails = formId => {
    FormService.find(formId).then(
      response => {
        if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
          this.setState({
            formDetails: response.responseData
          });
        } else {
          Notify.error(response.statusInfo.errorMessage);
        }
      },
      error => {
        error.statusInfo
          ? Notify.error(error.statusInfo.errorMessage)
          : Notify.error(error.message);
      }
    );
  };

  searchItems = (event) => {
    var input, filter, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formItems = document.getElementsByClassName("sfi");
    for (i = 0; i < formItems.length; i++) {
      a = formItems[i].getElementsByClassName("title")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        formItems[i].style.display = "";
      } else {
        formItems[i].style.display = "none";
      }
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
                <FormTopPanel
                  form={this.state.formDetails}
                  location={this.props.location}
                />
                <div className="row col-md-12 mt-5">
                  <div className="col-md-4">
                    <p>All user roles</p>
                    <div className="form-group has-search">
                      <div className="row col-md-10 mb-4">
                        <i className="material-icons form-control-feedback">
                          search
                        </i>
                        <input
                          type="text"
                          className="form-control"
                          id="search-roles"
                          placeholder="Search for a role"
                          autoComplete="off"
                          onKeyUp={(event) => this.searchItems(event)}
                        />
                      </div>
                      <div class="col-md-10 sfi filter-item mt-2 p-2">
                        <span class="profileCircle textColor">SA</span>
                        <span className="title">Super Admin</span>
                      </div>
                      <div class="col-md-10 sfi filter-item mt-2 p-2">
                        <span class="profileCircle textColor">FR</span>
                        <span className="title">Fourth Role</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <p>Have access</p>
                    <div class="col-md-10 filter-item mt-2 p-2 blue-border">
                      <span class="profileCircle textColor">AM</span>
                      <span>Area Manager</span>
                    </div>
                    <div class="col-md-10 filter-item mt-2 p-2 blue-border">
                      <span class="profileCircle textColor">CM</span>
                      <span>Country Manager</span>
                    </div>
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

export default FormAccess;
