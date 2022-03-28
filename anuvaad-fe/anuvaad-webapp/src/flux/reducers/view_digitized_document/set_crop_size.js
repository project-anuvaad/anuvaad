import C from '../../actions/constants';


export default (state = {
    height: 0,
    unit: "px",
    width: 0,
    x: 0,
    y: 0
}, action) => {
    switch (action.type) {
        case C.SET_CROP_SIZE:
            return {
                ...action.payload
            }
        case C.RESET_CROP_SIZE:
            return {
                copiedCoords: { ...state },
                height: 0,
                unit: "px",
                width: 0,
                x: 0,
                y: 0
            }
        default:
            return {
                ...state
            }
    }
}