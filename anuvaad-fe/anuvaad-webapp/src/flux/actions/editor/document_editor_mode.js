import C from "../constants";

export function editorModeNormal(sentences, page_nos) {
    return {     
        type: C.EDITOR_MODE_NORMAL,
        payload: {
            mode: C.EDITOR_MODE_NORMAL,
            sentences: sentences,
            page_nos: page_nos
        }
    }
}

export function editorModeClear() {
    return {     
        type: C.EDITOR_MODE_CLEAR,
        payload: {
            mode: C.EDITOR_MODE_CLEAR,
            sentences: [],
            page_nos: []
        }
    }
}

export function editorModeMerge(sentences, page_nos) {
    return {
        type: C.EDITOR_MODE_MERGE,
        payload: {
            mode: C.EDITOR_MODE_MERGE,
            sentences: sentences,
            page_nos: page_nos
        }
    }
}
