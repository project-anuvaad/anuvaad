import C from "../constants";

export function createJobEntry(job) {
    return {     
        type: C.CREATE_JOB_ENTRY,
        payload: {
            job: job
        }
    }
}

export function clearJobEntry() {
    return {
        type: C.CLEAR_JOB_ENTRY,
        payload: {}
    }
}
