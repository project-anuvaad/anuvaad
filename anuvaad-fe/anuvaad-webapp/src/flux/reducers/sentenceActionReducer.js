import C from '../actions/constants';

export default function sentenceMergeReducer(state={started: false, progress: false, finished: false, cancel: false, api_status: false, sentences:[]}, action){
    switch(action.type) {
        case C.MERGE_SENTENCE_STARTED: {
        //   let data      = action.payload;
          return {
              ...state,
              sentences:[],
              started: true,
              api_status: false,
              progress: true,
              finished: false,
              cancel: false
          }
        }
        case C.MERGE_SENTENCE_INPROGRESS: {
            let data      = action.payload;
            let sentences = state.sentences;
            sentences.push(data.sentence)
            return {
                ...state,
                sentences: sentences,
                progress: true
            }
          }

        case C.MERGE_SENTENCE_FINISHED: {
            // let data      = action.payload;
            return {
                ...state,
                progress: false,
                finished: true
            }
        }

        case C.MERGE_SENTENCE_CANCEL: {
            // let data      = action.payload;
            return {
                ...state,
                started: false,
                sentences: [],
                progress: false,
                finished: true,
                cancel: true
            }
        }

        case C.SENTENCE_ACTION_API_STARTED: {
            let data        = action.payload
            if (data.sentence) {
                let sentences = state.sentences;
                sentences.push(data.sentence)
                return {
                    ...state,
                    sentences: sentences,
                    progress: false,
                    finished: false,
                    cancel: false,
                    api_status: true
                }
            }
            return {
                ...state,
                progress: false,
                finished: false,
                cancel: false,
                api_status: true
            }
        }

        case C.SENTENCE_ACTION_API_STOPPED: {
            // let data        = action.payloads
            return {
                ...state,
                api_status: false,
                progress: false,
            }
        }

        default: 
           return state;
     }
}
