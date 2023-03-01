/**
 * getLanguages
 */
 import API from "../api";
 import ENDPOINTS from "../../../../configs/apiendpoints";
 import C from "../../constants";
 
 export default class getAnuvaadTranslatedAndVerifiedSetenceCount extends API {
   constructor(reqType = "POST", orgId, timeout = 2000) {
     super(reqType, timeout, false);
     this.type = C.GET_TRANSLATED_AND_VERIFIED_SETENCE_COUNT;
     this.orgId = orgId;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTranslatedAndVerifiedSetenceCount}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.searchData = res;
        //  console.log(res);
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return JSON.stringify({
      org: this.orgId
    })
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
 