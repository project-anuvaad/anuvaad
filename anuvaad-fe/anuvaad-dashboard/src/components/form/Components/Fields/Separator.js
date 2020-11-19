import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "../../../../translations.js";

let strings = new LocalizedStrings(translations);

class Separator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
    };
  }

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="form-group">
        <div className="col-md-12 only-label">
          <hr />
        </div>
      </div>
    );
  }
}

export default Separator;
