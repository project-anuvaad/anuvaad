import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DocumentConverter extends API {
    constructor(file_type, recordID, userId, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DOCUMENT_CONVERTER;
        this.record_id = recordID;
        this.user_id = userId
        this.file_type = file_type
        this.result = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.documentConverter}`;
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
            record_id: this.record_id,
            user_id: this.user_id,
            file_type: this.file_type
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