import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.DELETE:
            if(action.payload){
                action.payload.timestamp = new Date().getMilliseconds()
            }
    
            return action.payload;

        default:
            return state;
    }
}