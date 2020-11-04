import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class BulkSearchAPI extends API {
  constructor(offset, limit, jobIds=[''], searchForNewJob=false, isNextPage=false, updateExisting=false, timeout = 2000) {
    super("POST", timeout, false);
    this.type     = C.FETCHDOCUMENT;

    if (searchForNewJob) {
      this.type   = C.FETCHDOCUMENT_NEWJOB;
    }
    if (isNextPage) {
      this.type   = C.FETCHDOCUMENT_NEWJOB;
    }
    if (updateExisting) {
      this.type   = C.FETCHDOCUMENT_EXISTING;
    }

    this.offset   = offset;
    this.limit    = limit;
    this.jobIds   = jobIds;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetchducuments}`
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
      "offset": this.offset,
      "limit": this.limit,
      "jobIDs": this.jobIds,
      "taskDetails": true,
      "workflowCodes": ["DP_WFLOW_FBT","WF_A_FCBMTKTR","DP_WFLOW_FBTTR"],
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