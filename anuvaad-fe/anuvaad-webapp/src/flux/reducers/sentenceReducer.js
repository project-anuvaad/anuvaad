import C from '../actions/constants';

export default function sentenceReducer(state={}, action){
    switch(action.type) {
        case C.HIGHLIGHT_SENTENCE: {
          let data = action.payload;
          console.log(data)
          return {
            ...state,
            sentence_id: data.block.sentence_id,
           
          }
        }
        

        default: 
           return state;
     }
}
