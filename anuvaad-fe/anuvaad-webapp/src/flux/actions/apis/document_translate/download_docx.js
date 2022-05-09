import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DownloadDOCX extends API {
  constructor(jobId, fname, jobName, type = 'trans', timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.DOWNLOAD_DOCX_FILE;
    this.jobId = jobId;
    this.fname = fname;
    this.jobName = jobName;
    this.response = "";
    if (type === 'trans') {
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.downloadDocxFile}`;
    } else {
      // this.endpoint = `http://localhost:5001${ENDPOINTS.downloadOcrDocxFile}`;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.downloadOcrDocxFile}`;
    }
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.response = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      fname: this.fname,
      jobId: this.jobId,
      jobName: this.jobName,
      authToken: `${decodeURI(localStorage.getItem("token"))}`,
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.response;
  }
}
