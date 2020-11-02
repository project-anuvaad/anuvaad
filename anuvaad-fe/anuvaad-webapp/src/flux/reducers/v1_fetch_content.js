import C from "../actions/constants";
const PAGE_OPERATION = require('../../utils/page.operations')

const initialState = {
    count: 0,
    pages: [],
    content_updated: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case C.FETCH_CONTENT: {
            let data            = action.payload;
            let pages           = data.data.filter(value => Object.keys(value).length !== 0);

            return {
                ...state,
                count: data.count,
                pages: [...state.pages, ...pages],
                content_updated: false
            }
        }

        case C.UPDATE_SENTENCE_CONTENT: {
            let data            = action.payload;
            let page_number     = data.page_number;
            let sentences       = data.sentences;

            let page            = state.pages[page_number-1];
            let updated_page    = PAGE_OPERATION.update_tokenized_sentences(page, sentences)
            let pages           = state.pages
            pages.splice(page_number - 1, 1, updated_page)

            return {
                ...state,
                pages: pages,
                content_updated: true
            }
        }

        case C.UPDATE_BLOCK_CONTENT: {
            let data            = action.payload;
            let page_number     = data.page_number;
            let blocks          = data.blocks;

            let page            = state.pages[page_number-1];
            let updated_page    = PAGE_OPERATION.update_blocks(page, blocks)
            let pages           = state.pages
            pages.splice(page_number - 1, 1, updated_page)

            return {
                ...state,
                pages: pages,
                content_updated: true
            }
        }

        default:
            return state;
    }
}

