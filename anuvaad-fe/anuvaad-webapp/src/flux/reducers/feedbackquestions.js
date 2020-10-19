import C from "../actions/constants";

export default function(state = {}, action) {
  switch (action.type) {
    case C.FEEDBACK_QUESTIONS:
      return action.payload;
    default:
      return state;
  }
}
