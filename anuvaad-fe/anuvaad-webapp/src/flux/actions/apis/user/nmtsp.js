/**
 * NMT Sentence Piece API
 */
import API from "../api";
import C from "../../constants";

export default class NMTSP extends API {
  constructor(par, timeout = 200000) {
    super("POST", timeout, false);
    this.par = par;
    this.answers = null;
    this.type = C.NMTSP;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    this.answers = res;
  }

  apiEndPoint() {
    return `http://52.40.71.62:3003/translator/translation`;
  }

  getBody() {
    return [
      {
        src: this.par
      }
    ];
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.answers;
  }
}
