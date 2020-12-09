/*
Deactivate Exisitng User API
*/ 

import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DeactivateUser extends API{
    constructor(userName,token,timeout=2000){
        super("POST",timeout,false);
        this.type = C.DEACTIVATE_EXISTING_USER;
        this.userName = userName;
        // this.userID = userID;
        this.token = token;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.deactivate_existing_user}`;
    }
    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }
    
    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.deactivate = res;
        }
    }
    
    apiEndPoint() {
        return this.endpoint;
    }
    
    getBody() {
        return {
            userName: this.userName,
            // rid: this.userID,
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
        return this.deactivate;
    }


}