import C from '../../actions/constants';

export default function (state = {}, action) {
    const date = new Date();
    switch (action.type) {
        case C.ACTIVATE_EXISTING_USER:
            return {response:action.payload,timestamp:date};

        default:
            return state;
    }
}