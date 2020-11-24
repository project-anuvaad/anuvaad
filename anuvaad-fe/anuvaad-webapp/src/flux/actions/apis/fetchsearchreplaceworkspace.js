/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchMTWorkspace extends API {
  constructor(pagesize, pageno, status, step, filter, target, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.FETCH_WORKSPACE;
    this.pagesize = pagesize;
    this.pageno = pageno;
    this.status = status;
    this.filter = filter;
    this.step = step;
    this.target = target;
    this.fetch_workspace = {};
    this.endpoint = ENDPOINTS.fetchsearchreplaceworkspace;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res.data) {
      this.fetch_workspace = { data: res.data, count: res.count };
    }
  }

  apiEndPoint() {
    let url = this.filter
      ? `${super.apiEndPointAuto()}${this.endpoint}?pagesize=${this.pagesize}&pageno=${this.pageno}&search_param=${this.filter}`
      : `${super.apiEndPointAuto()}${this.endpoint}?pagesize=${this.pagesize}&pageno=${this.pageno}`;
    if (this.step) {
      url = url + `&step=${this.step}`;
    } else if (this.status) {
      url = url + `&status=${this.status}`;
    }
    if (this.target) {
      url = url + `&target_language=${this.target}`;
    }
    return url;
  }

  getHeaders() {
    return {
      headers: {
         'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json"
      }
    };
  }

  getPayload() {
    return this.fetch_workspace;
  }
}
