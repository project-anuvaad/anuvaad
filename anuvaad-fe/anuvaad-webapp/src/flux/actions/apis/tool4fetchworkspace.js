/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class FetchMTWorkspace extends API {
  constructor(source, target, status, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.FETCH_WORKSPACE;
    this.source = source;
    this.target = target;
    this.status = status;

    this.fetch_workspace = {};
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`;
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
    let url = `${super.apiEndPointAuto()}/fetch-search-replace-workspace?source=${this.source}&target_language=${this.target}&status=${this.status}`;

    return url;
  }

  getHeaders() {
    return {
      headers: {
        Authorization: "Bearer " + decodeURI(localStorage.getItem("token")),
        "Content-Type": "application/json"
      }
    };
  }

  getPayload() {
    return this.fetch_workspace;
  }
}
