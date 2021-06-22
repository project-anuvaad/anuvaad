import C from '../../actions/constants';

const initialState = {
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
                link
            }
        default:
            return {
                ...state
            }
    }
}