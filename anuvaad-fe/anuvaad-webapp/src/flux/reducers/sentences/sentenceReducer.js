import C from '../../actions/constants';

export default function sentenceReducer(state={}, action){
    switch(action.type) {
        case C.HIGHLIGHT_SENTENCE: {
          let data = action.payload;
          return {
            ...state,
            sentence: data.block,
           
          }
        }

        case C.CLEAR_HIGHLIGHT_BLOCK: {
          return {
            ...state,
            sentence: {},
           
          }
        }
        

        default: 
           return state;
     }
}
