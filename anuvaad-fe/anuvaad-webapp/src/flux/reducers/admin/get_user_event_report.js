import C from '../../actions/constants';

const initialState = {
    responseData: []
}

const getTime = (duration) => {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}

function removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject = {};

    for (var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

const getUserEventData = (payload) => {
    let result = []
    payload.forEach(res => {
        res.forEach(data => {
            const { src, initial, bleu_score, final, time_spent, s_id, user_events } = data.context.cdata
            src && result.push({
                src,
                mt: initial !== undefined ? initial : "",
                bleu_score: Number(bleu_score).toFixed(2),
                tgt: final,
                time_spent: getTime(time_spent),
                s_id,
                user_events: user_events !== undefined ? user_events : []
            })
        })
    })

    let latestEvent = removeDuplicates(result, 's_id')

    return latestEvent;
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.GET_USER_EVENT_REPORT:
            return {
                responseData: getUserEventData(action.payload.responseData)
            }
        case C.CLEAR_USER_EVENT:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
}