import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.GET_DOCUMENT_COUNT_PER_ORG:
          return {
            ...state,
            data: action.payload,
          };

        default:
            return state;
    }
}