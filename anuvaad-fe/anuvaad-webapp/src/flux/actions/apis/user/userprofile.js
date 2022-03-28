import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class Translation extends API {
    constructor(username="21d9047d-683c-48ab-a3d5-c427cc2ccb78", timeout = 2000) {
        super('GET', timeout, false);
        this.type = C.USER_AUTH;
        this.username = "21d9047d-683c-48ab-a3d5-c427cc2ccb78"
        
        this.userDetails={}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
        
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.userDetails = res.data;
        }
    }

    apiEndPoint() {
        
        return `${super.apiEndPointAuto()}/get-profile`;
    }

    getBody() {
        return {}
    }

    getHeaders() {
        return {
            headers: {
                'Authorization': 'Bearer '+decodeURI(localStorage.getItem('token')),
                "Content-Type": "application/json",
            }
        }
    }

    getPayload() {
        return this.userDetails
    }

}