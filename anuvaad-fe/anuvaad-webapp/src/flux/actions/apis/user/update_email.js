/**
 * CreateUsers API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class UpdateEmail extends API {
    constructor(userName, password, new_email, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.UPDATE_EMAIL;
        this.userName = userName;
        this.password = password;
        this.new_email = new_email;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.update_email}`;
        // console.log('type',this.type,'email',this.email,'name',this.name,'UserName',this.userName,'Roles',this.roles,'endpoint',this.endpoint)
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.updateEmail = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "userName": this.userName,
            "password": this.password,
            "new_email": this.new_email,
        }
    }

    getHeaders() {
        this.headers = {
            headers: {
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.updateEmail;
    }
}