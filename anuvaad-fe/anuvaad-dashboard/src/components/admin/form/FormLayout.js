import React, { Component } from "react";
// import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import FormTopPanel from "./FormTopPanel";
import Sidebar from "../common/Sidebar";
import { FormService } from "../../../services/form.service";
import { APP } from "../../../constants";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";
import { FormGenerator } from "tarento-react-form-generator";
import Notify from "../../../helpers/notify";

let strings = new LocalizedStrings(translations);

class FormLayout extends Component {
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
                <div className="row">
                  <div className="col-md-12 white-90">
                    <FormGenerator formData={this.state.formDetails} />
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

export default FormLayout;
