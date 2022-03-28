/*
Activate Exisitng User API
*/ 

import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class ActivateExistingUser extends API{
constructor(userName,is_active,token,timeout=2000){
    super("POST",timeout,false);
    this.type = C.ACTIVATE_EXISTING_USER;
    this.userName = userName;
    this.is_active = is_active;
    this.token = token;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.activate_deactivate_user}`;
}
toString() {
    return `${super.toString()} , type: ${this.type}`;
}

processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.activated = res;
    }
}

apiEndPoint() {
    return this.endpoint;
}

getBody() {
    return {
        userName: this.userName,
        is_active: this.is_active,
    };
}

getHeaders() {
    this.headers = {
        headers: {
            "Content-Type": "application/json",
            "auth-token": this.token
        }
    };
    return this.headers;
}

getPayload() {
    return this.activated;
}
}