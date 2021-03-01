import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DownloadJSON extends API {
    constructor(file_name, timeout = 200000) {
        super("GET", timeout, false);
        this.json = file_name;
        this.type = C.DOWNLOAD_JSON;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.download_zip_file}`;
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
        let url = `${this.endpoint}?filename=${this.json}`
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