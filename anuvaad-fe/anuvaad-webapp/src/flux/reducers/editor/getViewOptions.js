import C from '../../actions/constants';

const initialState = {
    option: 'View1'
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.SWITCH_DOCX_VIEW:
            return {
                option: action.payload
            }
        default:
            return {
                ...state
            }
    }
}