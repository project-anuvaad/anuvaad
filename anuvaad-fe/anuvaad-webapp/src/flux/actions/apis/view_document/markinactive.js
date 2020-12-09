import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

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
      var d = new Date();
      res["timestamp"]= d.getTime()
      this.data = res;
      
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
        'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.data;
  }
}