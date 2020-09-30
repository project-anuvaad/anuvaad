
import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.FETCH_COMPARISON_REPORT:
            if (action.payload && Array.isArray(action.payload)) {
                let data_arr = []
                action.payload.map((data, index) => {
                    if (data.model_name) {
                        data_arr.push(data)
                    }
                    return true;
                })
                return data_arr
            }
            return action.payload;
        default:
            return state;
    }
}