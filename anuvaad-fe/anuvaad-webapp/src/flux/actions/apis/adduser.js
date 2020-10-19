/**
 * Corpus API
 */

import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";

export default class AddUser extends API {
    constructor(username, firstname, lastname, password,email, roles,courtId, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.ADD_USER;
       
        this.username = username
        this.firstname = firstname
        this.lastname = lastname
        this.password = password
        this.email = email
        this.roles = roles
        this.courtId = courtId

        this.usercreate = {}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.adduser}`;

    }

    toString() {
        
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        
        
        super.processResponse(res)
        if (res) {
            this.usercreate = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            username: this.username,
       firstname:this.firstname,
        lastname: this.lastname,
       password:  this.password,
        email: this.email,
        roles: this.roles,
        high_court_code: this.courtId
        };
      }
      
      getHeaders() {
    this.headers = {
      headers: {
        'Authorization': 'Bearer '+decodeURI(localStorage.getItem('token')),
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

    getPayload() {
        return this.usercreate;
    }

}




    

   

    


   
