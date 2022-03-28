import { APIS, APP, LANG } from "../constants";
import { authHeader } from "../helpers/authHeader";

export const MultipleDash = {
  getConfig
};


function getConfig() {
  const requestOptions = {
    method: APP.REQUEST.GET,
    headers: authHeader()
  };
  return fetch(
    process.env.REACT_APP_API_URL + APIS.PROFILE.GETPROFILE,
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = LANG.APIERROR || (data && data.message) || response.statusText;
      return Promise.reject(new Error(error));
    }
    return data;
  });
}
