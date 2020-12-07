import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchBenchmarkCompareModel extends API {
  constructor(basename, timeout = 200000) {
    super("GET", timeout, false);
    this.basename = basename;
    this.type = C.FETCHFILEDETAILS;
    this.endpoint =ENDPOINTS.fetch_filedeatils;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.sentences = res.data;
    }
  }

  apiEndPoint() {
    return `${super.apiEndPointAuto()}${this.endpoint}filename=${this.basename}`;
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
    return this.sentences;
  }
}