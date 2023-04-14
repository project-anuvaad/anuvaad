import C from "../../constants";

export default function clearOrgGlossary(refresh) {
    return dispatch => {
        dispatch({ type: C.CLEAR_GLOSSARY_DATA, refresh: refresh })
    }
}