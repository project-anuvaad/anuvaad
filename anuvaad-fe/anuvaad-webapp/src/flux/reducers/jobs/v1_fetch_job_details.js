import { get_document_details } from "../../../utils/getFormattedJobData";
import C from "../../actions/constants";
// import LanguageCodes from "../../ui/components/web/common/Languages.json"

const initialState = {
  count: 0,
  progress_updated: false,
  document_deleted: false,
  documents: [
    /* 
            {
                filename: null,
                filetype: null,
                active: false,
                source_language_code: null,
                target_language_code: null,
                created_on: null,
                jobID: null,
                status: null,
                recordId: null,
                progress: null,
                timelines: [
                    {
                        stepOrder: 0,
                        module: null,
                        status: null,
                        outputFile: null
                    }
                ]
            }
            */
  ],
};

/**
 * @description function parses bulk search response to create flat data
 * @param {*} input , api response of bulk search
 * @returns document details
 */


function timeCalculate(total_time) {
  let sec = total_time / 1000;
  var date = new Date(0);
  date.setSeconds(sec); // specify value for SECONDS here
  return date.toISOString().substr(11, 8);
}

/**
 * @description update the progress of individual record
 * @param {*} documents , existing documents
 * @param {*} progresses , progress value per document
 */
function update_documents_progress(documents, progresses) {
  let updated_documents = [];
  documents.forEach((document) => {
    let found = false;
    progresses.forEach((progress) => {
      if (document["recordId"] === progress["record_id"]) {
        document[
          "progress"
        ] = `${progress["completed_sentence_count"]} of ${progress["total_sentence_count"]}`;
        document[
          "word_count"
        ] = `${progress["completed_word_count"]} of ${progress["total_word_count"]}`;
        document["bleu_score"] = `${Number(progress["avg_bleu_score"]) > 0
            ? Number(progress["avg_bleu_score"]).toFixed(2)
            : "0"
          } `;
        document["spent_time"] = timeCalculate(
          `${progress["total_time_spent_ms"]}`
        );
        updated_documents.push(document);
        found = true;
      }
    });
    if (!found) updated_documents.push(document);
  });
  return updated_documents;
}

/**
 * @description remove document for which job has been deleted
 * @param {*} documents , original document present in the store
 * @param {*} deleted_jobIds , deleted jobIds
 * @returns updated document
 */
function update_documents_after_delete(documents, deleted_jobIds) {
  let updated_documents = [];
  documents.forEach((document) => {
    deleted_jobIds.forEach((deleted_document) => {
      if (document["jobID"] !== deleted_document) {
        updated_documents.push(document);
      }
    });
  });
  return updated_documents;
}

export default function (state = initialState, action) {
  switch (action.type) {
    case C.FETCHDOCUMENT: {
      let data = action.payload;
      let documents = get_document_details(data);
      let newDocuments = [];
      newDocuments.push(...documents);

      return {
        ...state,
        count: data.count,
        progress_updated: false,
        document_deleted: false,
        documents: newDocuments,
      };
    }

    case C.FETCHDOCUMENT_NEXTPAGE: {
      let data = action.payload;
      let documents = get_document_details(data);
      return {
        ...state,
        progress_updated: false,
        document_deleted: false,
        documents: [...state.documents, ...documents],
      };
    }

    case C.FETCHDOCUMENT_NEWJOB: {
      let data = action.payload;
      let documents = get_document_details(data);
      return {
        ...state,
        count: state.count + 1,
        progress_updated: false,
        document_deleted: false,
        documents: [...state.documents, ...documents],
      };
    }

    case C.FETCHDOCUMENT_EXISTING: {
      let data = action.payload;
      let documents = get_document_details(data);
      let existing_docs = [...state.documents];
      let changedJob = {};
      documents.forEach((document) => {
        existing_docs.forEach((existing_doc, index) => {
          if (existing_doc.jobID === document.jobID) {
            if (document.status !== "INPROGRESS") {
              changedJob = document;
            }
            existing_docs.splice(index, 1, document);
          }
        });
      });
      // console.log([...state.documents, ...documents].filter((v,i,a)=>a.findIndex(t=>(t.recordId === v.recordId))===i))

      return {
        ...state,
        progress_updated: false,
        document_deleted: false,
        documents: existing_docs, //[...state.documents, ...documents].filter((v,i,a)=>a.findIndex(t=>(t.recordId === v.recordId))===i)
        changedJob: changedJob,
      };
    }

    case C.MARK_INACTIVE: {
      let data = action.payload.succeeded;
      let documents = update_documents_after_delete(state.documents, data);
      return {
        ...state,
        count: state.count - 1,
        document_deleted: true,
        progress_updated: true,
        documents: documents,
      };
    }

    case C.JOBSTATUS: {
      let data = action.payload;
      let documents = update_documents_progress(state.documents, data);
      return {
        ...state,
        progress_updated: true,
        documents: documents,
      };
    }

    case C.CLEAR_JOB_STATUS: {
      return {
        ...initialState,
      };
    }

    default:
      return state;
  }
}
