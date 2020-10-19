import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.UPLOADPDF:
            return {text: action.payload};

        default:
            return state;
    }
}
