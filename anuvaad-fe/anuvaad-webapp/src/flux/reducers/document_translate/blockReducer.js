import C from '../../actions/constants';

function removeSpaces(data) {
  data.s0_src = data.s0_src && data.s0_src.toString().replace(/\s{2,}/g, ' ').trim()
  data.src = data.src && data.src.toString().replace(/\s{2,}/g, ' ').trim()
  return data
}

export default function blockReducer(state = { current_sid: null, prev_sid: null }, action) {
  switch (action.type) {
    case C.HIGHLIGHT_BLOCK: {
      let data = action.payload;
      if (state.current_sid === null && state.prev_sid === null) {
        return {
          ...state,
          block: removeSpaces(data.sentence),
          current_sid: data.sentence.s_id,
          page_no: data.page_no
        }
      }

      let existing_sid = state.current_sid;
      return {
        ...state,
        block: removeSpaces(data.sentence),
        current_sid: data.sentence.s_id,
        prev_sid: existing_sid,
        page_no: data.page_no
      }
    }

    case C.CLEAR_HIGHLIGHT_BLOCK: {
      let existing_sid = state.current_sid;
      return {
        ...state,
        block: {},
        current_sid: null,
        prev_sid: existing_sid
      }
    }

    default:
      return state;
  }
}

