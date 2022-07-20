import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: [],
}

const getSuggestedGlossaryData = (data) => {
    let result = [];
    data.map(val => {
        // if(val.created_on && val.id && val.locale && val.orgID && val.src && val.tgt && val.uploaded_by){
            result.push({
            id: val.id,
            src: val.src,
            tgt: val.tgt,
            locale: val.locale,
            userID: val.uploaded_by,
            orgID: val.orgID,
            createdOn: val.created_on,
            uuid : val.id,
            status: val.status
        });
        // } 
    })
    return result;
}
export default (state = initialState, action) => {
    switch (action.type) {
        case C.GET_GLOSSARY_SUGGESTION:
            let data = getSuggestedGlossaryData(action.payload)
            return {
                result: data,
                count: action.payload.length,
                deleted: action.payload.length < state.count ? true : false
            }
        default:
            return state

    }
}