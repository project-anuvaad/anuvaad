import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "./../../../../translations.js";
import { LANG } from "../../../../constants/index.js";
// const $ = window.$;

let strings = new LocalizedStrings(translations);

class Textarea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
    };
  }

  componentDidMount() {
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
          <textarea
            id={"field-" + this.props.field.order}
            name={"field-" + this.props.field.order}
            className="form-control"
            placeholder={strings.typeHere}
            autoComplete="off"
          ></textarea>
        </div>
      </div>
    );
  }
}

export default Textarea;
