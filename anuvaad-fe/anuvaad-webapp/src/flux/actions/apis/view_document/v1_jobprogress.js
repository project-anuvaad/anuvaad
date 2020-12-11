/**
 * Document translation progress
 */

import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DocumentTranslationProgress extends API {
    constructor(jobId, timeout = 2000) {
        
        super("POST", timeout, false);
        this.type = C.JOBPROGRESSSTATUS;
        this.jobId = jobId;
        
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.jobids}`
      }
    
      toString() {
        return `${super.toString()} , type: ${this.type}`;
      }
    
      processResponse(res) {
        super.processResponse(res);
        if (res) {
          this.workspace = res.data;
        }
      }
    
      apiEndPoint() {
        return this.endpoint;
      }
    
      getBody() {
       return {
            record_ids: this.jobId
        };
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
        return this.workspace;
      }
    }