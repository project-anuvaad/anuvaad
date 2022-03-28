import React, { Component } from "react";
import InputTag from "./tags/InputTag";
import { LANG } from "../../../../constants";
const $ = window.$;

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldName: "",
      showInputTag: false,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (this.props.data) {
      $("select[name='fieldType[" + (this.props.data.order - 1) + "]']").val(
        this.props.data.fieldType
      );
      $("select[name='width[" + (this.props.data.order - 1) + "]']").val(
        this.props.data.width
      );
      $("input[name='isRequired[" + (this.props.data.order - 1) + "]']").prop(
        "checked",
        this.props.data.isRequired
      );
      let fieldType = LANG.FIELD_TYPES[this.props.data.fieldType];
      if (
        fieldType === LANG.FIELD_TYPES.dropdown ||
        fieldType === LANG.FIELD_TYPES.checkbox ||
        fieldType === LANG.FIELD_TYPES.radio
      ) {
        this.setState({
          fieldName: this.props.data.name,
          showInputTag: true,
        });
      }
    }
  }

  handleChange = (event) => {
    if (event.target.className === "custom-select fieldType input-bg-2") {
      var value =
        event.currentTarget.options[event.currentTarget.selectedIndex].text;
      if (
        value === LANG.FIELD_TYPES.dropdown ||
        value === LANG.FIELD_TYPES.checkbox ||
        value === LANG.FIELD_TYPES.radio
      ) {
        this.setState({
          showInputTag: true,
        });
      } else {
        this.setState({
          showInputTag: false,
        });
      }
    } else if (event.target.className === "form-control fieldName input-bg-2") {
      this.setState({
        fieldName: event.target.value,
      });
      if (this.props.data) {
        this.props.data.name = event.target.value;
      }
    }
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row col-md-12 pb-2">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="fieldName">Field Name</label>
                <input
                  type="text"
                  name="fieldName[]"
                  className="form-control fieldName input-bg-2"
                  placeholder="Type here"
                  onChange={this.handleChange}
                  onBlur={this.handleChange}
                  value={
                    this.state.fieldName ||
                    (this.props.data ? this.props.data.name : "")
                  }
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="fieldType">Type of Field</label>
                <select
                  className="custom-select fieldType input-bg-2"
                  name={"fieldType[" + this.props.index + "]"}
                  onChange={this.handleChange}
                >
                  <option value="" defaultValue>
                    Select from the dropdown
                  </option>
                  {Object.entries(LANG.FIELD_TYPES).map((t, k) => (
                    <option key={k} value={t[0]}>
                      {t[1]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="fieldType">Width</label>
                <select
                  className="custom-select width input-bg-2"
                  name={"width[" + this.props.index + "]"}
                  onChange={this.handleChange}
                >
                  <option value="" defaultValue>
                    Select from the dropdown
                  </option>
                  {Object.entries(LANG.COL).map((t, k) => (
                    <option key={k} value={t[0]}>
                      {t[1] + " Column"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-2">
              <div className="form-group">
                <label htmlFor="fieldName">Required</label>
                <input
                  type="checkbox"
                  name={"isRequired[" + this.props.index + "]"}
                  className="form-control isRequired pointer mr-2 input-bg-2"
                />
              </div>
            </div>
            <div className="col-md-1">
              <i
                onClick={() => this.props.removeElement(this.props.index)}
                className="material-icons fa-2x pull-right pointer"
              >
                delete
              </i>
            </div>
            {this.state.showInputTag && (
              <div className="col-md-8">
                <InputTag
                  tags={this.props.data ? this.props.data.values : null}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Field;
