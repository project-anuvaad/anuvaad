/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class CreateTranslations extends API {
    constructor(hindiFile, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.CREATE_TRANSLATIONS;
        this.hindiFile = hindiFile
        this.translations = null;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.translations = res.data;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/corpus/translate`;
    }

    getFormData() {
        const formData = new FormData();
        formData.append('file', this.hindiFile);
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
        return this.translations
    }

}
