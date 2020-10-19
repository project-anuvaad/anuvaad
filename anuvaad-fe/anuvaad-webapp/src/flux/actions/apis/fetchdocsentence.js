import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class FetchDoc extends API {
    constructor(session, timeout = 2000) {
        super('GET', timeout, false);
        this.type = C.FETCH_PDFSENTENCE;
        this.session_id = session;
        this.fetch_corpus_data = {}
        this.endpoint = ENDPOINTS.fetchpdfsentence;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.fetch_corpus_data = res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}${this.endpoint}?session_id=${this.session_id}`
    }

    getHeaders() {
        return {
            headers: {
                'Authorization': 'Bearer '+decodeURI(localStorage.getItem('token')), 
                "Content-Type": "application/json"
            }
        }
    }


    getPayload() {
        return this.fetch_corpus_data
    }

}
