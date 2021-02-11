/**
 * Document translation progress
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class DocumentTranslationProgress extends API {
    constructor(jobId,bleuStatus, timeout = 2000) {
        
        super("POST", timeout, false);
        this.type = C.JOBSTATUS;
        this.jobId = jobId;
        this.bleu_score = bleuStatus;
        
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
            record_ids: this.jobId,
            bleu_score: this.bleu_score

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