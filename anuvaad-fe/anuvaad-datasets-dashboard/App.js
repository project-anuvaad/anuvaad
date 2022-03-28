import React, { Component } from "react";
import { Provider } from "react-redux";
import storeFactory from "./src/flux/store/store";
import AppRoutes from './src/mobile.routes';


export default class App extends Component {
  render() {
    return (
      <Provider store={storeFactory}>
        <AppRoutes />
      </Provider>
    );
  }
}

