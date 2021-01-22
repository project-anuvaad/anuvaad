/**
 * Signup API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class Signup extends API {
    constructor(email, firstName, lastName, password, timeout = 2000) {
        super("POST", timeout, false);
        this.type = C.SIGNUP;
        this.email = email;
        this.name = firstName;
        // this.lastName = lastName;
        this.password = password;
        this.signupres = null
        this.endpoint =`${super.apiEndPointAuto()}${ENDPOINTS.signup}`; 
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.signupres = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {"users":
        [{"name":this.name,
        "userName":this.email,
        "password":this.password,
        "email":this.email,
        "phoneNo":"",
        "roles":[{"roleCode":"TRANSLATOR","roleDesc":"Has access to translation related resources"}],
        "orgID" : "ANUVAAD"
    }]}
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
        return this.signupres;
    }
}