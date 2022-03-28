import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";
import { FormGenerator } from "tarento-react-form-generator";
// import { LANG } from "./../../../constants";
// import Input from "./Fields/Input";
// import Radio from "./Fields/Radio";
// import Checkbox from "./Fields/Checkbox";
// import Select from "./Fields/Select";
// import Toggle from "./Fields/Toggle";
// import Textarea from "./Fields/Textarea";
// import Rating from "./Fields/Rating";
// import Heading from "./Fields/Heading";
// import Separator from "./Fields/Separator";
// const $ = window.$;

let strings = new LocalizedStrings(translations);

class FormDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
    };
  }

  componentDidMount() {
    // console.log(this.props.formDetails);
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="row pr-4 mt-4">
        <div className="col-12">
          <FormGenerator formData={this.props.formDetails} />
          {/* <h4 className="ml-3 mb-4">{this.props.formDetails.title}</h4>
          <form autoComplete="off" className="pb-5">
            {this.props.formDetails.fields &&
              this.props.formDetails.fields.map((field, index) => {
                switch (field.fieldType) {
                  case LANG.SEPARATOR:
                    return <Separator key={index} />;
                  case LANG.HEADING:
                    return <Heading key={index} field={field} />;
                  default:
                    switch (LANG.FIELD_TYPES[field.fieldType]) {
                      case LANG.FIELD_TYPES.text:
                        return <Input key={index} field={field} />;
                      case LANG.FIELD_TYPES.numeric:
                        return <Input key={index} field={field} />;
                      case LANG.FIELD_TYPES.date:
                        return <Input key={index} field={field} />;
                      case LANG.FIELD_TYPES.email:
                        return <Input key={index} field={field} />;
                      case LANG.FIELD_TYPES.dropdown:
                        return <Select key={index} field={field} />;
                      case LANG.FIELD_TYPES.radio:
                        return <Radio key={index} field={field} />;
                      case LANG.FIELD_TYPES.checkbox:
                        return <Checkbox key={index} field={field} />;
                      case LANG.FIELD_TYPES.boolean:
                        return <Toggle key={index} field={field} />;
                      case LANG.FIELD_TYPES.textarea:
                        return <Textarea key={index} field={field} />;
                      case LANG.FIELD_TYPES.rating:
                        return <Rating key={index} field={field} />;
                      default:
                        return <div key={index}></div>;
                    }
                }
              })}
          </form> */}
        </div>
      </div>
    );
  }
}

export default FormDetails;
