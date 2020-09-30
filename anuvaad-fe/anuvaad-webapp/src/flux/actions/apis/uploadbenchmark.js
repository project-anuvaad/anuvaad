/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UploadBenchmark extends API {
    constructor(file,name,language, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.UPLOAD_BENCHMARK;
        this.file = file
        this.source_lang= language
        this.add_name = name
        this.benchmark_data=""
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
        
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.benchmark_data = res.data;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/save-benchmark`;
    }

    getFormData() {
        const formData = new FormData();
            formData.append('file', this.file);
            formData.append('name',this.add_name);
            formData.append('source_lang',this.source_lang);
            
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
        return this.benchmark_data
    }

}
