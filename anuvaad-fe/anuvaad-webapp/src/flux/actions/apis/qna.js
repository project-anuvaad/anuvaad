/**
 * Login API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class QNAApi extends API {
  constructor(par, q1, q2, q3, q4, timeout = 200000) {
    super("POST", timeout, false);
    this.par = par;
    this.q1 = q1;
    this.q2 = q2;
    this.q3 = q3;
    this.q4 = q4;
    this.answers = null;
    this.type = C.QNA;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.qna}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    this.answers = res;
    // if (res.token) {
    //     this.token = res.token;
    //     this.expires = res.expires;
    //     this.role = res.role;
    //     this.userid = res.userid;
    //     this.name = res.name;
    //     // sessionStorage.setItem('user', JSON.stringify(res.user))
    // }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      data: [
        {
          title: "Super_Bowl_50",
          paragraphs: [
            {
              context: this.par,
              qas: [
                {
                  answers: [],
                  question: this.q1,
                  id: "q1"
                },
                {
                  answers: [],
                  question: this.q2,
                  id: "q2"
                },
                {
                  answers: [],
                  question: this.q3,
                  id: "q3"
                },
                {
                  answers: [],
                  question: this.q4,
                  id: "q4"
                }
              ]
            }
          ]
        }
      ],
      version: "1.1"
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.answers;
  }
}
