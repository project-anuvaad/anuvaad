/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class Translation extends API {
    constructor(sourceLanguage, targetLanguage, files, model,sourceLanguageCode,targetLanguageCode, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.TRANSLATION;
        this.files = files
        this.sourceLanguage = sourceLanguage
        this.targetLanguage = targetLanguage
        this.sourceLanguageCode = sourceLanguageCode
        this.targetLanguageCode = targetLanguageCode
        this.model = JSON.stringify(model)
        this.pdf_translate = {}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`

    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.pdf_translate = {'data':res.data};
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/v2/translate-docx`;
    }

    getFormData() {
        const formData = new FormData();

        formData.append('sourceLang', this.sourceLanguage);
        formData.append('targetLang', this.targetLanguage);
        formData.append('sourceLangCode', this.sourceLanguageCode);
        formData.append('targetLangCode', this.targetLanguageCode);
        formData.append('file', this.files);
        formData.append('model', this.model);
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
        return this.pdf_translate
    }

}
