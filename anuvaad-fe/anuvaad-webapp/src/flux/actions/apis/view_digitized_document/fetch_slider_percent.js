import C from '../../constants'

const fetch_slider_percent = (percent) => {
    return {
        type: C.FETCH_SLIDER_PERCENT,
        payload: percent
    }
}

export default fetch_slider_percent;