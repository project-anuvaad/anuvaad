import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.UPDATE_PDF_TABLE:
            return action.payload;

        default:
            return state;
    }
}
