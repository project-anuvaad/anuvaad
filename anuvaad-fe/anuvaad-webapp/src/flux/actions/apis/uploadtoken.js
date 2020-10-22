/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UploadToken extends API {
  constructor(session_id, workspaceName, configFilepath, csvFilepath, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.UPLOAD_TOKEN;
    this.session_id = session_id;
    this.title = workspaceName;
    this.token_file = configFilepath;
    this.negative_token_file = csvFilepath;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
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
    return `${super.apiEndPointAuto()}/start-tokenization`;
  }

  getBody() {
    return {
      paragraph_workspace: {
        session_id: this.session_id,
        title: this.title,
        token_file: this.token_file,
        negative_token_file: this.negative_token_file
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
