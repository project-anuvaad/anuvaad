import formatDataByStatus from '../../../utils/formatDataByStatus';
import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: [],
}

const getSuggestedGlossaryData = (data=[]) => {
    let result = [];
    let finalResult = [];

    data.map(val => {
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
    });
    let pendingSuggestions = result.filter((el)=>{return el.status === "Pending"});
    let approvedSuggestions = result.filter((el)=>{return el.status === "Approved"});
    let rejectedSuggestions = result.filter((el)=>{return el.status === "Rejected"});

    finalResult = [...pendingSuggestions, ...approvedSuggestions, ...rejectedSuggestions ];
    // console.log("finalResult", finalResult);
    return finalResult;
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