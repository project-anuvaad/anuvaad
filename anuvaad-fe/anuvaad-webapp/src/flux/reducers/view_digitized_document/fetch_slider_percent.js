import C from '../../actions/constants'

const initialState = {
    percent: 80
}

const fetch_slider_percent = (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_SLIDER_PERCENT:
            return {
                ...state,
                percent: action.payload
            }
        default:
            return {
                state
            }
    }
}

export default fetch_slider_percent;