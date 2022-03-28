/**
 * Dictionary API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class WordDictionary extends API {
    constructor(word, wordLocale, targetLocale, timeout = 2000) {
        
        super("POST", timeout, false);
        this.type = C.WORD_DICTIONARY;
        this.word = word;
        this.wordLocale = wordLocale;
        this.targetLocale = targetLocale;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.word_dictionary}`
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
            "word": this.word,
            "word_locale":this.wordLocale,
            "target_locale":this.targetLocale
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