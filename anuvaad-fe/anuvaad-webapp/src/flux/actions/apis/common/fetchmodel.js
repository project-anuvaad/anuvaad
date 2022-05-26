/**
 * Login API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class FetchModel extends API {
  constructor(timeout = 200000) {
    super("POST", timeout, false);
    this.type = C.FETCH_MODEL;
    this.fetch_model = null;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetchmodel}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    console.log("user model data--- ", res.data)
    this.fetch_model = res.data;
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
