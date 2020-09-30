/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class CreateCorpus extends API {
    constructor(file,hindiFile, englishFile,hindi, english, corpus_type,name,domain,comment, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.CREATE_PARALLEL_CORPUS;
        this.file = file
        this.hindiFile = hindiFile
        this.englishFile = englishFile
        this.source_lang = english
        this.target_lang = hindi
        this.corpus_type = corpus_type
        this.corpus_data = {}
        this.add_name = name
        this.domain = domain
        this.comment = comment
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.corpus}`;
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

            formData.append('hindi', this.hindiFile);
            formData.append('english', this.englishFile);
            formData.append('source_lang', this.source_lang);
            formData.append('target_lang', this.target_lang);
            formData.append('name',this.add_name);
            formData.append('domain',this.domain);
            formData.append('comment',this.comment);
        return formData;
    }

    getHeaders() {
        return {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }
    }

    getPayload() {
        return this.corpus_data
    }

}
