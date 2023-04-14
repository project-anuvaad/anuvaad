import API from "../api";
import ENDPOINTS from "../../../../configs/apiendpoints";
import C from "../../constants";

export default class getAnuvaadCountByLang extends API {
    constructor(srcLang = "en", timeout = 2000) {
        super("POST", timeout, false);
        this.srcLang = srcLang;
        this.type = C.GET_COUNT_BY_LANG;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getLangCount}`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.langCountData = res;
            // console.log(res);
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            src_lang: this.srcLang
        }
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
        return this.langCountData
    }
}
