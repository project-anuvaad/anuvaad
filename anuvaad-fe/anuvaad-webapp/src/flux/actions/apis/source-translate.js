import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";


export default class SourceTranslate extends API {
    constructor(basename, source, timeout = 2000) {
        super('GET', timeout, false);
        this.type = C.SOURCE_TRANSLATE;
        this.source = source;
        this.sentences=[];
        this.basename=basename;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.interactivesourceupdate}`
        
    }

    toString() {
        return `${super.toString()} , type: ${this.type}`
    }

    processResponse(res) {
        
        super.processResponse(res)
        if (res.data) {
            this.sentences = res;
        }
    }

    apiEndPoint() {
        return `${super.apiEndPointAuto()}/translate-source?basename=${this.basename}&source=${this.source}`;
    }

    getBody() {
        
        return {
         
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
        return this.sentences;
    }

}
