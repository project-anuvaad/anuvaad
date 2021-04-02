/**
 * NMT Sentence Piece API
 */
import API from "../api";
// import C from "../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class NMTSP extends API {
    constructor(sId, nId, src, id, save, s0_src, s0_tgt, model,src_code,tgt_code, timeout = 200000) {
        super("POST", timeout, false);
        this.sId = sId;
        this.nId = nId;
        this.src = src;
        this.id = id;
        this.save = save;
        this.s0_src = s0_src;
        this.s0_tgt = s0_tgt;
        this.model = model;
        this.src_code = src_code;
        this.tgt_code = tgt_code;
        let ep = process.env[this.model.connection_details.translation.api_endpoint]
        let url = process.env[this.model.connection_details.translation.host]
        console.log("-----------------",ep , url, process.env )
        debugger
        // this.type = C.INTRACTIVE_TRANSLATE;
        this.endpoint =  `${url ? url : super.apiEndPointAuto()}${ep ? ep :ENDPOINTS.instant_translate}`
    }

    toString() {
        return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);

        if (res && res.output && res.output.predictions && Array.isArray(res.output.predictions) && res.output.predictions.length > 0) {
            this.answers = res.output.predictions[0]
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    dontShowApiLoader() {
        return this.dontshowloader
    }

    getBody() {
        var modelArray = [];
        var src_list = [];

        src_list.push({src:this.src , s_id : this.sId } )

      
            return {
                model_id: parseInt(this.model.model_id, 10),
            source_language_code : this.src_code,
            target_language_code : this.tgt_code,
            src_list : src_list
            }
            

        

        
    }

    getHeaders() {
        this.headers = {
            headers: {
                "Content-Type": "application/json",
                'auth-token': `${decodeURI(localStorage.getItem("token"))}`
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.answers
    }

}