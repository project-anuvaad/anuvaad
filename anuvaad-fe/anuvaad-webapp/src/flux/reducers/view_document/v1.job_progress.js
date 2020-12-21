import C from "../../actions/constants";
const initialState = {
    status: ""
}

export default function(state = initialState, action) {
  switch (action.type) {
      
    case C.JOBPROGRESSSTATUS:{
        let data        = action.payload[0];
        return {
           
            status: data.completed_sentence_count +" of " + data.total_sentence_count
        }
    }
    case C.CLEAR_FETCH_CONTENT:
      return initialState;
    default:
      return state;
  }
}
