import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DeleteGlossary extends API {
    constructor(userID = "", src = "", tgt = "", locale = "", context = "", timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DELETE_GLOSSARY;
        this.userID = userID;
        this.src = src;
        this.tgt = tgt;
        this.locale = locale;
        this.context = context
        this.response = "";
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
            userID: this.userID,
            sentences: [
                {
                    src: this.src,
                    locale: this.locale,
                    tgt: this.tgt
                },
                {
                    src: this.tgt,
                    locale: this.locale,
                    tgt: this.src
                }
            ]
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