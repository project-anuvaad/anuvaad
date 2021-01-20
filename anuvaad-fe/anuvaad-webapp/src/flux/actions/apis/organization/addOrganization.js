import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class saveConetent extends API {
  constructor(name,description,status, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.SAVE_CONTENT;
    this.name = name;
    this.action = status;
    this.description = description;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.add_org}`;
  }





  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    let reqObj = {}
    reqObj.code = this.name
    reqObj.description = this.description ? this.description :"Delete"
    reqObj.active = this.action
    return {"organizations":[reqObj]};
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
}
