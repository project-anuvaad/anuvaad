import C from "../../actions/constants";
const initialState = {
    languages: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    
    case C.FETCH_LANGUAGE: {
        let data        = action.payload;
        return {
            ...state,
            languages: data
        }
    }
    default:
      return state;
  }
}
