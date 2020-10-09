import C from "../actions/constants";
//import { act } from "react-test-renderer";

const initialUserState = {
  result: []
};
export default function(state = initialUserState, action) {
  switch (action.type) {
    case C.FETCH_CONTENT:
      let result = state.result;
      let status = false, i, pageD;
      if (result !== null && result.data) {
        action.payload.data.map(payloadData => {
          result.data.map((pageDetails, index) => {
            if (pageDetails.page_no === payloadData.page_no) {
              pageDetails = payloadData;
              status = true;
              i=  index;
              pageD = payloadData;
            }
          return null;});
          if (status) {
            result.data[i] = pageD
            status = false;
          } else {
            result.data = result.data.concat(payloadData);
          }
        return null;});
      } else {
        
        result = action.payload;
      }
      return {
        ...state,
        result: result
      };
    case C.CLEAR_CONTENT:
      return initialUserState;
    default:
      return state;
  }
}
