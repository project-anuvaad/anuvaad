import C from '../actions/constants';

export default function blockReducer(state={active_s_id:null}, action) {
    switch(action.type) {
        case C.HIGHLIGHT_BLOCK: {
          let data = action.payload;
          return {
            ...state,
            block : data.sentence,
            active_s_id: data.sentence.s_id
          }
        }

        case C.CLEAR_HIGHLIGHT_BLOCK: {
          let data = action.payload;
          return {
            ...state,
            block: {},
          }
        }

        default: 
           return state;
     }
}

