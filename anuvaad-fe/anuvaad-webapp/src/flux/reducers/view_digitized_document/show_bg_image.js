import C from '../../actions/constants'

const initialState = {
    status: false
}

const showimage = (state = initialState, action) => {
    switch (action.type) {
        case C.SHOW_BG_IMAGE:
            return {
                status: !state.status
            }
        default:
            return {
                status: state.status
            }
    }
}

export default showimage; 