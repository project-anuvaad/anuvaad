import C from "../../actions/constants";
const initialState = {
    models: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case C.FETCH_MODEL:{
        let data        = action.payload;
        return {
            ...state,
            models: data
        }
    }
    default:
      return state;
  }
}
