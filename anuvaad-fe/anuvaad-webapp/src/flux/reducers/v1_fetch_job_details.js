import C from "../actions/constants";
import LanguageCodes from "../../ui/components/web/common/Languages.json"

const initialState = {
    count:  0,
    progress_updated: false,
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
        document['active']                  = job['active'];
        document['jobID']                   = job['jobID'];

        document['source_language_code']    = job['input']['files'][0]['model']['source_language_code'];
        document['target_language_code']    = job['input']['files'][0]['model']['target_language_code'];

        document['created_on']              = job['startTime'];
        document['status']                  = job['status'];
        document['progress']                = '...'

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
                document['progress'] =  `${progress['completed_count']} of ${progress['total_count']}`//progress['completed_count'] / progress['total_count']
                updated_documents.push(document)
                found = true;
            }
        })
        if (!found)
            updated_documents.push(document)
    })
    return updated_documents
}


export default function(state = initialState, action) {
    
    switch (action.type) {
        case C.FETCHDOCUMENT: {
            let data        = action.payload;
            let documents   = get_document_details(data)
            let newDocuments= []
            newDocuments.push(...state.documents)
            newDocuments.push(...documents)

            let newState     = {
                count: data.count,
                documents: newDocuments
            }
            return {...state, 
                count: data.count,
                progress_updated: false,
                documents: newDocuments
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

