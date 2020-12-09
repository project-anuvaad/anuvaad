import C from "../constants";
import API from "./api";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class UserRoles extends API {
    constructor( timeout = 2000) {
        super('GET', timeout, false);
        this.type = C.USER_ROLES;
        

        this.userRoles = []
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.userroles}`

    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        super.processResponse(res)
        if (res.data) {
            this.userRoles = res.data;
        }
    }

    apiEndPoint() {

        return `${super.apiEndPointAuto()}/list-roles`;
    }

    getBody() {
        return {}
    }

    getHeaders() {
        return {
            headers: {
                'Authorization': 'Bearer ' + decodeURI(localStorage.getItem('token')),
                "Content-Type": "application/json",
            }
        }
    }

    getPayload() {
        return this.userRoles
    }

}