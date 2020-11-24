import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchBenchmarkModel extends API {
  constructor(basename, model, pagesize, pageno, status, timeout = 200000) {
    super("GET", timeout, false);
    this.config =[]
    this.type = C.FETCH_DEFAULT_CONFIG;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetchdefaultconfig}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.config = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {};
  }

  getHeaders() {
    this.headers = {
      headers: {
         'auth-token': `${decodeURI(localStorage.getItem("token"))}`
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.config;
  }
}