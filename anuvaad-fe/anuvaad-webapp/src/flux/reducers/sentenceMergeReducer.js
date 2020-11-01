import C from '../actions/constants';

export default function sentenceMergeReducer(state={started: false, progress: false, finished: false, cancel: false, sentences:[]}, action){
    switch(action.type) {
        case C.MERGE_SENTENCE_STARTED: {
          let data      = action.payload;
          return {
              ...state,
              started: true,
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
            let data      = action.payload;
            return {
                ...state,
                progress: false,
                finished: true
            }
        }

        case C.MERGE_SENTENCE_CANCEL: {
            let data      = action.payload;
            return {
                ...state,
                started: false,
                sentences: [],
                progress: false,
                finished: true,
                cancel: true
            }
        }

        default: 
           return state;
     }
}
