import C from "../actions/constants";
import LanguageCodes from "../../ui/components/web/common/Languages.json"

const initialState = {
	count:  0,
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

export default function(state = initialState, action) {
    
    switch (action.type) {
        case C.FETCHDOCUMENT: {
            let data        = action.payload;
            let documents   = get_document_details(data)
            state.count     = data.count;
            state.documents.push(...documents)
            return state
        }

        default:
            return state;
    }
}

