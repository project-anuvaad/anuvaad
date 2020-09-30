import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UpdatePdfTable extends API {
    constructor(sentences, operation_type, lastname, password, email, roles, courtId, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.UPDATE_PDF_TABLE;

        this.sentence = sentences
        this.operation_type = operation_type

        this.updatePdfTableData = {}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.updatePdfTable}`

    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res) {
            this.updatePdfTableData = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            sentence: this.sentence,
            operation_type: this.operation_type,
    };
}

getHeaders() {
    this.headers = {
        headers: {
            'Authorization': 'Bearer ' + decodeURI(localStorage.getItem('token')),
            "Content-Type": "application/json"
        }
    };
    return this.headers;
}

getPayload() {
    return this.updatePdfTableData;
}

}












