/**
 * Corpus API
 */
import API from "./api";
import C from "../constants";

export default class UploadAudio extends API {
    constructor(audioFile, timeout = 2000) {
        super('POST', timeout, false, 'MULTIPART');
        this.type = C.UPLOAD_AUDIO;
        this.audioFile = audioFile
        this.translations = null;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        this.translations = res;
    }

    apiEndPoint() {
        return `http://52.38.236.79:5000/`;
    }

    getFormData() {
        const formData = new FormData();
        formData.append('file', this.audioFile);
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
