import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.GET_ALL_SUPPORTED_LANG_LIST:

            return action.payload?.data?.orgs;

        default:
            return state;
    }
}