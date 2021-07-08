import C from '../../constants';

export default (option) => {
    return {
        type: C.SWITCH_DOCX_VIEW,
        payload: option
    }
}