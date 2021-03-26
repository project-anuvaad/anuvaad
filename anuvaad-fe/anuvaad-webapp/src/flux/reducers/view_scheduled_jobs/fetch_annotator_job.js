import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: []
}

const getTaskDetail = (payload) => {
    let result = payload.data.tasks.map(task => {
        let source, target, score, saved
        task.annotations.forEach(annotation => {
            annotation.forEach(data => {
                source = data.source.text
                target = data.target.text
                score = data.score ? data.score : 0
                saved = data.saved ? data.saved : false
            })
        })
        return {
            source,
            target,
            score,
            saved
        }
    })
    return  result
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
        default:
            return {
                ...state
            }

    }
}