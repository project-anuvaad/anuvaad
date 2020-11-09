/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class RunExperiment extends API {
  constructor(workspaceName, configFilepath, csvFilepath, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.RUNEXPERIMENT;
    this.title = workspaceName;
    this.config_file_location = configFilepath;
    this.csv_file_location = csvFilepath;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.runexperiment}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.workspace = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      paragraph_workspace: {
        title: this.title,
        config_file_location: this.config_file_location,
        paragraph_file_location: this.csv_file_location
      }
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        Authorization: "Bearer " + decodeURI(localStorage.getItem("token")),
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.workspace;
  }
}
