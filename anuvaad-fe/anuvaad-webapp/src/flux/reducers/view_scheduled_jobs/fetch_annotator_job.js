import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: []
}

const getTaskDetail = (payload) => {
    let result = []
    payload.data.tasks.forEach(task => {
        task.annotations.forEach(annotation => {
            annotation.forEach(data => {
                result.push({
                    annotationId: data.annotationId,
                    source: data.source.text,
                    target: data.target.text,
                    score: data.score ? data.score : 0,
                    saved: data.saved ? data.saved : false
                })

            })
        })
    })
    return result
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_ANNOTATOR_JOB:
            {
                return {
                    count: action.payload.data.tasks.length,
                    result: getTaskDetail(action.payload)
                }

            }
        case C.UPDATE_ANNOTATOR_JOB:{
            
        }
        case C.CLEAR_ANNOTATOR_JOB:
            {
                return {
                    ...initialState
                }
            }
        default:
            return {
                ...state
            }

    }
}