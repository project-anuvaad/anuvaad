import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class saveConetent extends API {
  constructor(filePath,orgID, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_CONTENT;
    this.filePath = filePath;
    this.orgID = orgID;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.tmx_upload}`;
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
    
    reqObj.context = "JUDICIARY"
    reqObj.orgID = this.orgID
    reqObj.filePath = this.filePath
    return reqObj;
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
    return this.savedata;
  }
}
