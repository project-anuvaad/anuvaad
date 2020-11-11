import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "./../../../../translations.js";

let strings = new LocalizedStrings(translations);

class Heading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en"
    };
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="form-group">
        <div className="col-md-12 only-label">
          <label htmlFor="dateOfAssessment">
            {this.props.field.values[0].heading}
          </label>
          <p>{this.props.field.values[0].subHeading}</p>
        </div>
      </div>
    );
  }
}

export default Heading;
