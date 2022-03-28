import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Icon } from "native-base";
import { Router, Scene } from "react-native-router-flux";
import LoginScreen from "./ui/containers/mobile/Login";
import Layout from "./ui/containers/mobile/Layout";
import DashboardScreen from "./ui/containers/mobile/Dashboard";

class TabIcon extends PureComponent {
  render() {
    const { focused, androidIconName } = this.props;
    const color = focused ? "#00cc5f" : "#301c2a";
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center"
        }}
      >
        <Icon style={{ color }}  size={18} />
      </View>
    );
  }
}

TabIcon.defaultProps = {
  focused: false
};

TabIcon.propTypes = {
  focused: PropTypes.bool,
};

/* eslint-disable */
export default class AppRoutes extends PureComponent {
  render() {
    const renderRightButton = function() {
      return (
        <View style={{ alignItems: "center", alignSelf: "center", justifyContent: "center" }}>
          <Icon style={{ color: "white", paddingRight: "3%" }} ios="ios-search" android="md-search" size={18} />
        </View>
      );
    };

    return (
      <Router>
        <Scene key="root" headerMode="none">
          <Scene key="login" hideNavBar component={LoginScreen} initial />
          <Scene
              key="dashboard"
              component={props => <Layout component={DashboardScreen} {...props} />}
              authenticate={false}
              icon={TabIcon}
            />
        
        </Scene>
      </Router>
    );
  }
}
