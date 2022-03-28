import C from '../../actions/constants';

const initialState = {
    open: false
}

export default function showSidebar(state = initialState, action) {
    switch (action.type) {
        case C.SHOW_SIDEBAR: {
            // return {
            //     ...state,
            //     open: !state.open
            // }
            return action.payload;
        }

        default:
            return state;
    }
}

