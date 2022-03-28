import C from "../../actions/constants";
import LanguageCodes from "../../../ui/components/web/common/Languages.json"

const initialUserState = {
  result: [],
  state: 'Loading....'
};
export default function (state = initialUserState, action) {
  switch (action.type) {
    case C.FETCHDOCUMENT:
      var arr = state.result.jobs ? state.result.jobs : [];
      var jobArray = []
      let response = action.payload;
      let jobDetails = response.jobs;
      var resultArray = {}
      let existjobs = [];
      //let changedJob = {}
      arr.map((element, i) => existjobs.push(element.job))

      jobDetails.map((value, i) => {



        let date = value.startTime.toString()
        let timestamp = date.substring(0, 13)
        var d = new Date(parseInt(timestamp))
        let dateStr = d.toISOString()
        var myDate = new Date(dateStr);
        let createdAt = (myDate.toLocaleString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))
        let currentDate = new Date()

        let timeDiff = Math.floor((currentDate.getTime() - myDate.getTime()) / 60000)

        let taskData = {}
        taskData.status = ((value.status === "INPROGRESS" || value.status === "STARTED") && timeDiff > 300) ? "FAILED" : value.status;
        taskData.jobId = value.jobID
        let tasks = []

        value && value.taskDetails && Array.isArray(value.taskDetails) && value.taskDetails.length > 0 && value.taskDetails.map((task, i) => {
          let subTask = {}
          subTask.state = task.state
          subTask.status = task.status
          tasks.push(subTask)
          return null;
        })
        taskData.subTasks = tasks

        let sourceLangCode, targetLangCode, sourceLang, targetLang
        if (value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.source_language_code && value.input.files[0].model.target_language_code) {
          sourceLangCode = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.source_language_code
          targetLangCode = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.target_language_code

          let langCodes = LanguageCodes
          if (langCodes && Array.isArray(langCodes) && langCodes.length > 0) {
            langCodes.map(lang => {
              if (lang.language_code === sourceLangCode) {
                sourceLang = lang.language_name
              }
              if (lang.language_code === targetLangCode) {
                targetLang = lang.language_name
              }
              return null
            })
          }


          let id = value.jobID;
          var b = {};
          b["tgt_locale"] = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.target_language_code
          b["status"] = ((value.status === "INPROGRESS" || value.status === "STARTED") && timeDiff > 300) ? "FAILED" : value.status;
          b["job"] = value.jobID;
          b["name"] = value.input.jobName ? value.input.jobName : value.input.files[0].name;
          b["description"] = value.input && value.input.jobDescription;
          b["id"] = value.output && (value.output[0].hasOwnProperty('outputFilePath') ? value.output[0].outputFilePath : value.output[0].outputFile);
          b["inputFile"] = value.taskDetails && value.taskDetails.length > 0 && value.taskDetails[0].output && value.taskDetails[0].output.length > 0 && value.taskDetails[0].output[0].outputFile;
          b["modelId"] = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.model_id
          b["locale"] = value && value.input && value.input.files && value.input.files.length > 0 && value.input.files[0].model && value.input.files[0].model.source_language_code
          b["timestamp"] = createdAt
          b["source"] = sourceLang
          b["target"] = targetLang
          b["tasks"] = taskData

          if (!existjobs.includes(id)) {
            arr.push(b)
          }
          else if (b.status !== "INPROGRESS") {
            arr.map((elementValue, i) => {


              if (elementValue.job === b.job) {

                if (elementValue.status === "INPROGRESS" && b.status !== "INPROGRESS") {
                  arr[i] = b
                }

              }
              return null;
            })
          }


          if (value.status === "COMPLETED" && (!existjobs.includes(id))) {
            jobArray.push(value.output && value.output[0].outputFile)
          }
        }

        return null;
      })




      resultArray["jobs"] = arr;
      resultArray["count"] = action.payload.count;
      resultArray["jobIDs"] = jobArray;


      return { ...state, result: resultArray, state: !resultArray.length && 'Sorry, no matching records found' };
    case C.CLEAR_CONTENT:
      return initialUserState;
    default:
      return initialUserState;
  }
}
