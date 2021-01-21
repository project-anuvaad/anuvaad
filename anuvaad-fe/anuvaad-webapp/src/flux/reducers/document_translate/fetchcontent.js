import C from "../../actions/constants";

const initialUserState = {
  result: []
};

function removeSpaces(actionPayload) {
  actionPayload.data.forEach(data => {
    if (data.text_blocks) {
      data.text_blocks.forEach(text_blocks => {
        text_blocks.text = text_blocks.text.replace(/\s{2,}/g, " ").trim()
        text_blocks.children.forEach(children => {
          children.text = children.text.replace(/\s{2,}/g, " ").trim()
        })
      })
    }
  })
  return actionPayload
}
export default function (state = initialUserState, action) {
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
        result = action.payload;
      }
      return {
        ...state,
        result: removeSpaces(result)
      };

    case C.CLEAR_CONTENT:
      return initialUserState;
    default:
      return state;
  }
}
