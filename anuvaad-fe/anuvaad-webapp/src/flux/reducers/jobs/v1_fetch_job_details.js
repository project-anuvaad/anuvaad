import C from "../../actions/constants";
// import LanguageCodes from "../../ui/components/web/common/Languages.json"

const initialState = {
    count:  0,
    progress_updated: false,
    document_deleted: false,
    documents: 
    [
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
    ]
}

/**
 * @description function parses bulk search response to create flat data
 * @param {*} input , api response of bulk search
 * @returns document details
 */
function get_document_details(input) {
    let documents = []

    input['jobs'].forEach(job => {
        let document    = {}
        let timelines   = []
        document['filename']                = job['input']['jobName']
        document['filetype']                = job['input']['files'][0]['type']
        document['converted_filename']      = job['input']['files'][0]['path']
        document['active']                  = job['active'];
        document['jobID']                   = job['jobID'];

        document['source_language_code']    = job['input']['files'][0]['model']['source_language_code'];
        document['target_language_code']    = job['input']['files'][0]['model']['target_language_code'];
        document['model_id']                = job['input']['files'][0]['model']['model_id'];

        document['created_on']              = job['startTime'];
        document['status']                  = job['status'];
        document['progress']                = '...'
        document['word_count']              = '...' 

        job['taskDetails'].forEach(task => {
            let timeline = {}
            timeline['module']              = task['tool'];
            timeline['startime']            = task['taskStarttime'];
            if ('taskEndTime' in task) {
                timeline['endtime']             = task['taskEndTime'];
            } else {
                timeline['endtime']             = task['taskendTime'];
            }
            timeline['stepOrder']           = task['stepOrder'];
            timeline['status']              = task['status'];

            if (task['stepOrder'] === 0) {
                document['converted_filename']  = task['output'][0]['outputFile'];
            }
            
            if (task['stepOrder'] === 3) {
                document['recordId']        = task['output'][0]['outputFile'];
            }
            timelines.push(timeline)
        })

        document['timelines']   = timelines
        documents.push(document);
    });

    return documents;
}

/**
 * @description update the progress of individual record
 * @param {*} documents , existing documents
 * @param {*} progresses , progress value per document
 */
function update_documents_progress(documents, progresses) {
    let updated_documents = []
    documents.forEach(document => {
        let found = false;
        progresses.forEach(progress => {
            if (document['recordId'] === progress['record_id']) {
                document['progress'] =  `${progress['completed_sentence_count']} of ${progress['total_sentence_count']}`
                document['word_count'] =  `${progress['completed_word_count']} of ${progress['total_word_count']}`
                updated_documents.push(document)
                found = true;
            }
        })
        if (!found)
            updated_documents.push(document)
    })
    return updated_documents
}

/**
 * @description remove document for which job has been deleted
 * @param {*} documents , original document present in the store
 * @param {*} deleted_jobIds , deleted jobIds
 * @returns updated document
 */
function update_documents_after_delete(documents, deleted_jobIds) {
    let updated_documents = []
    documents.forEach(document => {
        deleted_jobIds.forEach(deleted_document => {
            if (document['jobID'] !== deleted_document) {
                updated_documents.push(document)
            }
        })
    })
    return updated_documents
}

export default function(state = initialState, action) {
    
    switch (action.type) {
        case C.FETCHDOCUMENT: {
            let data        = action.payload;
            let documents   = get_document_details(data)
            let newDocuments= []
            newDocuments.push(...documents)

            return {
                ...state, 
                count: data.count,
                progress_updated: false,
                document_deleted: false,
                documents: newDocuments
            }
        }

        case C.FETCHDOCUMENT_NEXTPAGE: {
            let data        = action.payload;
            let documents   = get_document_details(data)
            return {
                ...state, 
                progress_updated: false,
                document_deleted: false,
                documents: [...state.documents, ...documents]
            }
        }

        case C.FETCHDOCUMENT_NEWJOB: {
            let data        = action.payload;
            let documents   = get_document_details(data)
            return {
                ...state,
                count: state.count + 1,
                progress_updated: false,
                document_deleted: false,
                documents: [...state.documents, ...documents]
            }
        }

        case C.FETCHDOCUMENT_EXISTING: {
            let data            = action.payload;
            let documents       = get_document_details(data);
            let existing_docs   = [...state.documents];
            documents.forEach(document => {
                existing_docs.forEach((existing_doc, index) => {
                    if (existing_doc.jobID === document.jobID) {
                        existing_docs.splice(index, 1, document)
                    }
                })
            })
            // console.log([...state.documents, ...documents].filter((v,i,a)=>a.findIndex(t=>(t.recordId === v.recordId))===i))

            return {
                ...state,
                progress_updated: false,
                document_deleted: false,
                documents: existing_docs //[...state.documents, ...documents].filter((v,i,a)=>a.findIndex(t=>(t.recordId === v.recordId))===i)
            }
        }

        case C.MARK_INACTIVE: {
            let data        = action.payload.succeeded;
            let documents   = update_documents_after_delete(state.documents, data);
            return {
                ...state, 
                count: (state.count - 1),
                document_deleted: true,
                progress_updated: true,
                documents: documents
            }

        }

        case C.JOBSTATUS: {
            let data        = action.payload;
            let documents   = update_documents_progress(state.documents, data)
            return {
                ...state, 
                progress_updated: true,
                documents: documents
            }
        }

        default:
            return state;
    }
}

