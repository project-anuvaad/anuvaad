import API from "../apis/api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class GetHtmlLink extends API {

    constructor(jobIds = [], timeout = 2000) {

        super("POST", timeout, false);
        this.type = C.GET_HTML_LINK;
        this.jobIds = jobIds;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetchDigitalDocLink}`;

    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);

        if (res) {
            this.sentences = res;

        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            job_ids: this.jobIds

        }
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
        return this.sentences;
    }
}