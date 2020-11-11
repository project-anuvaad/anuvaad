import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "./../../../../translations.js";
import { LANG } from "../../../../constants/index.js";
// const $ = window.$;

let strings = new LocalizedStrings(translations);

class Radio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
    };
  }

  componentDidMount() {
    if (this.props.field.isRequired) {
      let radioOptions = document.querySelectorAll(
        "input[name=field-" + this.props.field.order + "]"
      );
      radioOptions[0].checked = true;
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
          <label>{this.props.field.name}</label>
          <div className="row col-md-12">
            {this.props.field.values.map((option, key) => (
              <div className="radio" key={key}>
                <label htmlFor={"field-" + this.props.field.order}>
                  <input
                    type="radio"
                    name={"field-" + this.props.field.order}
                    value={option.key}
                  />
                  {" " + option.value}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default Radio;
