import C from "../../constants";

export default function ClearContent(refresh) {
    return dispatch => {
        dispatch({ type: C.CLEAR_CONTENT, refresh: refresh })
    }
}