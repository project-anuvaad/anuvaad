import C from '../../actions/constants'

const initialState = {
    percent: 40
}

const fetch_slider_pixel = (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_SLIDER_PIXEL:
            return {
                ...state,
                percent: action.payload
            }
        default:
            return {
                percent: state.percent
            }
    }
}

export default fetch_slider_pixel;