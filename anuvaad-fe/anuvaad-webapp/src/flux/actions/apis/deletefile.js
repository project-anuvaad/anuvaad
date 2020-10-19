/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class Translation extends API {
  constructor(deleteFile, timeout = 2000) {
    super("POST", timeout, false, "MULTIPART");
    this.type = C.DELETE;
    this.deleteFile = deleteFile;

    this.pdf_translate = {};
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.deletefile}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res.data) {
      this.pdf_translate = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getFormData() {
    const formData = new FormData();
    formData.append("processname", this.deleteFile);
    return formData;
  }

  getHeaders() {
    return {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${  decodeURI(localStorage.getItem("token"))}`
      }
    };
  }

  getPayload() {
    return this.pdf_translate;
  }
}
