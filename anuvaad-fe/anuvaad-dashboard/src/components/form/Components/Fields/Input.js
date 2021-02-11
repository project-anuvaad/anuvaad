import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "./../../../../translations.js";
import { LANG } from "../../../../constants/index.js";
// const $ = window.$;

let strings = new LocalizedStrings(translations);

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldType: "",
      language: "en",
    };
  }

  componentDidMount() {
    if (
      LANG.FIELD_TYPES.numeric === LANG.FIELD_TYPES[this.props.field.fieldType]
    ) {
      this.setState({
        fieldType: LANG.NUMBER,
      });
    } else {
      this.setState({
        fieldType: this.props.field.fieldType,
      });
    }
    if (this.props.field.isRequired) {
      document.getElementById(
        "field-" + this.props.field.order
      ).required = true;
    }
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="form-group">
        <div
          className={`col-md-${
            this.props.field.width ? this.props.field.width : LANG.DEFAULT_COL
          }`}
        >
          <label htmlFor={"field-" + this.props.field.order}>
            {this.props.field.name}
          </label>
          <input
            type={this.state.fieldType}
            id={"field-" + this.props.field.order}
            name={"field-" + this.props.field.order}
            className="form-control"
            placeholder={strings.typeHere}
            autoComplete="off"
          />
        </div>
      </div>
    );
  }
}

export default Input;
