import API from "../api";
import C from "../../constants";
import ENDPOINTS from "../../../../configs/apiendpoints";

export default class RunExperiment extends API {
  constructor(
    workflow,
    file,
    fileName,
    source,
    target,
    path,
    model,
    sentence_ids,
    source_language,
    description = "",
    arrayOfUsers = [],
    workspaceName,
    retranslate = false,
    timeout = 2000
  ) {
    super("POST", timeout, false);
    this.type = C.WORKFLOW;
    this.file = file;
    this.fileName = fileName;
    this.endpoint =
      workflow === "WF_A_FCBMTKTR" ||
      workflow === "WF_A_FCOD10GVOTK" ||
      workflow === "WF_A_FCWDLDBSOD15GVOTK" ||
      workflow === "WF_A_FCWDLDBSOD20TESOTK" ||
      workflow === "WF_A_AN" ||
      workflow === "WF_A_FTTKTR"
        ? `${super.apiEndPointAuto()}${ENDPOINTS.workflowAsync}`
        : `${super.apiEndPointAuto()}${ENDPOINTS.workflowSync}`;
    this.source = source;
    this.target = target;
    this.path = path;
    this.model = model;
    this.workflow = workflow;
    this.sentence_ids = sentence_ids;
    this.source_language = source_language;
    this.description = description;
    this.arrayOfUsers = arrayOfUsers;
    this.jobDescription = workspaceName;
    this.retranslate = retranslate;
  }

  toString() {
    return `${super.toString()} , type: ${this.type}`;
  }

  processResponse(res) {
    super.processResponse(res);

    if (res) {
      this.sentences = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    if (this.workflow === "WF_A_FCBMTKTR" || this.workflow === "WF_A_FTTKTR") {
      return {
        workflowCode: this.workflow,
        jobName: this.fileName,
        jobDescription: this.description,
        files: [
          {
            path: this.file,
            type: this.path,
            locale: this.source,
            model: this.model,
            context: "JUDICIARY",
            modifiedSentences: this.sentence_ids ? this.sentence_ids : "a",
          },
        ],
      };
    } else if (this.workflow === "WF_S_TKTR" || this.workflow === "WF_S_TR") {
      return {
        workflowCode: this.workflow,
        recordID: this.fileName,
        locale: this.source, // Only when tokenisation and/or translation is needed
        model: this.model, //Only when Translation is needed
        textBlocks: this.file,
        context: "JUDICIARY",
        modifiedSentences: this.sentence_ids,
        retranslate: this.retranslate,
      };
      //List of text
    } else if (
      this.workflow === "WF_A_FCOD10GVOTK" ||
      this.workflow === "WF_A_FCWDLDBSOD15GVOTK" ||
      this.workflow === "WF_A_FCWDLDBSOD20TESOTK"
    ) {
      return {
        workflowCode: this.workflow,
        jobName: this.fileName,
        files: [
          {
            path: this.file,
            type: this.path,
            locale: this.source,
            config: {
              OCR: {
                line_layout:
                  this.workflow === "WF_A_FCWDLDBSOD20TESOTK"
                    ? "True"
                    : "False",
                option: "HIGH_ACCURACY",
                language: this.source,
                source_language_name: this.source_language,
              },
            },
          },
        ],
      };
    } else if (this.workflow === "WF_A_AN") {
      return {
        files: [
          {
            annotationType: "VET_PARALLEL_SENTENCE",
            sourceLanguage: this.source,
            targetLanguage: this.target,
            fileInfo: {
              name: this.fileName,
              type: this.path,
              identifier: this.file,
            },

            description: this.description,
            users: this.arrayOfUsers,
          },
        ],
        workflowCode: this.workflow,
      };
    }
  }

  getHeaders() {
    this.headers = {
      headers: {
        "auth-token": `${decodeURI(localStorage.getItem("token"))}`,
        "Content-Type": "application/json",
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.sentences;
  }
}
