import C from '../../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        
        case C.GET_ALL_SUPPORTED_LANG_LIST:

            return action.payload?.data?.orgs?.sort(function(a,b){
                return a.code.localeCompare(b.code);
            });

        default:
            return state;
    }
}