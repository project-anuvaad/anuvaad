import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DownloadDOCX extends API {
    constructor(jobId, fname, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DOWNLOAD_DOCX_FILE;
        this.jobId = jobId;
        this.fname = fname;
        this.response = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.downloadDocxFile}`;
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
            fname: this.fname,
            jobId: this.jobId,
            authToken: `${decodeURI(localStorage.getItem("token"))}`
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