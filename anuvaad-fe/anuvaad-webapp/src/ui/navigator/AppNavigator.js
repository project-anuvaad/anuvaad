import React from "react";
import { AsyncStorage } from "react-native";
import { createDrawerNavigator, createSwitchNavigator } from "react-navigation";
import LoginScreen from "../containers/mobile/Login";
import DashboardScreen from "../containers/mobile/Dashboard";
import SideBar from "../components/mobile/Sidebar";

/* eslint-disable */
const authenticateUser = () => {
  let token = AsyncStorage.getItem("token");
  if (token) {
    return true;
  }
  return false;
};
/* eslint-disable */

const Drawer = createDrawerNavigator(
  {
    Dashboard: { screen: DashboardScreen }
  },

  {
    contentComponent: props => <SideBar {...props} />
  },
  {
    initialRouteName: "Dashboard"
  }
);

const PrimaryNav = createSwitchNavigator(
  {
    Login: { screen: LoginScreen },
    Drawer: { screen: Drawer }
  },
  {
    // Default config for all screens
    headerMode: "none",
    initialRouteName: this.authenticateUser ? "Login" : "Drawer"
  }
);

export default PrimaryNav;
