import C from '../../constants'

const fetch_slider_pixel = (pixel) => {
    return {
        type: C.FETCH_SLIDER_PIXEL,
        payload: pixel
    }
}

export default fetch_slider_pixel;