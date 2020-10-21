import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class MarkInactive extends API {
  constructor(jobId, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.MARK_INACTIVE ;
    this.jobId = jobId;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.mark_inactive}`
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.sentences = res;
      
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
        "jobIDs": [this.jobId]
    }
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
    return this.sentences;
  }
}