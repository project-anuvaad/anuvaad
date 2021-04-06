import C from '../../actions/constants';

const initial_state = {
    page_info: [],
    pages: [],
    count: 0
}

const download_json = (state = initial_state, action) => {
    switch (action.type) {
        case C.DOWNLOAD_JSON:
            return {
                ...state,
                page_info: action.payload.data[0].page_info,
                pages: action.payload.data,
                count: action.payload.count
            }

        case C.CLEAR_JSON:
            return {
                page_info: [],
                pages: [],
                count: 0
            }
        default:
            return {
                ...state,
            }
    }
}

export default download_json