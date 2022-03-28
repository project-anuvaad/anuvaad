
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class UserJob extends API {
    constructor(timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.FETCH_USER_JOB;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.user_job}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.data = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
        }
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem('token'))}`,
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.data;
    }
}