import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class UpdatePassword extends API {
    
    constructor(id,new_password, courtId, timeout = 2000) {
        super('POST', timeout, false);
        this.type = C.UPDATE_PASSWORD;
        this.user_id = id;
         this.courtId = courtId;
        
        this.new_password = new_password;
        this.updatePassword=""   
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
    }

    toString() {
        
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        
        
        super.processResponse(res)
        if (res) {
            this.updatePassword = res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/update-password-admin`;
    }

    getBody() {
        return {
            user_id : this.user_id,
            new_password : this.new_password,
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
        return this.updatePassword;
    }

}