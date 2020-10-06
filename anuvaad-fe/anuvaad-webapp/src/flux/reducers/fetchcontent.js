import C from "../actions/constants";
import { act } from "react-test-renderer";

const initialUserState = {
  result: []
};
export default function(state = initialUserState, action) {
  switch (action.type) {
    case C.FETCH_CONTENT:
      let result = state.result;
      let status = false, i, pageD;
      if (result!==null && result.data) {
        action.payload.data.pages.map(payloadData => {
          result.data.pages.map((pageDetails, index) => {
            if (pageDetails.page_no == payloadData.page_no) {
              pageDetails = payloadData;
              status = true;
              i=  index;
              pageD = payloadData;
            }
          });
          if (status) {
            result.data.pages[i] = pageD
            status = false;
          } else {
            result.data.pages = result.data.pages.concat(payloadData);
            result.data.end_page = action.payload.data.end_page
            
          }
        });
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