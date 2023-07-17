/**
 * Login API
 */
import API from "../api";
import C from "../../constants";
import CONFIGS from "../../../../configs/configs";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class LogoutAPI extends API {
  constructor(userName, timeout = 2000) {
    super("POST", timeout, false);
    this.userName = userName;
    this.type = C.LOGOUT;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.logout}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.response = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      userName: this.userName,
    }
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.response;
  }

}
