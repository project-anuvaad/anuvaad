import C from "../constants";

export function highlightBlock(sentence, pageNumber) {
    return {     
        type: C.HIGHLIGHT_BLOCK,
        payload: {
            sentence: sentence,
            page_no: pageNumber
        }
    }
}

export function highlightSentence(block) {
    return {
        type: C.HIGHLIGHT_SENTENCE,
        payload: {
            block: block
        }
    }
}

export function clearHighlighBlock() {
    return {
        type: C.CLEAR_HIGHLIGHT_BLOCK,
        payload: {
        }
    }
}



/**
 * sentence merge related user action
 */
export function startMergeSentence() {
    return {
        type: C.MERGE_SENTENCE_STARTED,
        payload: {
        }
    }
}

export function inProgressMergeSentence(sentence, isSelected) {
    return {
        type: C.MERGE_SENTENCE_INPROGRESS,
        payload: {
            sentence: sentence,
            selected: isSelected
        }
    }
}

export function finishMergeSentence() {
    return {
        type: C.MERGE_SENTENCE_FINISHED,
        payload: {
            
        }
    }
}

export function cancelMergeSentence() {
    return {
        type: C.MERGE_SENTENCE_CANCEL,
        payload: {
        }
    }
}

export function clearFetchContent() {
    return {
        type: C.CLEAR_FETCH_CONTENT,
        payload: {
        }
    }
}

/**
 * following two apis action is needed to show which is participating in the
 * actions.
 */
export function sentenceActionApiStarted (sentence) {
    return {
        type: C.SENTENCE_ACTION_API_STARTED,
        payload: {
            sentence: sentence
        }
    }
}

export function sentenceActionApiStopped () {
    return {
        type: C.SENTENCE_ACTION_API_STOPPED,
        payload: {
        }
    }
}

/**
 * content update started
 */
export function contentUpdateStarted () {
    return {
        type: C.CONTENT_UPDATE_STARTED,
        payload: {
        }
    }
}

export function fetchContent(count, data) {
    return {
        type: C.FETCH_CONTENT,
        payload: {
            count: count,
            data: data
        }
    }
}