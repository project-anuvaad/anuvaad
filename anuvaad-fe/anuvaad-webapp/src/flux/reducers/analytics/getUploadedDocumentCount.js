import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.GET_UPLOADED_DOCUMENT_COUNT:
          return {
            ...state,
            data: action.payload,
          };

        default:
            return state;
    }
}