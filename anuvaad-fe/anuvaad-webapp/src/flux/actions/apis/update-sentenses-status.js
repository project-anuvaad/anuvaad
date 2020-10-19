import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UpdateSentencesStatus extends API {
  constructor(updateSentence, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.UPDATE_SENTENCE_STATUS;
    this.updateSentence = updateSentence;
    this.sentences = [];
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {

    super.processResponse(res);
    if (res.data) {
      
      this.sentences = res.data;
    }
  }

  apiEndPoint() {
    return `${super.apiEndPointAuto()}/update-sentences-status`;
  }

  getBody() {
    return {
      sentences: [this.updateSentence]
    };
  }
  getHeaders() {
    this.headers = {
      headers: {
        Authorization: "Bearer " + decodeURI(localStorage.getItem("token")),
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.sentences;
  }
}
