import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class UpdateSuggestedGlossaryStatus extends API {
    constructor(uuIds = [], status = "", timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.UPDATE_GLOSSARY_SUGGESTION_STATUS;
        this.uuIds = uuIds;
        this.status = status
        this.response = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.update_suggestion_status}`;
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
                ids: this.uuIds,
                status: this.status
        };
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.response;
    }
}