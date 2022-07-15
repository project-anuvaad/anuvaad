import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: [],
}

const getSuggestedGlossaryData = (data) => {
    let result = data.map(val => {
        if(val.uploaded_by && val.created_on && val.id && val.orgID && !val.context){
            return ({
            id: val.id,
            src: val.src,
            tgt: val.tgt,
            locale: val.locale,
            userID: val.uploaded_by,
            orgID: val.orgID,
            createdOn: val.created_on.toString(),
            uuid : val.id
        })
        }
        
    })
    return result
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