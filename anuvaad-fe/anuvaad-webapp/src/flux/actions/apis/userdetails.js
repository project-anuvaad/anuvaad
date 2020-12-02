/**
 * UserInfo API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchUserDetails extends API {
  constructor(token,timeout = 200000) {
    super("GET", timeout, false);
    this.type = C.FETCH_USERINFO;
    this.token = token;
    this.data = null;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.userdetails}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    this.data = res.data;
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
         'auth-token': `${this.token}`
      }
    };
  }

  getPayload() {
    return this.data;
  }
}
