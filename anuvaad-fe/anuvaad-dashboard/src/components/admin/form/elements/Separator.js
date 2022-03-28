import React, { Component } from "react";

class Separator extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row col-md-12">
            <div className="col-md-8">
              <input
                type="hidden"
                className="fieldName"
                name="fieldName[]"
                value="separator"
              />
              <input
                type="hidden"
                className="fieldType"
                name="fieldType[]"
                value="separator"
              />
              <hr />
            </div>
            <div className="col-md-4">
              <i
                onClick={() => this.props.removeElement(this.props.index)}
                className="material-icons fa-2x pull-right pointer"
              >delete</i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Separator;
