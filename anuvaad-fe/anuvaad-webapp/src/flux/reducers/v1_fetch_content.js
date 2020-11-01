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

        default:
            return state;
    }
}

