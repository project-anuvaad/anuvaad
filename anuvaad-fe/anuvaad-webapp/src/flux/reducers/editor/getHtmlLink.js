import C from '../../actions/constants';

const initialState = {
    count: -1,
    link: ''
}

const getHtmlData = (payload) => {
    if (payload && Array.isArray(payload.data) && payload.data) {
        return payload.data[0].file_link
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.GET_HTML_LINK:
            let link = getHtmlData(action.payload)
            return {
                ...state,
                link,
                count: link && 1
            }
        case C.CLEAR_HTML_LINK:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
}