import C from '../actions/constants';

export default function blockReducer(state={}, action) {
    switch(action.type) {
        case C.HIGHLIGHT_BLOCK: {
          let data = action.payload;
          return {
            ...state,
            block_identifier: data.sentence.block_identifier
            
          }
        }

        case C.CLEAR_HIGHLIGHT_BLOCK: {
          let data = action.payload;
          console.log(data)
          return {
            ...state,
            block_identifier: "",
           
          }
        }

        default: 
           return state;
     }
}

