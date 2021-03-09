import C from '../../actions/constants';

const initialState = {
    status: true
}

const switchstyles = (state = initialState, action) => {
    switch (action.type) {
        case C.SWITCH_STYLES:
            return {
                status: !state.status
            }
        default:
            return {
                status: state.status
            }
    }
};

export default switchstyles;