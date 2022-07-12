import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class FetchGlossary extends API {
    constructor(userID = "", orgID = "", timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.VIEW_GLOSSARY;
        this.orgID = orgID;
        this.userID = userID;
        this.response = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.view_user_glossary}`;
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
            userID: this.userID,
            allUserKeys: false
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