/**
 * NMT Sentence Piece API
 */
import API from "../api";
// import C from "../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class NMTSP extends API {
    constructor(sId, nId, src, id, save, s0_src, s0_tgt, model, timeout = 200000) {
        super("POST", timeout, false);
        this.sId = sId;
        this.nId = nId;
        this.src = src;
        this.id = id;
        this.save = save;
        this.s0_src = s0_src;
        this.s0_tgt = s0_tgt;
        this.model = model;
        // this.type = C.INTRACTIVE_TRANSLATE;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.instant_translate}`
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

        modelArray.push({
            s_id: this.sId,
            nId: this.nId,
            src: this.src,
            id: parseInt(this.model, 10),
            save: this.save,
            s0_src: this.s0_src,
            s0_tgt: this.s0_tgt,

        });

        return modelArray;
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