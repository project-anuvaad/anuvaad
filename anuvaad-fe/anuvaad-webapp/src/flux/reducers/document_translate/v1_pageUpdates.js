import C from "../../actions/constants";
const initialState = {
    page_number: 1
}

export default function(state = initialState, action) {
   
  switch (action.type) {
    
    case C.UPDATE_PAGENUMBER: {

        let data        = action.payload.page_number;
        return {
            ...state,
            page_number: data
        }
    }
    default:
      return state;
  }
}
