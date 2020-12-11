/**
 * Corpus API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DocumentUpload extends API {
  constructor(configFile, name, timeout = 2000) {
    super("POST", timeout, false, "MULTIPART");
    this.type = C.DOCUMENTUPLOAD;
    this.file = configFile;
    this.name = name;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.documentupload}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res.data) {
      this.config = { data: res.data, name: this.name };
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getFormData() {

    const formData = new FormData();
        formData.append('file', this.file[0]);
        return formData;
    
  }

  getHeaders() {
    return {
      headers: {
        'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "multipart/form-data"
      }
    };
  }

  getPayload() {
    return this.config;
  }
}