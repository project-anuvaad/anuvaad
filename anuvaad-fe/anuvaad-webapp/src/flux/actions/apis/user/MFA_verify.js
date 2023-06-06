/**
 * ActivateUser API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class VerifyMFA extends API {
    constructor(userName = "", sessionId = "", authOTP = "", useHOTP="false", timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.MFA_VERIFY;
        this.userName = userName;
        this.sessionId = sessionId;
        this.authOTP = authOTP;
        this.useHOTP = useHOTP;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.mfa_verify}`;
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
            "session_id": this.sessionId,
            "authOTP": this.authOTP,
            "useHOTP": this.useHOTP
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
        return this.response;
    }
}
