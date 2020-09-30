/**
 * Login API
 */
import API from "./api";
import C from "../constants";
import ENDPOINTS from "../../../configs/apiendpoints";
export default class NMT extends API {
  constructor(par, model, reverse, target, showSplitted, type, timeout = 200000) {
    super("POST", timeout, false);
    this.par = par;
    this.model = model;
    this.reverse = reverse;
    this.target = target;
    this.answers = [];
    this.showSplitted = showSplitted;
    this.url_end_point = model[0] ? model[0].url_end_point : model.url_end_point;
    this.type = type ? type : C.NMT;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.nmt_president}`;
  }

  toString() {
    return `${super.toString()} email: ${this.email} token: ${this.token} expires: ${this.expires} userid: ${this.userid}, type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res.response_body) {
      this.answers = res.response_body;
    }
  }

  apiEndPoint() {
    return this.url_end_point ? `${super.apiEndPointAuto()}/${this.url_end_point}` : `${super.apiEndPointAuto()}/translation_en`;
  }

  getBody() {
    var modelArray = [];
    this.model.map(item => {
      if (this.showSplitted) {
        let spilttedText = this.par.split(".");
        spilttedText.map(s => {
          if (s && s.trim().length > 0) {
            modelArray.push({
              src: s.trim() + ".",
              id: parseInt(item.model_id, 10),
              s_id: item.model_name + "_Comma Split",
              n_id: item.model_name
            });
          }
          return true;
        });
      } else {
        modelArray.push({
          src: this.par,
          id: parseInt(item.model_id, 10),
          s_id: item.model_name,
          n_id: item.model_name
        });
      }
      return true;
    });
    return modelArray;
  }

  getHeaders() {
    this.headers = {
      headers: {
        Authorization: "Bearer " + decodeURI(localStorage.getItem("token")),
        "Content-Type": "application/json"
      }
    };
    return this.headers;
  }

  getPayload() {
    return this.answers;
  }
}
