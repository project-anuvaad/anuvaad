/**
 * UserInfo API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class FetchUserDetails extends API {
  constructor(offset = null, limit = null, token, updateExisiting = false, updateUserDetail = false, userIDs = [], userNames = [], roleCodes = [], orgCodes = [], timeout = 2000) {
    super("POST", timeout, false);
    if (updateExisiting) {
      this.type = C.FETCH_NEXT_USERDETAIL
    } else if (updateUserDetail) {
      this.type = C.FETCH_CURRENT_USER_DETAIL
    } else {
      this.type = C.FETCH_USERINFO;
    }
    this.token = token;
    this.userIDs = userIDs;
    this.userNames = userNames;
    this.roleCodes = roleCodes;
    this.offset = offset;
    this.limit = limit;
    this.data = null;
    this.orgCodes = orgCodes
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.userdetails}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    this.data = res;
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        'auth-token': `${this.token}`
      }
    };
  }

  getBody() {
    return {
      userIDs: this.userIDs,
      userNames: this.userNames,
      roleCodes: this.roleCodes,
      offset: this.offset,
      limit: this.limit,
      orgCodes: this.orgCodes,
      skip_pagination: true

    }
  }

  getPayload() {
    return this.data;
  }
}
