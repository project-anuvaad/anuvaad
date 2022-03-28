import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "./../../../../translations.js";
import { LANG } from "../../../../constants/index.js";
// const $ = window.$;

let strings = new LocalizedStrings(translations);

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
    };
    this.manageRating = this.manageRating.bind(this);
  }

  componentDidMount() {
    if (this.props.field.isRequired) {
      // document.getElementById("field-" + this.props.field.order).required = true;
    }
  }

  manageRating = (event, rating) => {
    // console.log(event.target);
    let ratingField = document.getElementById("rating");
    let spans = ratingField.getElementsByTagName("span");
    for (let i = 0; i < spans.length; i++) {
      if (i < rating) {
        spans[i].classList.add("checked");
      } else {
        spans[i].classList.remove("checked");
      }
    }
  };

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
          <label htmlFor="grade">{this.props.field.name}</label>
          <div id="rating">
            <span
              onClick={(event) => this.manageRating(event, 1)}
              className="fa fa-star fa-2x pointer"
            >
              &nbsp;
            </span>
            <span
              onClick={(event) => this.manageRating(event, 2)}
              className="fa fa-star fa-2x pointer"
            >
              &nbsp;
            </span>
            <span
              onClick={(event) => this.manageRating(event, 3)}
              className="fa fa-star fa-2x pointer"
            >
              &nbsp;
            </span>
            <span
              onClick={(event) => this.manageRating(event, 4)}
              className="fa fa-star fa-2x pointer"
            >
              &nbsp;
            </span>
            <span
              onClick={(event) => this.manageRating(event, 5)}
              className="fa fa-star fa-2x pointer"
            >
              &nbsp;
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default Rating;
