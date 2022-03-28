import C from '../../actions/constants';

const initialState = {
    open: false
}

export default function showPdf(state = initialState, action) {
    switch (action.type) {
        case C.SHOW_PDF: {
            return {
                ...state,
                open: !state.open
            }
        }
        case C.CLEAR_SHOW_PDF:
            return initialState;
        default:
            return state;
    }
}

