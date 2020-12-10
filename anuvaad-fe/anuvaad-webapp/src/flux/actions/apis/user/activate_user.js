/**
 * ActivateUser API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class ActivateUser extends API {
    constructor(uid, rid, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.ACTIVATE;
        this.uid = uid;
        this.rid = rid;
        this.activateres = null;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.activate_user}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.activateres = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            userName: this.uid,
            userID: this.rid,
        };
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
        return this.activateres;
    }
}
