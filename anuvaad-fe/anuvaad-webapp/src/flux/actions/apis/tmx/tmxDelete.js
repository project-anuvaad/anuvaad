// tmxDelete.js

import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DeleteTmx extends API {
    constructor(userObj = Object, context = "", timeout = 2000) {
        super('POST', timeout, false);
        this.userObj = userObj;
        this.context = context;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.delete_user_glossary}`;
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.response = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            context: this.context,
            ...this.userObj
        };
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