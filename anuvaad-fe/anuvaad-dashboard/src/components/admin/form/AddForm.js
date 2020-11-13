import React, { Component } from "react";
import { Link } from "react-router-dom";
import BrandNavBar from "../../dashboard/components/common/BrandNavBar";
import HeaderNavBar from "../../dashboard/components/common/HeaderNavBar";
import Sidebar from "../common/Sidebar";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";
import Field from "./elements/Field";
import Separator from "./elements/Separator";
import Heading from "./elements/Heading";
import { LANG, APP } from "../../../constants";
import { FormService } from "../../../services/form.service";
import Notify from "../../../helpers/notify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Sortable from "sortablejs";

let strings = new LocalizedStrings(translations);

class AddForm extends Component {
  constructor(props) {
    super(props);
    this.addElement = this.addElement.bind(this);
    this.removeElement = this.removeElement.bind(this);
    this.resetElements = this.resetElements.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      language: "en",
      formElements: [],
      formDetails: {
        id: "",
        version: "",
        title: "",
        fields: []
      }
    };
  }

  componentDidMount() {
    // $(".sortable").sortable();
    // (function () {
    //   let el = document.getElementById("items");
    //   Sortable.create(el, { animation: 300 });
    // })("docReady", window);
    (function() {
      let el = document.getElementById("items");
      Sortable.create(el, { animation: 300 });
    })();
    if (this.props.match.params.id) {
      let addFormItem = document.getElementById("active");
      if (addFormItem) {
        addFormItem.classList.add("active");
      }
      FormService.find(this.props.match.params.id).then(
        response => {
          if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
            this.setState({
              formDetails: response.responseData
            });
            document.getElementById("id").value = response.responseData.id;
            document.getElementById("version").value =
              response.responseData.version;
            if (response.responseData.fields) {
              response.responseData.fields.map(element => {
                switch (element.fieldType) {
                  case LANG.SEPARATOR:
                    return this.addElement(LANG.SEPARATOR);
                  case LANG.HEADING:
                    return this.addElement(LANG.HEADING);
                  default:
                    return this.addElement(LANG.FIELD);
                }
              });
            }
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
    } else {
      //   this.props.eraseFormDetails();
    }
  }

  handleChange = event => {
    event.persist();
    this.setState(prevState => ({
      ...prevState,
      formDetails: {
        ...prevState.formDetails,
        [event.target.name]: event.target.value
      }
    }));
    let formName = document.getElementById("form-name");
    if (event.target.name === "title" && formName) {
      formName.innerHTML = event.target.value;
    }
  };

  addElement = element => {
    this.state.formElements.push(element);
    this.setState({
      formElements: this.state.formElements
    });
  };

  removeElement = index => {
    // console.log(this.state.formElements)
    confirmAlert({
      title: LANG.CONFIRM_TO_REMOVE,
      message: LANG.ARE_YOU_SURE_YOU_WANT_TO_DO_THIS,
      buttons: [
        {
          label: LANG.REMOVE,
          onClick: () => {
            delete this.state.formElements[index];
            this.setState({
              formElements: this.state.formElements
            });
          }
        },
        {
          label: LANG.CANCEL,
          onClick: () => {
            return false;
          }
        }
      ]
    });
  };

  resetElements = () => {
    this.setState({
      formElements: [],
      formDetails: {}
    });
  };

  submit = () => {
    let formData = {};
    formData.id = this.state.formDetails.id;
    formData.version = this.state.formDetails.version;
    formData.title = this.state.formDetails.title;
    formData.fields = [];
    let cards = document.getElementsByClassName("card");
    for (let i = 0; i < cards.length; i++) {
      let field = {};
      field.refApi = "";
      field.logicalGroupCode = "";
      field.name = cards[i].querySelector(".fieldName").value;
      field.fieldType = cards[i].querySelector(".fieldType").value;
      field.values = [];
      if (
        field.fieldType !== LANG.HEADING ||
        field.fieldType !== LANG.SEPARATOR
      ) {
        let tags = cards[i].querySelectorAll(".input-tag__tags li");
        for (let j = 0; j < tags.length; j++) {
          if (j + 1 < tags.length) {
            let tag = tags[j].innerHTML.split("<");
            if (tag[0]) {
              let option = {};
              option.key = tag[0];
              option.value = tag[0];
              field.values.push(option);
            }
          }
        }
        let width = cards[i].querySelector(".width");
        if (width) {
          field.width = parseInt(width.value);
        } else {
          field.width = null;
        }
        let isRequired = cards[i].querySelector(".isRequired");
        if (isRequired) {
          field.isRequired = cards[i].querySelector(".isRequired").checked;
        } else {
          field.isRequired = false;
        }
      }
      field.order = i + 1;
      if (field.fieldType === LANG.HEADING) {
        field.values = [];
        let heading = {};
        heading.heading = cards[i].querySelector(".heading").value;
        heading.subHeading = cards[i].querySelector(".subHeading").value;
        field.values.push(heading);
      }
      formData.fields.push(field);
    }
    FormService.add(formData).then(
      response => {
        if (response.statusInfo.statusCode === APP.CODE.SUCCESS) {
          Notify.success(response.statusInfo.statusMessage);
          //   this.props.updateParent(response.responseData.id);
          this.props.history.push("/admin/forms");
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
    console.log(formData);
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
                  <div className="col-9">
                    <Link to="/admin/forms" className="formAnchor white-70">
                      FORMS
                    </Link>{" "}
                    {!this.props.match.params.id && (
                      <>
                        <i className="material-icons white-70 absolute">
                          arrow_forward_ios
                        </i>
                        ADD
                      </>
                    )}
                    {this.props.match.params.id && (
                      <>
                        <i className="material-icons white-70 absolute">
                          arrow_forward_ios
                        </i>
                        <span className="white-70 button-text">
                          {this.state.formDetails.title.toUpperCase()}
                        </span>
                        <i className="material-icons white-70 absolute">
                          arrow_forward_ios
                        </i>
                        <span className="white-90 button-text">EDIT</span>
                      </>
                    )}
                  </div>
                  <div className="col-3">
                    <button
                      onClick={this.submit}
                      type="button"
                      id="submit"
                      className="btn primary pull-right"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
                <div className="col-md-12">
                  <form autoComplete="new-password" id="add-form">
                    {/* <div className="row col-md-12 pt-4">
                      <div className="col-md-3 text-center mt-2 pointer">
                        <i className="fa fa-trash fa-2x"></i> Delete form
                      </div>
                    </div> */}
                    <div style={{ visibility: "hidden" }}>
                      <input
                        type="text"
                        name="id"
                        id="id"
                        value={this.state.formDetails.id || ""}
                        onChange={this.handleChange}
                      />
                      <input
                        type="text"
                        name="version"
                        id="version"
                        value={this.state.formDetails.version || ""}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="row col-md-12">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="field-name">Form Title</label>
                          <input
                            type="text"
                            id="title"
                            name="title"
                            className="form-control input-bg-2"
                            placeholder="Type here"
                            onChange={this.handleChange}
                            onBlur={this.handleChange}
                            value={this.state.formDetails.title || ""}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="card-columns row col-md-12 mt-4">
                      <div className="col-md-12">
                        <div className="sortable" id="items">
                          {this.state.formElements &&
                            this.state.formElements.map((element, index) => {
                              switch (element) {
                                case LANG.FIELD:
                                  return (
                                    <Field
                                      key={index}
                                      index={index}
                                      data={
                                        this.state.formDetails.fields
                                          ? this.state.formDetails.fields[index]
                                          : null
                                      }
                                      removeElement={this.removeElement}
                                    />
                                  );
                                case LANG.SEPARATOR:
                                  return (
                                    <Separator
                                      key={index}
                                      index={index}
                                      data={
                                        this.state.formDetails.fields
                                          ? this.state.formDetails.fields[index]
                                          : null
                                      }
                                      removeElement={this.removeElement}
                                    />
                                  );
                                case LANG.HEADING:
                                  return (
                                    <Heading
                                      key={index}
                                      index={index}
                                      data={
                                        this.state.formDetails.fields
                                          ? this.state.formDetails.fields[index]
                                          : null
                                      }
                                      removeElement={this.removeElement}
                                    />
                                  );
                                default:
                                  return <></>;
                              }
                            })}
                        </div>
                      </div>
                    </div>
                  </form>

                  <div className="row col-md-12 mt-3 mb-4">
                    <div className="field-options row col-md-12 ml-3 justify-content-center">
                      <div
                        onClick={() => this.addElement(LANG.FIELD)}
                        className="pointer"
                      >
                        <button className="btn action">
                          <i className="material-icons absolute">add</i>
                          <span className="button-text">New field</span>
                        </button>
                      </div>

                      <div
                        onClick={() => this.addElement(LANG.SEPARATOR)}
                        className="pointer"
                      >
                        <button className="btn action">
                          <i className="material-icons absolute">drag_handle</i>
                          <span className="button-text">Add separator</span>
                        </button>
                      </div>

                      <div
                        onClick={() => this.addElement(LANG.HEADING)}
                        className="pointer"
                      >
                        <button className="btn action">
                          <i className="material-icons absolute">title</i>
                          <span className="button-text">
                            Add section handling
                          </span>
                        </button>
                      </div>
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

export default AddForm;
