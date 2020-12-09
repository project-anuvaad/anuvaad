import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class Pagination extends API {
    constructor(file_name, user_id, timeout = 200000) {
        super("GET", timeout, false);
        this.file_name = file_name;
        this.user_id = user_id
        this.type = C.DOWNLOAD_FILE;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.download_file}`;
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
        let url = `${this.endpoint}?filename=${this.file_name}&userid=${this.user_id}` 
         return url
    }

    getBody() {
        return {};
    }

    getHeaders() {
        this.headers = {
            headers: {
                 'auth-token': `${decodeURI(localStorage.getItem("token"))}`
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.sentences;
    }
}