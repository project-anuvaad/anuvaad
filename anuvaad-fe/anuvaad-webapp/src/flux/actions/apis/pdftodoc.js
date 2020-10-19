import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class PdfToDoc extends API {
  constructor(file, timeout = 2000) {
    super("POST", timeout, false, "MULTIPART");
    this.type = C.PDF_TO_DOC;
    this.file = file;
    this.filePath = "";
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.pdftodoc}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.filePath = res.data;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getFormData() {
    const formData = new FormData();
    formData.append("pdf_data", this.file);
    return formData;
  }

  getHeaders() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "multipart/form-data"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.filePath;
  }
}
