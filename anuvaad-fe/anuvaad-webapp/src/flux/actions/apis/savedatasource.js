import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class RunExperiment extends API {
  constructor(workspaceName, source, target, filepath, timeout = 2000) {
    console.log();
    super("POST", timeout, false);
    this.type = C.CREATEWORKSPACE;
    this.title = workspaceName;
    this.source = source;
    this.target = target;
    this.filepath = filepath;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.savedatasource}`;
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
      mt_workspace: {
        title: this.title,
        source_language: this.source,
        target_language: this.target,

        sentence_file: this.filepath
      }
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
    return this.workspace;
  }
}
