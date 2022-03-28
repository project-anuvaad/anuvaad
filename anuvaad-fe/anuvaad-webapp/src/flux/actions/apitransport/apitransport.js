import axios from "axios";
import C from "../constants";
import Strings from "../strings";

const TELEMETRY = require('../../../utils/TelemetryManager')

function dispatchAPIAsync(api) {
  return {
    type: api.type,
    payload: api.getPayload()
  };
}

function apiStatusAsync(progress, errors, message, res = null, unauthrized = false, loading = false) {
  if (res === null || !(res.status && res.status.statusCode && res.status.statusCode !== 200 && res.status.statusCode !== 201)) {
    return {
      type: C.APISTATUS,
      payload: {
        progress,
        error: errors,
        message: res && res.status && res.status.statusMessage ? res.status.statusMessage : message,
        unauthrized: unauthrized,
        loading: loading
      }
    };
  }
  return {
    type: C.APISTATUS,
    payload: {
      progress,
      error: res.status.statusCode === 200 || res.status.statusCode === 201,
      message: res.status.statusCode === 200 || res.status.statusCode === 201 ? message : res.status.errorMessage,
      unauthrized: unauthrized,
      loading: loading
    }
  };
}

function success(res, api, dispatch) {
  api.processResponse(res.data);
  dispatch(apiStatusAsync(false, false, api.successMsg, res.data, null, false));
  if (api.type) {
    dispatch(dispatchAPIAsync(api));
  }
  if (typeof api.processNextSuccessStep === "function" && res.status && (res.status === 200 || res.status === 201))
    api.processNextSuccessStep(res.data);
}

function error(err, api, dispatch) {
  let errorMsg = err.response && err.response.data && err.response.data.why ? err.response.data.why : Strings.error.message.http.default;
  TELEMETRY.log('', err.response && err.response.data ? JSON.stringify(err.response.data) : err.response, api.endpoint)
  if (api.errorMsg || api.errorMsg === null) {
    errorMsg = api.errorMsg === null ? "" : api.errorMsg;
  }
  dispatch(apiStatusAsync(false, true, errorMsg, null, err.response && err.response.status === 401 ? true : false));
  if (typeof api.processNextErrorStep === "function") {
    api.processNextErrorStep();
  }
}

export const updateMessage = apiStatusAsync;

export default function dispatchAPI(api) {
  if (api.reqType === "MULTIPART") {
    return dispatch => {
      dispatch(apiStatusAsync(api.dontShowApiLoader() ? false : true, false, ""));
      axios
        .post(api.apiEndPoint(), api.getFormData(), api.getHeaders())
        .then(res => {
          success(res, api, dispatch);
        })
        .catch(err => {
          error(err, api, dispatch);
        });
    };
  } else if (api.method === "POST") {
    return dispatch => {
      dispatch(apiStatusAsync(api.dontShowApiLoader() ? false : true, false, "", null, null, true));
      axios
        .post(api.apiEndPoint(), api.getBody(), api.getHeaders())
        .then(res => {
          success(res, api, dispatch);
        })
        .catch(err => {
          error(err, api, dispatch);
        });
    };
  } else if (api.method === "PUT") {
    return dispatch => {
      dispatch(apiStatusAsync(api.dontShowApiLoader() ? false : true, false, ""));
      axios
        .put(api.apiEndPoint(), api.getBody(), api.getHeaders())
        .then(res => {
          success(res, api, dispatch);
        })
        .catch(err => {
          error(err, api, dispatch);
        });
    };
  } else if (api.method === "DELETE") {
    return dispatch => {
      dispatch(apiStatusAsync(api.dontShowApiLoader() ? false : true, false, ""));
      axios
        .delete(api.apiEndPoint(), api.getHeaders())
        .then(res => {
          success(res, api, dispatch);
        })
        .catch(err => {
          error(err, api, dispatch);
        });
    };
  }
  return dispatch => {
    dispatch(apiStatusAsync(api.dontShowApiLoader() ? false : true, false, ""));
    axios
      .get(api.apiEndPoint(), api.getHeaders())
      .then(res => {
        success(res, api, dispatch);
      })
      .catch(err => {
        error(err, api, dispatch);
      });
  };
}
