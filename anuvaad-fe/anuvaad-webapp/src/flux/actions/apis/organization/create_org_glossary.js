import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class CreateOrgGlossary extends API {
    constructor(orgID = "", src = "", tgt = "", locale = "", context = "", timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.CREATE_GLOSARY;
        this.orgID = orgID;
        this.src = src
        this.tgt = tgt
        this.locale = locale;
        this.context = context;
        this.response = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.create_glossary}`;
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
            orgID: this.orgID,
            context: this.context,
            sentences: [
                {
                    src: this.src,
                    tgt: this.tgt,
                    locale: this.locale
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