import C from '../../actions/constants'

const getJobDetails = (payload) => {
    let result = payload.tasks.map(task => {
        let date = new Date(task.createdOn)
        let localDate = ("0" + date.getDate()).slice(-2) +
            "/" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "/" +
            date.getFullYear() +
            " " +
            ("0" + date.getHours()).slice(-2) +
            ":" +
            ("0" + date.getMinutes()).slice(-2)
        return {
            createdOn: localDate,
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
        case C.CLEAR_JOB_DETAIL:
            return {
                ...initialState
            }
        default:
            return {
                ...state
            }
    }
}