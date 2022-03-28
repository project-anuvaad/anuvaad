import API from "../api";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class saveConetent extends API {
  constructor(token, timeout = 2000) {
    super("POST", timeout, false);
    // this.type = C.SAVE_CONTENT;
    this.token = token;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.profile_details}`;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

//   processResponse(res) {
//     super.processResponse(res);
//     if (res && res.data && Array.isArray(res.data) && res.data.length>0) {
//       this.savedata = res.data[0];
//     }
//   }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    let reqObj = {}
   

    reqObj.token = this.token
   
    return reqObj;
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
    return this.savedata;
  }
}
