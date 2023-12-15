// get_asr

import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class GetASR extends API {
  constructor(sourceLanguage, audioContent, timeout = 2000) {
    super("POST", timeout, false);
    this.audioContent = audioContent;
    this.sourceLanguage = sourceLanguage;
    this.endpoint = `${super.apiEndPointAuto()}${ ENDPOINTS.asr}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.fetchASR = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
        "audioContent": this.audioContent,
    "sourceLanguage": this.sourceLanguage
    };
  }

  getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
         'auth-token': `${decodeURI(localStorage.getItem("token"))}`
      }
    };
  }

  getPayload() {
    return this.fetchASR;
  }
}
