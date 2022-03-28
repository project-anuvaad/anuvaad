import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class AnnotatorSearchAPI extends API {
    constructor(taskId, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.FETCH_ANNOTATOR_JOB;
        this.taskId = taskId;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.task_detail}`
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.sentences = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "taskIds": [this.taskId]
        }

    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.sentences;
    }
}