import C from "../constants";

export function highlightBlock(sentence) {
    return {     
        type: C.HIGHLIGHT_BLOCK,
        payload: {
            sentence: sentence
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

export function inProgressMergeSentence(sentence) {
    return {
        type: C.MERGE_SENTENCE_INPROGRESS,
        payload: {
            sentence: sentence
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