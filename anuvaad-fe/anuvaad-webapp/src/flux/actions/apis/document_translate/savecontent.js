import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class saveConetent extends API {
  constructor(sentenceObj, review=false, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_CONTENT;
    this.sentenceObj = sentenceObj;
    this.review = review;
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
    reqObj.review = this.review;
    sentences.push(this.sentenceObj);

    reqObj.workflowCode = "DP_WFLOW_S_C"
    reqObj.sentences = sentences
    return reqObj;
  }

  getHeaders() {
    this.headers = {
      headers: {
        'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json",
        "x-user-id": `${JSON.parse(localStorage.getItem('userProfile')).userID}`,
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.savedata;
  }
}
