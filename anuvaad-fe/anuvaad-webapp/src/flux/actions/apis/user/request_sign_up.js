/**
 * Signup API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class RequestSignUpAPI extends API {
    constructor(fullName, email, orgID, averageDocTranslationsPerDay, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.REQUEST_SIGNUP;
        this.fullName = fullName;
        this.email = email;
        this.averageDocTranslationsPerDay = averageDocTranslationsPerDay;
        this.orgID = orgID;
        this.signupres = null
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.requestSignUp}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.signupres = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "fullName": this.fullName,
            "email": this.email,
            "orgID": this.orgID,
            "averageDocTranslationsPerDay": this.averageDocTranslationsPerDay
        }
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
        return this.signupres;
    }
}