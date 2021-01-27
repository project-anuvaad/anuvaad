import C from "../../constants";

export function showPdf() {
    return {     
        type: C.SHOW_PDF,
        payload: {
           
        }
    }
}

export function clearShowPdf() {
    return {     
        type: C.CLEAR_SHOW_PDF,
        payload: {
           
        }
    }
}