import C from "../constants";

export function currentPageUpdate(page_data) {
    debugger
    return {     
        type: C.DRILL_DOWN,
        
        payload: {
            page_data
        }
    }
}

