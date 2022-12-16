import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DeleteGlossary extends API {
    constructor(userID = "", orgID = "", src = "", tgt = "", locale = "", reversedLocale = "", context = "", bulkDelete = false, deletionArray = [], timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DELETE_GLOSSARY;
        this.userID = userID;
        this.orgID = orgID;
        this.src = src;
        this.tgt = tgt;
        this.locale = locale;
        this.context = context;
        this.reversedLocale = reversedLocale;
        this.response = "";
        this.bulkDelete = bulkDelete;
        this.deletionArray = deletionArray;
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
        if (this.bulkDelete) {
            return {
                context: this.context,
                userID: this.userID,
                orgID: this.orgID,
                sentences: this.deletionArray
            }
        }
        return {
            context: this.context,
            userID: this.userID,
            orgID: this.orgID,
            sentences: [
                {
                    src: this.src,
                    locale: this.locale,
                    tgt: this.tgt
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