import C from '../../actions/constants';

export default function (state = {}, action) {
  // console.log(" action.payload ----- ", action);
    switch (action.type) {
        
        case C.GET_COUNT_BY_LANG:
          return {
            ...state,
            data: action.payload,
          };

        default:
            return state;
    }
}