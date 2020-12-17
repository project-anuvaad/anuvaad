import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class saveConetent extends API {
  constructor(sentenceObj, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_CONTENT;
    this.sentenceObj = sentenceObj;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.save_content}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res && res.data && Array.isArray(res.data) && res.data.length>0) {
      this.savedata = res.data[0];
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    let reqObj = {}
    var sentences = [];

    sentences.push(this.sentenceObj);

    reqObj.workflowCode = "DP_WFLOW_S_C"
    reqObj.sentences = sentences
    return reqObj;
  }

  getHeaders() {
    this.headers = {
      headers: {
        'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.savedata;
  }
}
