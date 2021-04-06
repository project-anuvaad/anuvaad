import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DownloadJSON extends API {
    constructor(recordID, startPage = 0, endPage = 0, timeout = 200000) {
        super("GET", timeout, false);
        this.recordID = recordID;
        this.type = C.DOWNLOAD_JSON;
        this.startPage = startPage;
        this.endPage = endPage;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.download_json}`;
    }

    toString() {
        return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.sentences = res;
        }
    }

    apiEndPoint() {
        let url = encodeURI(`${this.endpoint}?recordID=${this.recordID}&start_page=${this.startPage}&end_page=${this.endPage}`)
        return url
    }

    getBody() {
        return {};
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.sentences;
    }
}