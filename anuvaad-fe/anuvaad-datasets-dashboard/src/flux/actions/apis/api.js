/**
 * base class for API object
 */
import CONFIGS from "../../../configs/configs";

export default class API {
  constructor(method = "POST", timeout = 2000, auth = false) {
    this.code = null;
    this.message = null;
    this.domain = null;
    this.method = method;
    this.timeout = timeout;
    this.auth = auth;
    this.baseUrl = CONFIGS.BASE_URL;
  }

  toString() {
    return `( code: ${this.code} message: ${this.message} domain: ${this.domain} method: ${this.method} timeout: ${this.timeout} auth: ${this.auth}`;
  }

  apiEndPoint() {
    return this.baseUrl;
  }

  processResponse(res) {
    this.code = res.code;
    this.message = res.message;
    this.domain = res.domain;
  }
}
