import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class RunExperiment extends API {
  constructor(questionList, basename, timeout = 2000) {
    console.log();
    super("POST", timeout, false);
    this.type = C.CREATEWORKSPACE;
    this.questionList = questionList;
    this.basename = basename;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.savefeedback}`;
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
      captured_feedback: {
        basename: this.basename,
        questions: this.questionList
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
