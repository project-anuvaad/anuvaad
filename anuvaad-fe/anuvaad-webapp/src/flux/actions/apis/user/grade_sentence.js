
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class GradeSentence extends API {
    constructor(annotationId, score, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.GRADE_SENTENCE;
        this.annotationId = annotationId
        this.score = score
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.grade_sentence}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.data = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "annotationId": this.annotationId,
            "saved": true,
            "score": this.score
        }
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem('token'))}`,
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.data;
    }
}