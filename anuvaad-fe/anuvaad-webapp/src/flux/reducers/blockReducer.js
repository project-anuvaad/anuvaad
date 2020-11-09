import C from '../actions/constants';

export default function blockReducer(state={}, action) {
    switch(action.type) {
        case C.HIGHLIGHT_BLOCK: {
          let data = action.payload;
          return {
            ...state,
            block : data.sentence
            
          }
        }

        case C.CLEAR_HIGHLIGHT_BLOCK: {
          let data = action.payload;
          console.log(data)
          return {
            ...state,
            block: {},
           
          }
        }

        default: 
           return state;
     }
}

