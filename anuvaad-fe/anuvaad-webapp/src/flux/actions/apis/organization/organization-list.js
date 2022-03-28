import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class BulkSearchAPI extends API {
  constructor(offset, limit, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.FETCHORGANIZATION;

    this.offset = offset;
    this.limit = limit;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch_organization}`
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
      "offset": this.offset,
      "limit": this.limit
    }
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
    return this.sentences;
  }
}