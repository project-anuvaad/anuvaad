import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.DOCUMENT_CONVERTER:
            return action.payload;

        default:
            return state;
    }
}