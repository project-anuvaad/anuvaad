import C from "../../actions/constants";
const initialState = {
    status: ""
}

export default function(state = initialState, action) {
  switch (action.type) {
      
    case C.JOBPROGRESSSTATUS:{
        let data        = action.payload[0];
        return {
           
            status: data.completed_sentence_count +" of " + data.total_sentence_count,
            word_status: data.completed_word_count +" of " + data.total_word_count
        }
    }
    case C.CLEAR_FETCH_CONTENT:
      return initialState;
    default:
      return state;
  }
}
