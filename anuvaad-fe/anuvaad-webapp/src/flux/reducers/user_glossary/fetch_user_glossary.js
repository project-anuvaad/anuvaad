import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: [],
}

const getGlossaryData = (data) => {
    let result = data.map(val => (
        {
            ...val,
            id: val.hash,
            tgt: val.user_tgt,
            typeOfGlossary: val.orgID ? "Organization" : "Individual"
        }
    ))
    return result
}
export default (state = initialState, action) => {
    switch (action.type) {
        case C.VIEW_GLOSSARY:
            let data = getGlossaryData(action.payload)
            return {
                result: data,
                count: action.payload.length,
                deleted: action.payload.length < state.count ? true : false
            }
        default:
            return state

    }
}