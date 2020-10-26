import C from "../actions/constants";
const initialState = {
    recordIds: []
 }

export default function(state = initialState, action) {
    switch (action.type) {
        case C.JOBSTATUS: {
            let recordIds   = action.payload;
            state.recordIds.push(...recordIds)
            return state
        }
        default:
            return state;
    }
}