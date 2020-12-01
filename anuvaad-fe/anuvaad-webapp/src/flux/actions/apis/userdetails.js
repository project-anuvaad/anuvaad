/**
 * UserInfo API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class UserInfo extends API {
    constructor(timeout = 2000) {
        super("GET", timeout, false);
        this.type = C.USERINFO;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.userdetails}`;
        console.log('Inside UserInfo',this.endpoint)
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        console.log(res);
        if (res && res.data) {
            return res.data;
        }
    }

    apiEndPoint() {
        return this.endpoint;
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
        return this.res;
    }
}
