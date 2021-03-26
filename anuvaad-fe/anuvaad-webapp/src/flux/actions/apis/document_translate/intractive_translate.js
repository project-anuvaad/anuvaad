/**
 * NMT Sentence Piece API
 */
import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";
export default class NMTSP extends API {
    constructor(source, target, model, dontshowloader, v1, sId, timeout = 200000) {
        super("POST", timeout, false);
        this.src = source;
        this.target = target;
        this.model = model;
        this.dontshowloader = dontshowloader;
        this.answers = null;
        this.sId = sId;
        this.type = C.INTRACTIVE_TRANSLATE;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.translate}`
    }

    toString() {
        return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);

        if(res && res.output && res.output.predictions && Array.isArray(res.output.predictions) && res.output.predictions.length>0) {
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
        let reqObj = {}
        var modelArray = [];
        let textListObj = {}

        modelArray.push({
            s_id: this.sId,
            src: this.src,
            taggedPrefix: this.target

        });

        // reqObj.workflowCode = "DP_WFLOW_S_IT_T"
        textListObj.textList = modelArray
        textListObj.model = this.model
        reqObj.input = textListObj
        return reqObj;

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