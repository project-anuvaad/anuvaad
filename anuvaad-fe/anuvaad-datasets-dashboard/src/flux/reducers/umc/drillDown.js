import C from '../../actions/constants';

export default function showPdf(state = {}, action) {
    switch (action.type) {
        case C.DRILL_DOWN: {
            return action.payload;
        }
        default:
            return state;
    }
}

