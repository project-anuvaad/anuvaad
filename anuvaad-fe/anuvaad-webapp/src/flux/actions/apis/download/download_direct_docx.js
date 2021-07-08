import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DirectDocxDownload extends API {


    constructor(workflow, file, fileName, source, path, model, description = "", timeout = 2000) {

        super("POST", timeout, false);
        this.type = C.DOWNLOAD_DIRECT_DOCX;
        this.file = file;
        this.fileName = fileName;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.workflowSync}`
        this.source = source;
        this.path = path;
        this.model = model;
        this.workflow = workflow;
        this.description = description;
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
            "workflowCode": this.workflow,
            "jobName": this.fileName,
            "jobDescription": this.description,
            "files": [
                {
                    "path": this.file,
                    "type": this.path,
                    "locale": this.source,
                    "model": this.model,
                    "context": "JUDICIARY",
                    "modifiedSentences": "A"
                }
            ]

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