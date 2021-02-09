import C from '../../actions/constants';

const initial_state = {
    page_info: [],
    pages: []
}

const download_json = (state, action) => {
    switch (action.type) {
        case C.DOWNLOAD_JSON:
            let data = {
                page_info: action.payload.outputs[0].page_info,
                pages: action.payload.outputs[0].pages
            }
            return {
                result: data
            }
        default:
            return {
                ...state
            }
    }
}

export default download_json