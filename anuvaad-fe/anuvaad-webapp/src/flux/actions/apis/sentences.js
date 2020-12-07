/**
 * Sentences API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class FetchSentences extends API {
  constructor(basename, pageCount, pageno, status = "", accuracy, timeout = 200000) {
    super("GET", timeout, false);
    this.basename = basename;
    this.sentences = null;
    this.type = C.FETCH_SENTENCES;
    this.pagesize = pageCount;
    this.pageno = pageno;
    this.status = status;
    this.accuracy = accuracy;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.sentences}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.sentences = res;
    }
  }

  apiEndPoint() {
    if (this.status.item === "ALL" || this.status === "" || this.status === "ALL")
      return `${super.apiEndPointAuto()}/fetch-corpus-sentences?basename=${this.basename}&pagesize=${this.pagesize}&pageno=${this.pageno}`;
    else {
      return `${super.apiEndPointAuto()}/fetch-corpus-sentences?basename=${this.basename}&pagesize=${this.pagesize}&pageno=${this.pageno}&status=${
        this.status.item
      }`;
    }
  }

  getBody() {
    return {};
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
    return this.sentences;
  }
}
