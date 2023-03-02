import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class fetchTransliterationModelID extends API {
  constructor(sourceLang,targLang,timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.TRANSLITERATION_MODEL_ID;
    this.endpoint = `${super.apiEndPointULCA()}${ ENDPOINTS.getTransliterationModelId}?sourceLanguage=${sourceLang}&targetLanguage=${targLang}`;

  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.fetch_transliteration_modelID = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {};
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
    return this.fetch_transliteration_modelID;
  }
}
