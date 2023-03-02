import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.TRANSLITERATION_MODEL_ID:
            return action.payload;
        default:
            return state;
    }
}
