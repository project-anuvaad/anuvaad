import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class UpdateWord extends API {
    constructor(recordId, regionID, wordID, updatedWord, page_no, timeout = 200000) {
        super("POST", timeout, false);
        this.recordId = recordId
        this.regionID = regionID
        this.wordID = wordID
        this.updatedWord = updatedWord
        this.type = C.UPDATE_WORD;
        this.page_no = page_no
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.update_word}`;
    }

    toString() {
        return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.response = res;
        }
    }

    apiEndPoint() {
        let url = `${this.endpoint}`
        return url
    }

    getBody() {
        return {
            "words": [
                {
                    "record_id": this.recordId,
                    "region_id": this.regionID,
                    "word_id": this.wordID,
                    "updated_word": this.updatedWord,
                    "page_no": this.page_no
                },
            ]
        };
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
                "x-user-id": `${localStorage.getItem('roles')}`,
                "Content-Type": "application/json"

            }
        };
        return this.headers;
    }

    getPayload() {
        return this.response;
    }
}