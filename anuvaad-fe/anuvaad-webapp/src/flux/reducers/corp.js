import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.FETCH_CORP:
            if(action.payload && Array.isArray(action.payload)){
                action.payload.map((t)=>{
                    var myDate = new Date(t.created_at);
                    t.created_at = (myDate.toLocaleString('en-IN', {day:'2-digit',month:'2-digit',year:'numeric', hour: 'numeric', minute: 'numeric',second:'numeric', hour12: false }))
        return true;
    })
            }
            return action.payload;


           

        default:
            return state;
    }
}
