/**
 * User Event Report API
 */
import API from "../api";
import C from "../../constants";

export default class AutoML extends API {
    constructor(action, jobId, uid, timeout = 200000) {
        super("POST", timeout, false);
        this.action = action
        this.jobId = jobId
        this.uid = uid
        this.type = C.GET_USER_EVENT_REPORT;
        this.endpoint = `http://54.188.215.158:8080/dashboard/getUserReport`;
    }

    toString() {
        return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
    }

    processResponse(res) {
        super.processResponse(res);
        this.report = res
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            "events.edata.action.keyword": this.action,
            "events.object.job_id.keyword": this.jobId,
            "events.actor.uid.keyword": this.uid
        }
    }

    getHeaders() {
        this.headers = {
            headers: {
                'Authorization': decodeURI(localStorage.getItem('token')),
                "Content-Type": "application/json"
            }
        };
        return this.headers;
    }

    getPayload() {
        return this.report
    }

}
