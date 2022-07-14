import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DeleteSuggestedGlossary extends API {
    constructor(userIDs = [], uuIds = [], deleteAll = false, orgIds = [], timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DELETE_GLOSSARY_SUGGESTION;
        this.userIDs = userIDs;
        this.uuIds = uuIds;
        this.deleteAll = deleteAll;
        this.orgIds = orgIds;
        this.response = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.delete_glossary_suggestion}`;
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
                ids: this.uuIds,
                userIDs: this.userIDs,
                deletteAll: this.deleteAll,
                orgIds: this.orgIds 
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