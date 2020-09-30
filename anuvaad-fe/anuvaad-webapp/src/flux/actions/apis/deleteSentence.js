import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class DeleteSentence extends API {
    constructor(sentences, token_sentence, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DELETE_SENTENCE;

        this.sentence = sentences
        this.token_sentence = token_sentence

        this.deleteSentence = {}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.deleteSentence}`;

    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {
            this.deleteSentence = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            sentence: this.sentence,
            sentences_delete: this.token_sentence,
    };
}

getHeaders() {
    this.headers = {
        headers: {
            'Authorization': 'Bearer ' + decodeURI(localStorage.getItem('token')),
            "Content-Type": "application/json"
        }
    };
    return this.headers;
}

getPayload() {
    return this.deleteSentence;
}

}












