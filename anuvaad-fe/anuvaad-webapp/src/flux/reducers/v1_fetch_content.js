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
            let new_pages       = [...state.pages, ...pages].filter((v,i,a)=>a.findIndex(t=>(t.page_no === v.page_no))===i).sort((a,b) => {
                if (a.page_no > b.page_no)
                    return 1
                return -1
            })

            return {
                ...state,
                count: data.count,
                pages: new_pages,
            }
        }

        case C.CONTENT_UPDATE_STARTED: {
            return {
                ...state,
                content_updated: false
            }
        }

        case C.UPDATE_SENTENCE_CONTENT: {
            let data            = action.payload;
            let page_number     = data.page_number;
            let sentences       = data.sentences;
            let updated_pages   = PAGE_OPERATION.update_tokenized_sentences(state.pages, sentences)

            return {
                ...state,
                pages: updated_pages,
                content_updated: true
            }
        }

        case C.UPDATE_BLOCK_CONTENT: {
            let data            = action.payload;
            let page_number     = data.page_number;
            let blocks          = data.blocks;

            let updated_page    = PAGE_OPERATION.update_blocks(state.pages, blocks)

            return {
                ...state,
                pages: updated_page,
                content_updated: true
            }
        }

        case C.CLEAR_CONTENT:
            return initialState;

        default:
            return state;
    }
}

