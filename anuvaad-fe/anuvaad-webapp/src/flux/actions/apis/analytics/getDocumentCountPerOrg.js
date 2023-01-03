// getDocumentCountPerOrg
import API from "../api";
 import ENDPOINTS from "../../../../configs/apiendpoints";
 import C from "../../constants";
 
 export default class getAnuvaadDocumentCountPerOrg extends API {
   constructor(timeout = 2000) {
     super("GET", timeout, false);
     this.type = C.GET_DOCUMENT_COUNT_PER_ORG;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDocumentCountPerOrg}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.searchData = res;
         console.log(res);
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return false
   }
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.searchData
   }
 }
 