/**
 * ActivateUser API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class ValidateOnboardUserAPI extends API {
    constructor(token, email, timeout = 2000) {
        super("GET", timeout, false);
        this.token = token;
        this.email = email;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.validate_onboard_user}?token=${this.token}&email=${this.email}`;
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
        return {};
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
