import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class BulkSearchAPI extends API {
  constructor(offset, limit, jobIds = [''], searchForNewJob = false, isNextPage = false, updateExisting = false, userId = [], timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.FETCH_DIGITIZED_DOCUMENT;

    if (searchForNewJob) {
      this.type = C.FETCH_DIGITIZED_DOC_NEW_JOB;
    }
    if (isNextPage) {
      this.type = C.FETCH_DIGITIZED_DOC_NEXT_PAGE;
    }
    if (updateExisting) {
      this.type = C.FETCH_EXISITING_DIGITIZED_DOC;
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
      "workflowCodes": ["WF_A_FCOD10GVOTK","WF_A_FCWDLDBSOD15GVOTK","WF_A_FCWDLDBSOD20TESOTK"],
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