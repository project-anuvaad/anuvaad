import C from "../../constants";
import API from "../api";
import endpoints from "../../../../configs/apiendpoints";
export default class GetActiveDocumentsCountAPI extends API {
    constructor( timeout = 2000) {
        super('GET', timeout, false);
        this.type = C.GET_ACTIVE_DOCUMENT_COUNT;
        this.activeUserCountData = []
        this.endpoint = `${super.apiEndPointAuto()}${endpoints.activeDocumentsCount}`

    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.activeDocumentsCountData = res.data;
        }
    }

    apiEndPoint() {
        return `${this.endpoint}`;
    }

    getBody() {
        return {}
    }

    getHeaders() {
        return {
            headers: {
                "auth-token": `${decodeURI(localStorage.getItem("token"))}`,
                "Content-Type": "application/json",
            }
        }
    }

    getPayload() {
        return this.activeDocumentsCountData
    }

}