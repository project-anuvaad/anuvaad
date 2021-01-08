/**
 * CreateUsers API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class CreateUsers extends API {
    constructor(email, firstName, password, roles,token,orgName, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.SAVE_USER;
        this.email = email;
        this.name = firstName;
        this.userName = email;
        this.roles = roles;
        this.token = token;
        this.password = password;
        this.orgName = orgName;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.createuser}`;
        // console.log('type',this.type,'email',this.email,'name',this.name,'UserName',this.userName,'Roles',this.roles,'endpoint',this.endpoint)
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.createuserres = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "users":
                [
                    {
                        "name": this.name,
                        "userName": this.userName,
                        "password": this.password,
                        "email": this.email,
                        "phoneNo": "",
                        "roles": this.roles,
                        "orgID" : this.orgName
                    }]
        }
    }

    getHeaders() {
        this.headers = {
            headers: {
                'auth-token': `${this.token}`,
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.createuserres;
    }
}