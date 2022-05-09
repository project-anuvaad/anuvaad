/**
 * base class for API object
 */
import CONFIGS from "../../../configs/configs";

export default class API {
  constructor(method = "POST", timeout = 2000, auth = false, reqType = "") {
    this.code = null;
    this.message = null;
    this.reqType = reqType;
    this.domain = null;
    this.method = method;
    this.timeout = timeout;
    this.auth = auth;
    this.baseUrl = CONFIGS.BASE_URL;
    this.baseUrlAuto = CONFIGS.BASE_URL_AUTO;
    this.nodebaseUrlAuto = CONFIGS.NODE_HOSTNAME;
  }

  toString() {
    return `( code: ${this.code} message: ${this.message} domain: ${this.domain} method: ${this.method} timeout: ${this.timeout} auth: ${this.auth}`;
  }

  apiEndPoint() {
    return this.baseUrl;
  }

  dontShowApiLoader(){
    return false;
  }

  apiEndPointAuto() {
    return this.baseUrlAuto;
  }

  apiNodeEndPointAuto() {
    return this.nodebaseUrlAuto;
  }

  processResponse(res) {
    this.code = res.code;
    this.message = res.message;
    this.domain = res.domain;
  }
}
