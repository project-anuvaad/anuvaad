import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class BulkSearchAPI extends API {
  constructor(offset, limit, timeout = 2000) {
    super("POST", timeout, false);
    this.type     = C.FETCHDOCUMENT;
    this.offset   = offset;
    this.limit    = limit;
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
            "jobIDs": [
              ""
            ],
            "taskDetails": true,
            "workflowCodes": [
              "DP_WFLOW_FBT","WF_A_FCBMTKTR","DP_WFLOW_FBTTR"
            ],
            
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