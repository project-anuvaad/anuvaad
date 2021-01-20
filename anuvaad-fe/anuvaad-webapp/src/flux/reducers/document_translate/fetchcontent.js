import C from "../../actions/constants";

const initialUserState = {
  result: []
};
export default function (state = initialUserState, action) {
  switch (action.type) {
    case C.FETCH_CONTENT:
      let result = state.result;
      let status = false, i, pageD;
      let actionPayload = Object.assign({}, action.payload)
      if (actionPayload.data !== undefined) {
        actionPayload.data.forEach(data => {
          if (data.text_blocks !== undefined)
            data.text_blocks.forEach(text_blocks => {
              if (text_blocks.text !== undefined || text_blocks.children !== undefined) {
                text_blocks.text = text_blocks.text.replace(/\s{2,}/g, " ").trim()
                text_blocks.children.forEach(children => {
                  children.text = children.text.replace(/\s{2,}/g, " ").trim()
                })
              }
            })
        })
      }
      if (result !== null && result.data) {
        actionPayload.data.map(payloadData => {
          result.data.map((pageDetails, index) => {
            if (pageDetails.page_no === payloadData.page_no) {
              pageDetails = payloadData;
              status = true;
              i = index;
              pageD = payloadData;
            }
            return null;
          });
          if (status) {
            result.data[i] = pageD
            status = false;
          } else {
            result.data = result.data.concat(payloadData);
          }
          return null;
        });
      } else {
        result = actionPayload//action.payload;
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
