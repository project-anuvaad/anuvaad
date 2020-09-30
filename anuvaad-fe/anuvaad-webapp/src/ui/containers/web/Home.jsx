import React from "react";
import CONFIG from "../../../configs/apigw";
const TELEMETRY = require('../../../utils/TelemetryManager')

class Home extends React.Component {
  state = {
    showLoader: false
  };
  componentDidMount() {
    this.setState({ showLoader: true });
    window.location.href =
      CONFIG.BASE_URL +
      CONFIG.AUTH_ENDPOINT +
      "?" +
      CONFIG.RESPONSE_TYPE +
      "&" +
      CONFIG.CLIENT_ID +
      "&" +
      CONFIG.REDIRECT_URI +
      "&" +
      CONFIG.RETURN_TO;
  }

  render() {
    /**
     * loading the telemetry sdk
     */
    TELEMETRY.init()
    return <div>{'Redirecting Please wait..'}</div>;
  }
}

export default Home;
