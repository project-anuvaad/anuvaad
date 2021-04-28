import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: [],
    updatedid: 0,
    save_count: 0,
    total_count: 0
}

const getTaskDetail = (payload) => {
    let result = []
    payload.data.tasks.forEach(task => {
        task.annotations.forEach(annotation => {
            result.push({
                annotationId: annotation.annotationId,
                source: annotation.source.text,
                target: annotation.target.text,
                score: annotation.score ? annotation.score : 0,
                saved: annotation.saved ? annotation.saved : "",
            })
        })
    })
    return result
}


const getUpdatedAnnotations = (ogData, updatedData) => {
    let result = ogData.map(data => {
        if (data.annotationId === updatedData.annotationId) {
            data.saved = updatedData.saved
            data.score = updatedData.score
            return data
        }
        return data
    })
    return result
}

const getCompletedSentences = (data) => {
    let count = 0;
    data.map(val => {
        if (val.saved) {
            count++;
        }
    })
    return count;
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_ANNOTATOR_JOB:
            {
                let result = getTaskDetail(action.payload)
                return {
                    ...state,
                    count: action.payload.data.tasks[0].annotations.length,
                    result,
                    updatedid: 0,
                    save_count: action.payload.data.tasks[0].saved_sentences,
                    total_count: action.payload.data.tasks[0].total_sentences
                }

            }
        case C.GRADE_SENTENCE: {
            let prevOgData = state
            let updatedData = getUpdatedAnnotations(prevOgData.result, action.payload.data.annotations[0]);
            return {
                ...state,
                result: updatedData,
                updatedid: action.payload.data.annotations[0].annotationId,
                // save_count: action.payload.data.tasks[0].saved_sentences,
                // total_count: action.payload.data.tasks[0].total_sentences
            }
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