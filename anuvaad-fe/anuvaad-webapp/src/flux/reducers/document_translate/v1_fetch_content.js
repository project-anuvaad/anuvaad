import C from "../../actions/constants";
const PAGE_OPERATION = require('../../../utils/page.operations')

const initialState = {
    count: 0,
    pages: [],
    app_pages: [],
    content_updated: false
}

export default function(state = initialState, action) {
    switch (action.type) {
        case C.FETCH_CONTENT: {
            let data            = action.payload;
            let pages           = data.data.filter(value => (Object.keys(value).length !== 0));
            // let new_pages       = [...state.pages, ...pages]
            let app_pages       = [...state.app_pages, ...PAGE_OPERATION.get_pages_children_information(pages)]

            let new_pages       = [...state.pages, ...pages].filter((v,i,a)=>a.findIndex(t=>(t.page_no === v.page_no))===i).sort((a,b) => {
                if (a.page_no > b.page_no)
                    return 1
                return -1
            })
            // let app_pages       = PAGE_OPERATION.get_pages_children_information(new_pages)

            return {
                ...state,
                count: data.count,
                pages: new_pages,
                app_pages: app_pages
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
            let sentences       = data.sentences;
            let updated_pages   = PAGE_OPERATION.update_tokenized_sentences(state.pages, sentences)
            let app_pages       = PAGE_OPERATION.get_pages_children_information(updated_pages)
            return {
                ...state,
                pages: updated_pages,
                content_updated: true,
                app_pages: app_pages
            }
        }

        case C.UPDATE_BLOCK_CONTENT: {
            let data            = action.payload;
            let blocks          = data.blocks;

            let updated_pages   = PAGE_OPERATION.update_blocks(state.pages, blocks)
            let app_pages       = PAGE_OPERATION.get_pages_children_information(updated_pages)
            return {
                ...state,
                pages: updated_pages,
                content_updated: true,
                app_pages: app_pages
            }
        }

        case C.CLEAR_FETCH_CONTENT:
            return initialState;

        case C.CLEAR_CONTENT:
            return initialState;

        default:
            return state;
    }
}

