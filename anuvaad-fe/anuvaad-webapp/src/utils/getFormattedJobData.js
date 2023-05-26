export function get_document_details(input) {
    let documents = [];
  
    input["jobs"].forEach((job) => {
      let document = {};
      let timelines = [];
      let granularStatusArr = [];
      document["filename"] = job["input"]["jobName"];
      document["description"] = job["input"]["jobDescription"];
      document["filetype"] = job["input"]["files"][0]["type"];
      document["converted_filename"] = job["input"]["files"][0]["path"];
      document["active"] = job["active"];
      document["jobID"] = job["jobID"];
  
      document["source_language_code"] =
        job["input"]["files"][0]["model"]["source_language_name"];
      document["target_language_code"] =
        job["input"]["files"][0]["model"]["target_language_name"];
      document["model_id"] = job["input"]["files"][0]["model"]["model_id"];
      document["model_name"] = job["input"]["files"][0]["model"]["model_name"];
      document["created_on"] = job["startTime"];
      document["endTime"] = job["endTime"];
      document["status"] = job["status"];
      document["progress"] = "...";
      document["word_count"] = "...";
      document["bleu_score"] = "...";
      document["spent_time"] = "...";
      document["workflowCode"] = job["workflowCode"];
  
      // Granular status start
  
      if (job["status"] === "COMPLETED") {
        let granularStatusObj = {
          startTime: job.startTime,
          endTime: job.endTime,
          status: job.status,
          module: "AUTO TRANSLATION",
          state: job.state
        };
        granularStatusArr.push(granularStatusObj);
      } else if (job["status"] === "FAILED" || job["status"] === "INPROGRESS") {
        let granularStatusObj = {
          startTime: job.startTime,
          status: job.status,
          module: "AUTO TRANSLATION",
          state: job.state
        };
        granularStatusArr.push(granularStatusObj);
      }
  
      if (job["granularity"]) {
        if (job["granularity"]["manualEditingStatus"]) {
          if (job["granularity"]["manualEditingStatus"] === "IN PROGRESS") {
            let granularStatusObj = {
              startTime: job["granularity"]["manualEditingStartTime"],
              status: job["granularity"]["manualEditingStatus"],
              module: "FINAL EDITING",
              state: job["granularity"]["manualEditingStatus"]
            };
            granularStatusArr.push(granularStatusObj);
          } else if (job["granularity"]["manualEditingStatus"] === "COMPLETED") {
            let granularStatusObj = {
              startTime: job["granularity"]["manualEditingStartTime"],
              endTime: job["granularity"]["manualEditingEndTime"],
              status: job["granularity"]["manualEditingStatus"],
              module: "FINAL EDITING",
              state: job["granularity"]["manualEditingStatus"],
              duration: job["granularity"]["manualEditingDuration"]
            };
            granularStatusArr.push(granularStatusObj);
          }
        }
  
        if (job["granularity"]["reviewerStatus"]) {
          if (job["granularity"]["reviewerInProgress"]) {
            let granularStatusObj = {
              status: job["granularity"]["reviewerStatus"]?.toUpperCase(),
              module: "REVIEWER",
              state: job["granularity"]["reviewerStatus"]?.toUpperCase()
            };
            granularStatusArr.push(granularStatusObj);
          } else if (job["granularity"]["reviewerCompleted"]) {
            let granularStatusObj = {
              status: job["granularity"]["reviewerStatus"]?.toUpperCase(),
              module: "REVIEWER",
              state: job["granularity"]["reviewerStatus"]?.toUpperCase(),
            };
            granularStatusArr.push(granularStatusObj);
          }
        }
  
  
        if (job["granularity"]["parallelDocumentUploadStatus"] && job["granularity"]["parallelDocumentUploadStatus"] === "COMPLETED") {
          let granularStatusObj = {
            uploadTime: job["granularity"]["parallelDocumentUpload"],
            status: job["granularity"]["parallelDocumentUploadStatus"],
            module: "FINAL DOCUMENT UPLOADED",
            state: job["granularity"]["parallelDocumentUploadStatus"]
          };
          granularStatusArr.push(granularStatusObj);
        }
  
      }
  
      document["granularStatus"] = granularStatusArr;
      // Granular status end
  
      document["currentGranularStatus"] = `${granularStatusArr[granularStatusArr.length - 1]?.module} ${granularStatusArr[granularStatusArr.length - 1]?.module !== "FINAL DOCUMENT UPLOADED" ? `- ${granularStatusArr[granularStatusArr.length - 1]?.status}` : ""}`
  
      job["taskDetails"].forEach((task) => {
        let timeline = {};
        timeline["module"] = task["tool"];
        timeline["startime"] = task["taskStarttime"];
        if ("taskEndTime" in task) {
          timeline["endtime"] = task["taskEndTime"];
        } else {
          timeline["endtime"] = task["taskendTime"];
        }
        timeline["stepOrder"] = task["stepOrder"];
        timeline["status"] = task["status"];
  
        if (task["stepOrder"] === 0 && task["status"] !== "FAILED" && task.workflowCode === 'WF_A_FCBMTKTR') {
          document["converted_filename"] = task["output"][0]["outputFile"];
        }
        if (task["stepOrder"] === 2) {
          document["recordId"] = task["output"][0]["outputFile"];
        }
  
        if (task["stepOrder"] === 3) {
          document["recordId"] = task["output"][0]["outputFile"];
        }
        timelines.push(timeline);
      });
  
      document["timelines"] = timelines;
      if (job["status"] === "FAILED") {
        document["errorMessage"] = job["error"]["message"];
      } else {
        document["errorMessage"] = "";
      }
      documents.push(document);
    });
  
    return documents;
  }