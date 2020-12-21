import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.AUTO_ML:
            return {text: action.payload};

        default:
            return state;
    }
}
