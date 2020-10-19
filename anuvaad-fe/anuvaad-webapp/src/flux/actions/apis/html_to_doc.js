/**
 * Login API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class HtmlToDoc extends API {
    constructor(html, timeout = 200000) {
        super("POST", timeout, false);
        this.html = html;
        this.type = C.HTML_TO_DOC;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.html_to_doc}`
    }

    toString() {
        return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
    }

    apiEndPoint() {
        return `http://localhost:9090/html-to-doc`;
    }

    getBody() {
        return {
            html: this.html
        }
    }

    getHeaders() {

    }

    getPayload() {
        return this.answers
    }

}
