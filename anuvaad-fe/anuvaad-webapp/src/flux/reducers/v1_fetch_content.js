import C from "../actions/constants";

const initialState = {
    documents:[
        /**
        {
            record_id: '',
            count: 0,
            data: data
        }
         */
    ]
}

export default function(state = initialState, action) {
    switch (action.type) {
        case C.FETCH_CONTENT: {
            let data            = action.payload;
            document['count']   = data.count;
            document['data']    = data.data
            state.documents     = []
            state.documents.push(document)
            
            return state
        }

        default:
            return state;
    }
}

