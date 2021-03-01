import C from '../../actions/constants';

const initialState = {
    pageno: 0
}

const fetchpageno = (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_NEXT_PAGENO:
            return {
                pageno: state.pageno + 1
            }
        default:
            return {
                pageno: state.pageno
            }
    }
}

export default fetchpageno;