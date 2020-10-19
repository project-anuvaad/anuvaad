/**
 * Upload Translated file API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UploadTranslatedFile extends API {
    constructor(basename, files, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.UPLOAD_TRANSLATED;
        this.files = files
        this.basename = basename
        this.res = {}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.res = {'data':res.data};
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/save-translated-docx`;
    }

    getFormData() {
        const formData = new FormData();
        formData.append('basename', this.basename);
        formData.append('file', this.files);
        return formData;
    }

    getHeaders() {
        return {
            headers: {
                'Authorization': 'Bearer ' + decodeURI(localStorage.getItem('token')),
                'Content-Type': 'multipart/form-data'
            }
        }
    }

    getPayload() {
        return this.res
    }

}
