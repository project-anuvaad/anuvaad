/**
 * ActivateUser API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class ResetMFA extends API {
    constructor(userName = "", timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.MFA_RESET;
        this.userName = userName;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.mfa_reset}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.response = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "userName": this.userName,
        };
    }

    getHeaders() {
        this.headers = {
            headers: {
                "Content-Type": "application/json",
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.response;
    }
}
