import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: []
}


const getUserJob = (payload) => {
    let result = payload.tasks.map(task => {
        let date = new Date(task.createdOn).toLocaleString()
        return {
            createdOn: date,
            description: task.description,
            file_identifier: task.fileInfo.identifier,
            file_name: task.fileInfo.name,
            jobId: task.jobId,
            taskId: task.taskId
        }
    })
    return result
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_USER_JOB:
            {
                return {
                    count: action.payload.data.tasks.length,
                    result: getUserJob(action.payload.data),
                }
            }
        default:
            return {
                ...state
            }
    }
}