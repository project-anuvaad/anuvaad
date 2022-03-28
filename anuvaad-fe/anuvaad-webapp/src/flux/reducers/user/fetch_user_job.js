import C from '../../actions/constants';
import LanguageCodes from "../../../ui/components/web/common/Languages.json"

const initialState = {
    count: 0,
    result: [],
    status: "INPROGRESS"
}


const getUserJob = (payload) => {
    let result = payload.map(task => {
        let date = new Date(task.createdOn).toLocaleString()

        let source = LanguageCodes.filter(code => {
            if (code.language_code === task.src_locale) {
                return true
            }
        })

        let target = LanguageCodes.filter(code => {
            if (code.language_code === task.tgt_locale) {
                return true
            }
        })

        return {
            createdOn: date,
            description: task.description,
            file_identifier: task.fileInfo.identifier,
            file_name: task.fileInfo.name,
            jobId: task.jobId,
            taskId: task.taskId,
            saved_sentences: task.saved_sentences,
            total_sentences: task.total_sentences,
            source: source[0] ? source[0].language_name : "",
            target: target[0] ? target[0].language_name : ""
        }
    })
    return result
}

const getSortedData = (unSortedData) => {
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
                    status: "COMPLETED"
                }
            }
        default:
            return {
                ...state
            }
    }
}