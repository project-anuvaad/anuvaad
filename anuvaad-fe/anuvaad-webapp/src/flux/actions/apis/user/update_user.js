/**
 * CreateUsers API
 */
 import API from "../api";
 import C from "../../constants";
 import ENDPOINTS from "../../../../configs/apiendpoints";
 export default class CreateUsers extends API {
     constructor(userList, timeout = 2000) {
         super("POST", timeout, false);
         this.type = C.SAVE_USER;
         this.user = userList;
        
         this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.update_user}`;
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
             "users": this.user
                 
         }
     }
 
     getHeaders() {
         this.headers = {
             headers: {
                 
                 'auth-token': `${decodeURI(localStorage.getItem("token"))}`,
                 "Content-Type": "application/json"
             }
         };
         return this.headers;
     }
 
     getPayload() {
         return this.createuserres;
     }
 }