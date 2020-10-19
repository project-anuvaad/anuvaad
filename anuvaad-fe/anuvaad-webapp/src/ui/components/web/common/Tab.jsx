import React from "react";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

class CenteredTabs extends React.Component {
  handleChange = (event, value) => {
    this.props.handleChange(value);
  };

  render() {
    return (
      <Paper style={this.props.style}>
        <Tabs
          value={this.props.activeStep}
          onChange={this.handleChange}
          indicatorColor={this.props.color}
          textColor={this.props.color}
          color={this.props.color}
          centered
        >
          {typeof this.props.tabItem !== "undefined" && this.props.tabItem.map(label => <Tab key={label} label={label} />)}
        </Tabs>
      </Paper>
    );
  }
}

export default CenteredTabs;
