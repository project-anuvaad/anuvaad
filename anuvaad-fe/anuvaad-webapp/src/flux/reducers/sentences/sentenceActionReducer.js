import C from '../../actions/constants';

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
            let data        = action.payload;
            let sentence    = data.sentence;
            let selected    = data.selected;

            let sentences = state.sentences;
            if (!selected) {
                /**
                 * user selected a sentence
                 */
                if(sentences.filter(sent => sent.s_id === sentence.s_id).length === 0) {
                    /**
                     * s_id is not added, so add it.
                     */
                    sentences.push(data.sentence)
                    return {
                        ...state,
                        sentences: sentences,
                        progress: true
                    }
                } else {
                    return {
                        ...state,
                        progress: true
                    }
                }
            } else {
                /**
                 * user de-selected a sentence
                 */
                let updated_sentences = sentences.filter(sent => sent.s_id !== sentence.s_id)
                return {
                    ...state,
                    sentences: updated_sentences,
                    progress: true
                }
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
