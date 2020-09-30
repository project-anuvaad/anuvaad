import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.NMT:
            if(action.payload && Array.isArray(action.payload)){
                let previous_model_id = ''
                let data_arr = []
                let previous_data = null
                action.payload.map((data, index)=>{
                    if(data.s_id.indexOf('_Comma Split') > 0){
                        if(previous_model_id !== data.s_id){
                            if(previous_data != null){
                                data_arr.push(previous_data)
                            }
                            previous_data = data
                            previous_model_id = data.s_id
                        }
                        else{
                            if(index === action.payload.length - 1){
                                data_arr.push(previous_data)
                            }
                            previous_data.tgt = previous_data.tgt + ', '+data.tgt
                        }
                    }
                    else{
                        if(previous_data != null){
                            data_arr.push(previous_data)
                        }
                        previous_data = null
                        data_arr.push(data)
                    }
                    return data
                })
                return data_arr
            }
            return action.payload;

        default:
            return state;
    }
}
