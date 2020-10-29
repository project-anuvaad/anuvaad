import C from "../actions/constants";

const initialState = {
    count: 0,
    pages: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case C.FETCH_CONTENT: {
            let data            = action.payload;
            let pages           = data.data

            if (state.pages.length == 0) {
                return {
                    count: data.count,
                    pages: pages
                }
            }
            pages.push(...pages)
            return {
                ...state,
                count: data.count,
                pages: pages
            }
        }

        default:
            return state;
    }
}

