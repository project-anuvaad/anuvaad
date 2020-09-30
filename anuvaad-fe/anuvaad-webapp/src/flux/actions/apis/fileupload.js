import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class RunExperiment extends API {


  constructor(workflow, file, fileName, source, target, path, model, timeout = 2000) {

    super("POST", timeout, false);
    this.type = C.WORKFLOW;
    this.file = file;
    this.fileName = fileName;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.workflow}`
    this.source = source;
    this.target = target;
    this.path = path;
    this.model = model;
    this.workflow = workflow;

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
    if (this.workflow === "DP_WFLOW_FBTTR") {
      return {

        "workflowCode": this.workflow,
        "jobName": this.fileName,
        "files": [
          {
            "path": this.file,
            "type": this.path,
            "locale": this.source,
            "model": this.model
          }
        ]

      };
    }
    else if (this.workflow === "DP_WFLOW_S_TTR" || this.workflow === "DP_WFLOW_S_C" || this.workflow === "DP_WFLOW_S_TR") {
      return {
        "workflowCode": this.workflow,
  "recordID":this.fileName,
  "locale":this.source, // Only when tokenisation and/or translation is needed
  "modelID":this.model, //Only when Translation is needed
  "textBlocks":this.file
      }
      //List of text 
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