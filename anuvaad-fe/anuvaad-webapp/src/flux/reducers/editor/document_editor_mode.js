import C from '../../actions/constants';

export default function (state = {mode: null, sentences: [], page_nos: []}, action) {
    switch (action.type) {
        case C.EDITOR_MODE_NORMAL: {
            let data    = action.payload;
            return {
                ...state,
                mode: data.mode,
                sentences: data.sentences,
                page_nos: data.page_nos
            }
        }
        case C.EDITOR_MODE_MERGE: {
            let data    = action.payload;
            return {
                ...state,
                mode: data.mode,
                sentences: data.sentences,
                page_nos: data.page_nos
            }
        }

        case C.EDITOR_MODE_CLEAR: {
            let data    = action.payload;
            return {
                ...state,
                mode: data.mode,
                sentences: [],
                page_nos: []
            }
        }
        default:
            return state;
    }
}
