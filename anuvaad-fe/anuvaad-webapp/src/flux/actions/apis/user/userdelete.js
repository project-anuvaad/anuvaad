/**
 * Corpus API
 */

import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class AddUser extends API {
    constructor(username, status, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.DELETE_USER;
       
        this.username = username
        this.status = status

        this.deleteuser = {}
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`

    }

    toString() {
        
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        
        
        super.processResponse(res)
        if (res) {
            this.deleteuser = res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/update-user-status`;
    }

    getBody() {
        return {
            username: this.username,
       status: this.status
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
        return this.deleteuser;
    }

}




    

   

    


   
