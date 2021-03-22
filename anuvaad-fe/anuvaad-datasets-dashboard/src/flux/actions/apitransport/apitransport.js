import axios from 'axios';
import C from '../constants';

export default function dispatchAPI(api) {
    if (api.reqType === 'MULTIPART') {
        return dispatch => {
            dispatch(apiStatusAsync(true, false, ''))
            axios.create(api.getCustomConfigs()).put(api.apiEndPoint(), api.getFormData(), api.getHeaders())
                .then(function (res) {
                    api.processResponse(res.data)
                    dispatch(apiStatusAsync(false, false, null))
                    dispatch(dispatchAPIAsync(api));
                })
                .catch(function (err) {
                    dispatch(apiStatusAsync(false, true, err.response && err.response.data && err.response.data.why && typeof err.response.data.why !== undefined ? err.response.data.why : 'Something Went Wrong...'))
                });
        }
    }
    else {
        if (api.method === 'POST') {
            return dispatch => {
                dispatch(apiStatusAsync(true, false, ''))
                axios.create(api.getCustomConfigs()).post(api.apiEndPoint(), api.getBody(), api.getHeaders())
                    .then(function (res) {
                        api.processResponse(res.data)
                        if (res.data.http$ && res.data.http$.status === 403) {
                            dispatch(apiStatusAsync(false, true, res.data.why))
                        } else {
                            dispatch(apiStatusAsync(false, false, null))
                        }
                        dispatch(dispatchAPIAsync(api));
                        if (typeof api.getNextStep === 'function' && api.getNextStep()) {
                            dispatch(api.getNextStep())
                        }
                    })
                    .catch(function (err) {
                        if (err && err.request && err.request.status === 0) {
                            dispatch(apiStatusAsync(false, true, 'Network Error...Please try again...'))
                        } else if (err && err.message && err.message.indexOf('timeout') !== -1) {
                            dispatch(apiStatusAsync(false, true, 'Please try again...'))
                        } else if (err && err.response && err.response.data && err.response.data.why && typeof err.response.data.why !== undefined) {
                            dispatch(apiStatusAsync(false, true, err.response.data.why))
                        } else if (err && err.request && err.request.status === 503) {
                            dispatch(apiStatusAsync(false, true, 'Service Temporarily Unavailable'))
                        } else {
                            dispatch(apiStatusAsync(false, true, 'Something went wrong..'))
                        }
                    });
            }
        } else {
            return dispatch => {
                dispatch(apiStatusAsync(true, false, ''))
                axios.get(api.apiEndPoint(), api.getHeaders())
                    .then(function (res) {
                        api.processResponse(res.data)
                        dispatch(apiStatusAsync(false, false, null))
                        dispatch(dispatchAPIAsync(api));
                    })
                    .catch(function (err) {
                        dispatch(apiStatusAsync(false, true, 'api failed'))
                    });
            }
        }
    }
}

function dispatchAPIAsync(api) {
    return {
        type: api.type,
        payload: api.getPayload()
    }
}

function apiStatusAsync(progress, error, message) {
    return {
        type: C.APISTATUS,
        payload: {
            progress: progress,
            error: error,
            message: message
        }
    }
}

