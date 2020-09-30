import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.USER_DIRECTORY:
            
            if(action.payload && Array.isArray(action.payload)){
                action.payload.map((t)=>{
                    var myDate = new Date(t.createdAt);
                    t.createdAt = (myDate.toLocaleString('en-US', {day:'2-digit',month:'2-digit',year:'numeric', hour: 'numeric', minute: 'numeric',second:'numeric', hour12: false }))
        return true;

            
    })
            }
            return action.payload;

        default:
            return state;
    }
}



    