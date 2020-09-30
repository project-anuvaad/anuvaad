import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.USER_AUTH:
            return action.payload;

        default:
            return state;
    }
}