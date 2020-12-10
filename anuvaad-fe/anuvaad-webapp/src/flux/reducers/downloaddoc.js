import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.DOWNLOAD_DOC:
            return action.payload;

        default:
            return state;
    }
}