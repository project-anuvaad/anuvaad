import C from "../../actions/constants";

export default function asyncJobManagement(state = {}, action) {
    switch(action.type) {
        case C.CREATE_JOB_ENTRY: {
            return {
                ...state,
                job: action.payload.job
            }
        }
        case C.CLEAR_JOB_ENTRY: {
            return {
                ...state,
                job: null
            }
        }

        default:
            return state
    }
}
