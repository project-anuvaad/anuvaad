import C from "../../constants";

export function showSidebar(val) {
    return {     
        type: C.SHOW_SIDEBAR,
        payload: {
            open: val
        }
    }
}