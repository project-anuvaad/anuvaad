import C from '../../actions/constants';

const initial_state = {
    pages: [],
    srcLanguage: "",
    count: 0
}

const download_json = (state = initial_state, action) => {
    switch (action.type) {
        case C.DOWNLOAD_JSON:
            return {
                ...state,
                pages: action.payload.data.pages,
                srcLanguage: action.payload.data.config.language,
                count: action.payload.count
            }

        case C.CLEAR_JSON:
            return {
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