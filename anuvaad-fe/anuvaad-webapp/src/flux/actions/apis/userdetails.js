/**
 * UserInfo API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchUserDetails extends API {
  constructor(timeout = 200000) {
    super("GET", timeout, false);
    this.type = C.FETCH_USERINFO;
    this.fetch_model = null;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.userdetails}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    this.fetch_model = res.response_body;
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {};
  }

  getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
         'auth-token': `${decodeURI(localStorage.getItem("token"))}`
      }
    };
  }

  getPayload() {
    return this.fetch_model;
  }
}
