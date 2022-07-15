import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class FetchSuggestions extends API {
    constructor(userID = [], uuids = [], org = [], locale = [], fetchAll = false, startDate = "", endDate = "", src = [], tgt = [], timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.GET_GLOSSARY_SUGGESTION;
        this.userID = userID;
        this.org = org;
        this.uuids = uuids;
        this.locale = locale;
        this.fetchAll = fetchAll;
        this.startDate = startDate;
        this.endDate = endDate;
        this.src = src;
        this.tgt = tgt;
        this.response = "";
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch_glossary_suggestions}`;
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
            ids: this.uuids,
            userIDs: this.userID,
            src: this.src,
            tgt: this.tgt,
            locale: this.locale,
            orgIDs:this.org,
            fetchAll: this.fetchAll,
            startDateX: this.startDate,
            endDateX: this.endDate
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