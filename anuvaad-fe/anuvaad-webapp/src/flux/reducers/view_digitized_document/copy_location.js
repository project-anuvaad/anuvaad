import C from '../../actions/constants';

const initialState = {
    status: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.COPY_LOCATION:
            return {
                status: !state.status
            }
        default:
            return {
                status: state.status
            }
    }
}
