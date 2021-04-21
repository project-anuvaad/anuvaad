import C from '../../actions/constants'

const getJobDetails = (payload) => {
    let result = payload.tasks.map(task => {
        let d = new Date(task.createdOn).toLocaleString()
        return {
            createdOn: d,
            description: task.description,
            file_name: task.fileInfo.name,
            taskId: task.taskId,
            name: task.user.name,
            userId: task.user.userId,
            saved_sentences: task.saved_sentences,
            total_sentences: task.total_sentences

        }
    })
    return result
}

const initialState = {
    result: [],
    count: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_JOB_DETAIL:
            return {
                count: action.payload.data.tasks.length,
                result: getJobDetails(action.payload.data)
            }
        default:
            return {
                ...state
            }
    }
}