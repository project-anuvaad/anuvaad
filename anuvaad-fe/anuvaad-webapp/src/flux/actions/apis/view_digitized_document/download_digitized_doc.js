
import API from "../api";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DownloadDigitizedDoc extends API {
    constructor(recordId, userId, type, timeout = 2000) {
        super("POST", timeout, false);
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.downlod_digitized_file}`;
        this.recordId = recordId;
        this.userId = userId;
        this.type = type
    }
    ;
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
            record_id: encodeURI(this.recordId),
            user_id: this.userId,
            file_type: this.type
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