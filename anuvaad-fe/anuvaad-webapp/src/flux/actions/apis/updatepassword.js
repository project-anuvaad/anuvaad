import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UpdatePassword extends API {
  constructor(id, user_name, old_password, new_password, timeout = 2000) {
    super("POST", timeout, false);
    this.type = C.UPDATE_PASSWORD;
    this.user_id = id;
    this.old_password = old_password;
    this.user_name = user_name;
    this.new_password = new_password;
    this.updatePassword = "";
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.updatePassword = res;
    }
  }

  apiEndPoint() {
    return `${super.apiEndPointAuto()}/corpus/update-password`;
  }

  getBody() {
    return {
      user_id: this.user_id,
      user_name: this.user_name,
      old_password: this.old_password,
      new_password: this.new_password
    };
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
    return this.updatePassword;
  }
}
