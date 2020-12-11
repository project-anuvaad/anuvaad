import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class FetchContentUpdate extends API {
    constructor(job_id, start_page, end_page, timeout = 200000) {
        super("GET", timeout, false);
        this.job_id     = job_id;
        this.start_page = start_page;
        this.end_page   = end_page
        this.page_number= start_page;
        this.type       = C.FETCH_CONTENT_UPDATE;
        this.endpoint   = ENDPOINTS.fecthcontent;
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
        let url = `${super.apiEndPointAuto()}${this.endpoint}?record_id=${this.job_id}` 
        if(this.start_page && this.end_page) {
            url += `&start_page=${this.start_page}&end_page=${this.end_page}`;
        }
        else{
            url+= `&all=true`;
        }
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
        return {
            page_number: this.page_number,
            sentences: this.sentences
        };
    }
}