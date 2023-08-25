import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class BulkSearchAPI extends API {
  constructor(offset, limit, jobIds = [''], searchForNewJob = false, isNextPage = false, updateExisting = false, userId = [], filterByStartTime={}, isReviewer = false, currentStatus = [""], timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.FETCHDOCUMENT;

    if (searchForNewJob) {
      this.type = C.FETCHDOCUMENT_NEWJOB;
    }
    if (isNextPage) {
      this.type = C.FETCHDOCUMENT_NEXTPAGE;
    }
    if (updateExisting) {
      this.type = C.FETCHDOCUMENT_EXISTING;
    }

    if(filterByStartTime && Object.keys(filterByStartTime).length > 0){
      this.filterByStartTime = filterByStartTime;
    }

    this.offset = offset;
    this.limit = limit;
    this.jobIds = jobIds;
    this.userId = userId;
    this.isReviewer = isReviewer;
    this.currentStatus = currentStatus;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetchducuments}`
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      if(res.jobs && res.jobs.length > 0) {
        res.jobs = res.jobs.filter( (ele, ind) => ind === res.jobs.findIndex( elem => elem.jobID === ele.jobID))
      }
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
      "workflowCodes": ["DP_WFLOW_FBT", "WF_A_FCBMTKTR", "DP_WFLOW_FBTTR","WF_A_FTTKTR"],
      "userIDs": this.userId,
      "filterByStartTime": this.filterByStartTime,
      "isReviewer": this.isReviewer,
      "currentStatus": this.currentStatus
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