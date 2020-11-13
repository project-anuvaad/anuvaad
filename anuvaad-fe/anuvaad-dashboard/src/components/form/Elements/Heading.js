import React, { Component } from "react";

class Heading extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      heading: "",
      subHeading: "",
    };
  }

  componentDidMount() {
    // console.log("Heading: ", this.props.data);
    if (this.props.data) {
      this.setState({
        heading: this.props.data.values[0].heading,
        subHeading: this.props.data.values[0].subHeading,
      });
    }
  }

  handleChange = (event) => {
    let field = event.target.name.replace("[]", "");
    this.setState({
      [field]: event.target.value,
    });
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row col-md-12">
            <div className="col-md-3">
              <div className="form-group">
                <input
                  type="hidden"
                  className="fieldName"
                  name="fieldName[]"
                  value="heading"
                />
                <input
                  type="hidden"
                  className="fieldType"
                  name="fieldType[]"
                  value="heading"
                />
                <label htmlFor="heading">Heading</label>
                <input
                  type="text"
                  name="heading[]"
                  className="form-control heading"
                  placeholder="Type here"
                  onChange={this.handleChange}
                  value={this.state.heading || ""}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="subHeading">Sub Heading</label>
                <input
                  type="text"
                  name="subHeading[]"
                  className="form-control subHeading"
                  placeholder="Type here"
                  onChange={this.handleChange}
                  value={this.state.subHeading || ""}
                />
              </div>
            </div>
            <div className="col-md-3">
              <i
                onClick={() => this.props.removeElement(this.props.index)}
                className="fa fa-trash fa-2x pull-right pointer"
              ></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Heading;
