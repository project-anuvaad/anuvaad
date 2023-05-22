import C from '../../constants';

export default (data) => {
    return {
        type: C.ADD_REVIEW_COMMENT,
        payload: data
    }
}