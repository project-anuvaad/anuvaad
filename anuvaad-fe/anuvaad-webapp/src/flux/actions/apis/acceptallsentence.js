/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class AcceptAllSentence extends API {
  constructor(workspace, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SENTENCEREPLACE;
    this.workspace = workspace;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.acceptallsentence}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.result = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      processId: this.workspace.processId,
      source_search: this.workspace.changes && this.workspace.changes.length > 0 && this.workspace.changes[0].source_search
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.result;
  }
}
