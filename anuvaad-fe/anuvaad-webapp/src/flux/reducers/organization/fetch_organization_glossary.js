import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: [],
}

const getOrgGlossaryData = (data) => {
    let result = data.map(val => {
        return {
            id: val.hash,
            src: val.src,
            tgt: val.user_tgt,
            locale: val.locale,
            userID: val.userID,
            context: val.context,
            typeOfGlossary: val.orgID ? "Organization" : "Individual",
            orgID : val.orgID ? val.orgID : ""
        }
    })
    return result
}
export default (state = initialState, action) => {
    switch (action.type) {
        case C.VIEW_GLOSSARY:
            let data = getOrgGlossaryData(action.payload)
            return {
                result: data,
                count: action.payload.length,
                deleted: action.payload.length < state.count ? true : false
            }
        default:
            return state

    }
}