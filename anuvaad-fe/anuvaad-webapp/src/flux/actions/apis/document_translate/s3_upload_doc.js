// s3_upload_doc

import API from "../api";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class UploadDocToS3 extends API {
    constructor(formData = {}, timeout = 2000) {
        super('POST', timeout, false);
        this.formData = formData;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.s3_upload_doc}`;
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
        return this.formData;
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
                // "Content-Type": ""
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.data;
    }
}