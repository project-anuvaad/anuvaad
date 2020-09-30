import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class RunExperiment extends API {
  constructor(file, timeout = 2000) {
    console.log();
    super("POST", timeout, false);
    this.type = C.FETCHDOCUMENT;
    this.file = file;
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
      
        
            "jobIDs": [
              ""
            ],
            "taskDetails": true,
            "workflowCodes": [
              "DP_WFLOW_FBT","DP_WFLOW_FBTTR"
            ]
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