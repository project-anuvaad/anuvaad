import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.GET_TRANSLATED_AND_VERIFIED_SETENCE_COUNT:
          return {
            ...state,
            data: action.payload,
          };

        default:
            return state;
    }
}