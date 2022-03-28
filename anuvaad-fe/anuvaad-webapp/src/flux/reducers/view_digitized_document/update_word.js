import C from '../../actions/constants';

const initialState = {
    words: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.UPDATE_WORD:
            let data = []
            data.push(action.payload.data[0])
            if (state.words.length) data.push(...state.words)
            return {
                words: data
            }

        case C.RESET_WORD:
            return {
                words: []
            }
        default:
            return {
                words: state.words
            }
    }

}