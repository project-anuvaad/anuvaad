import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class BulkSearchAPI extends API {
  constructor(offset, limit, jobIds = [''], searchForNewJob = false, isNextPage = false, updateExisting = false, userId = [], timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.FETCH_SCHEDULED_JOBS;

    if (searchForNewJob) {
      this.type = C.FETCH_SCHEDULED_NEWJOB;
    }
    if (isNextPage) {
      this.type = C.FETCH_SCHEDULED_NEXTPAGE;
    }
    if (updateExisting) {
      this.type = C.FETCH_EXISTING_SCH_JOB;
    }

    this.offset = offset;
    this.limit = limit;
    this.jobIds = jobIds;
    this.userId = userId
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
      "workflowCodes": ["WF_A_AN"],
      "userIDs": this.userId
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
    return this.sentences;
  }
}