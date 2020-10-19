import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class RunExperiment extends API {
  constructor(sentences,startSentence,operation_type, endSentence,selected_text, timeout = 2000) {
    console.log();
    super("POST", timeout, false);
    this.type = C.MERGEINTERACTIVESENTENCE;
    this.sentences = sentences;
    this.start_sentence = startSentence;
    this.end_sentence = endSentence;
    this.selected_text = selected_text;
    this.operation_type = operation_type;
    
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.InteractiveMerge}`
    
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
    
    return {
        "sentences": this.sentences,
        "start_sentence" : this.start_sentence,
        "end_sentence": this.end_sentence,
        "operation_type" : this.operation_type,
        "selected_text" : this.selected_text
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        Authorization: `Bearer ${  decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.sentences;
  }
}