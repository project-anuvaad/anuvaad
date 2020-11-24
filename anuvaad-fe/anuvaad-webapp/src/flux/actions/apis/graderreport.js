import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class GraderReport extends API {
  constructor(from_date, to_date, timeout = 200000) {
    super("GET", timeout, false);
    this.from_date = from_date;
    this.to_date = to_date;
    this.report = null;
    this.type = C.FETCH_GRADER_REPORT;
    this.endpoint = ENDPOINTS.graderreport
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.report = res;
    }
  }

  apiEndPoint() {
    return `${super.apiEndPointAuto()}${this.endpoint}?from_date=${this.from_date}&to_date=${this.to_date}`;
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
    return this.report;
  }
}
