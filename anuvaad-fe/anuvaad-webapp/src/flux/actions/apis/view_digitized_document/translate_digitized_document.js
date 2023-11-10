// translate_digitized_document

import API from "../api";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class TranslateDigitizedDocument extends API {
    constructor(record_id, user_id, file_type, file_name, wf_code, jobName, filepath, selectedModel, src_lang, timeout = 200000) {
        super("POST", timeout, false);
        this.record_id = record_id;
        this.user_id = user_id;
        this.file_type = file_type;
        this.file_name = file_name;
        this.wf_code = wf_code;
        this.jobName = jobName;
        this.filepath = filepath;
        this.src_lang =src_lang
        this.selectedModel = selectedModel;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.translate_digitized_document}`;
    }

    toString() {
        return `${super.toString()}`;
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
            "record_id": this.record_id,
            "user_id": this.user_id,
            "file_type": this.file_type,
            "file_name": this.file_name,
            "translation_async_flow" : {
                "workflowCode": this.wf_code,
                "jobName": this.jobName,
                "jobDescription": "",
                "files": [
                    {
                        "path": this.filepath,
                        "type": this.file_type,
                        "locale": this.src_lang,
                        "model": this.selectedModel,
                        "context": "JUDICIARY",
                        "modifiedSentences": "a"
                    }
                ]
            }
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
        return this.response;
    }
}