import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class RunExperiment extends API {
  constructor(name, file, source, target, model,strategy, timeout = 2000) {
    super("POST", timeout, false, "MULTIPART");
    this.type = C.UPLOADPDF;
    this.name = name;
    this.file = file;
    this.workspace = [];
    this.source = source;
    this.target = target;
    this.ner = strategy ==="LOK SABHA"? 1: 0;
    this.model = JSON.stringify(model);
    this.endpoint = strategy === "OCR" ? `${super.apiEndPointAuto()}${ENDPOINTS.ocrpdffileupload}`:`${super.apiEndPointAuto()}${ENDPOINTS.pdffileupload}`
   


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

  getFormData() {
    const formData = new FormData();
    formData.append('pdf_data', this.file);
    formData.append('process_name', this.name);
    formData.append('source_lang',this.source);
    formData.append('target_lang',this.target);
    formData.append('model',this.model);
    formData.append('dont_use_ner',this.ner);
    return formData;
  }

  getHeaders() {
    this.headers = {
      headers: {
        'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "multipart/form-data"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.workspace;
  }
}
