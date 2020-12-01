import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.UPLOAD_TOKEN:
            return action.payload;

        default:
            return state;
    }
}
