import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class JobSearchAPI extends API {
    constructor(jobId, annotationType, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.FETCH_JOB_DETAIL;
        this.jobId = jobId;
        this.annotationType = annotationType;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.job_detail}`
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
            "annotationType": this.annotationType,
            "jobId": this.jobId
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