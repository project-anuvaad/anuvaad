import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.MARK_INACTIVE:
            return action.payload;

        default:
            return state;
    }
}
