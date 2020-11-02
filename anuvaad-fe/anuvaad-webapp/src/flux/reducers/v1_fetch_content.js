import C from "../actions/constants";

const initialState = {
    count: 0,
    pages: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case C.FETCH_CONTENT: {
            let data            = action.payload;
            let pages           = data.data.filter(value => Object.keys(value).length !== 0);

            return {
                ...state,
                count: data.count,
                pages: [...state.pages, ...pages]
            }
        }

        case C.FETCH_CONTENT_UPDATE: {
            let data            = action.payload;
            let page_number     = data.page_number;
            let sentences       = data.sentences;
            let pages           = sentences.data.filter(value => Object.keys(value).length !== 0);
            
            let modified_pages  = state.pages;
            modified_pages.splice(page_number - 1, 1, pages[0])
            return {
                ...state,
                pages: modified_pages
            }
        }

        default:
            return state;
    }
}

