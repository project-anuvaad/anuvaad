import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import { FormService } from "../../../services/form.service";
import { APP } from "../../../constants";
import Notify from "../../../helpers/notify";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class ListForms extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forms: [],
      language: "en"
    };
    this.getFormShortCode = this.getFormShortCode.bind(this);
  }

  componentDidMount() {
    FormService.get().then(
      response => {
        if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
          this.setState({
            forms: response.responseData
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
  }

  getFormShortCode = name => {
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

  searchForms = event => {
    var input, filter, formContainer, formItems, a, i, txtValue;
    input = event.target.value;
    filter = input.toUpperCase();
    formContainer = document.getElementById("forms-container");
    formItems = formContainer.getElementsByClassName("form-item");
    for (i = 0; i < formItems.length; i++) {
      a = formItems[i].getElementsByClassName("form-title")[0];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        formItems[i].style.display = "";
      } else {
        formItems[i].style.display = "none";
      }
    }
  };

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
          <div className="col-md-12">
            <div className="row admin-pannel">
              <div className="col-md-2 admin-left-section">
                <Sidebar location={this.props.location} />
              </div>
              <div className="col-md-10 admin-right-section">
                <div className="row col-md-12 mt-5">
                  <div className="col-md-12">
                    <Link to="/admin/forms/add">
                      <button type="button" className="btn theme">
                        Add Form
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="row col-md-12 mt-4">
                  <div className="col-md-3">
                    <div className="form-group has-search">
                      <i className="material-icons form-control-feedback">
                        search
                      </i>
                      <input
                        type="text"
                        className="form-control"
                        id="search-roles"
                        placeholder="Search for a form"
                        autoComplete="off"
                        onKeyUp={event => this.searchForms(event)}
                      />
                    </div>
                  </div>
                </div>
                <div className="row col-md-12 mt-4" id="forms-container">
                  {this.state.forms.map((form, key) => (
                    <div className="col-md-4 form-item" key={key}>
                      <Link to={"/admin/forms/" + form.id + "/layout"}>
                        <div className="dashboard-item bordered">
                          <div className="row col-12">
                            <div className="col-2">
                              <span className="ml-3 profileCircle textColor text-uppercase">
                                {this.getFormShortCode(form.title)}
                              </span>
                            </div>
                            <div className="col-10">
                              <p className="p-3 one-line">
                                <span className="form-title">{form.title}</span>
                                <br />
                                <span className="recordCount">
                                  {form.noOfRecords} {strings.records}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ListForms;
