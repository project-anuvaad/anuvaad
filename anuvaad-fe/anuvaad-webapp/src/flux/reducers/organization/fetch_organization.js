import C from '../../actions/constants';

const initialUserState = {
    result: [],
    data: [],
    orgList:[]
};


export default function (state = initialUserState, action) {
    switch (action.type) {
        case C.FETCHORGANIZATION:
            const newdata =action.payload.data;
            let orgListArray =[];
             action.payload.data.map(value=>{value.active && orgListArray.push(value.code)})
            return {
                ...state,
                data: newdata,
                orgList:orgListArray

                
            }
       
            
        default:
            return state;
    }
}