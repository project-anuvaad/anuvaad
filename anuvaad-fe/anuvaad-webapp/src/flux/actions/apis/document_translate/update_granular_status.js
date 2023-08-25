// update_granular_status

import API from "../api";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class UpdateGranularStatus extends API {
    constructor(jobId="", status=[], timeout = 2000) {
        super('POST', timeout, false);
        this.jobId = jobId;
        this.status = status;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.update_granular_status}`;
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
            granularity: this.status,
            jobID: this.jobId
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
        return this.data;
    }
}