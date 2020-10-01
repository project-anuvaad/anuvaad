import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import Tab from "../../../components/web/common/Tab";
import history from "../../../../web.history";

class ParentTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 2,
      tabItem: ["Existing workspaces", "Run Experiment", "Processing"]
    };
  }

  handleValueChange(value) {
    if (value === 0) {
      history.push(`${process.env.PUBLIC_URL}/stage5/existing-workspace`);
    } else if (value === 1) {
      history.push(`${process.env.PUBLIC_URL}/stage5/create-workspace`);
    } else if (value === 2) {
      history.push(`${process.env.PUBLIC_URL}/stage5/workspace-details`);
    }
  }

  render() {
    return (
      <div>
        <Tab
          tabItem={this.state.tabItem}
          handleChange={this.handleValueChange.bind(this)}
          activeStep={this.props.activeStep}
          style={this.props.style}
          color="primary"
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ParentTab));
