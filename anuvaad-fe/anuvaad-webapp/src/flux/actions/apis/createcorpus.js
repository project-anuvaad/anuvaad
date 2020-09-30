/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class CreateCorpus extends API {
    constructor(file,name,domain,language,comment, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.CREATE_CORPUS;
        this.file = file
        this.lang= language
        this.add_name = name
        this.domain = domain
        this.comment = comment
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.createcorpus}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.corpus_data = res.data;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getFormData() {
        const formData = new FormData();
            formData.append('corpus', this.file);
            formData.append('name',this.add_name);
            formData.append('domain',this.domain);
            formData.append('lang',this.lang);
        return formData;
    }

    getHeaders() {
        return {
            headers: {
                'Authorization': 'Bearer '+decodeURI(localStorage.getItem('token')),
                'Content-Type': 'multipart/form-data',
            }
        }
    }

    getPayload() {
        return this.corpus_data
    }

}
