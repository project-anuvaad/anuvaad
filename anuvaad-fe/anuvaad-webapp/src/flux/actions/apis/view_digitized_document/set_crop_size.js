import C from '../../../actions/constants'

export default (cropData = "", resetFlag = false) => {
    if (resetFlag) {
        return {
            type: C.RESET_CROP_SIZE
        }
    }
    return {
        type: C.SET_CROP_SIZE,
        payload: cropData
    }
}