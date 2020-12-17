import C from "../../constants";

export function update_sentences(page_number, sentences) {
    return {     
        type: C.UPDATE_SENTENCE_CONTENT,
        payload: {
            page_number: page_number,
            sentences: sentences
        }
    }
}

export function update_blocks(page_number, blocks) {
    return {     
        type: C.UPDATE_BLOCK_CONTENT,
        payload: {
            page_number: page_number,
            blocks: blocks
        }
    }
}

