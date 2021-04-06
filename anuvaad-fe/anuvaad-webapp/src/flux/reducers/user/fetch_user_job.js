import C from '../../actions/constants';

const initialState = {
    count: 0,
    result: []
}


const getUserJob = (payload) => {
    let result = payload.map(task => {
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

const getSortedData = (unSortedData) => {
    console.log(unSortedData)
    let sortedData = unSortedData.tasks.sort((a, b) => {
        if (a.createdOn < b.createdOn) {
            return 1
        }
        return -1;
    })
    return sortedData
}

export default (state = initialState, action) => {
    switch (action.type) {
        case C.FETCH_USER_JOB:
            {
                let sortedData = getSortedData(action.payload.data)
                let result = getUserJob(sortedData)
                return {
                    count: action.payload.data.tasks.length,
                    result,
                }
            }
        default:
            return {
                ...state
            }
    }
}