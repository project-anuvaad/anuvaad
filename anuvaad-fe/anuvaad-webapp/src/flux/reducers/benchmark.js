import C from '../actions/constants';

export default function (state = {}, action) {
    switch (action.type) {
        case C.FETCH_BENCH:
            if(action.payload && action.payload.data && Array.isArray(action.payload.data)){
                action.payload.data.map((t)=>{
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
    