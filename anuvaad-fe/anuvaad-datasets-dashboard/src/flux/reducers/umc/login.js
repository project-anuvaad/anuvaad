import C from '../../actions/constants';

export default function (state = {}, action) {
    console.log("ACTIONS",action)
    switch (action.type) {
        case C.LOGIN:
            return action.payload;
        default:
            return state;
    }
}
