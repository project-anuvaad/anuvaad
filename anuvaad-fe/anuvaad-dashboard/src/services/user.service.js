import { APIS, APP, LANG } from "./../constants";
import { authHeader } from "../helpers/authHeader";

export const UserService = {
  login,
  logout,
};

function login(username, password) {
  const requestOptions = {
    method: APP.REQUEST.POST,
    headers: authHeader(),
    body: JSON.stringify({ username, password }),
  };

  return fetch(
    process.env.REACT_APP_API_URL + APIS.LOGIN.USERLOGIN,
    requestOptions
  ).then(handleResponse);
}

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("startDate");
  localStorage.removeItem("endDate");
  localStorage.removeItem("chartData");
  localStorage.removeItem("widgetArray");
  localStorage.removeItem("dashboardName");
  localStorage.removeItem("currentDashboard");
  localStorage.removeItem("currentTheme");
  localStorage.removeItem("currentDashId");
  localStorage.removeItem("selectedFilter");
  localStorage.removeItem("selectedDate");
  localStorage.removeItem("label");
  localStorage.removeItem("filterKey");
  localStorage.removeItem("customFilters");
  localStorage.removeItem("customFiltersConfigUnitKey");
  localStorage.removeItem("customFiltersConfigUnitFilter");
  localStorage.removeItem("customFiltersConfigCountryKey");
  localStorage.removeItem("customFiltersConfigCountryFilter");
  localStorage.removeItem("customFiltersConfigThirdKey");
  localStorage.removeItem("customFiltersConfigThirdFilter");
  localStorage.removeItem("language");
  localStorage.removeItem("selectedState");
  // let id = localStorage.getItem("interval");
  // let id2 = localStorage.getItem("intervalAPI");
  // let id3 = localStorage.getItem("intHorizontalBarChart");
  // let id4 = localStorage.getItem("intPie");
  // let id5 = localStorage.getItem("renderChartsint");
  // let id6 = localStorage.getItem("intLine");
  // clearInterval(id);
  // clearInterval(id2);
  // clearInterval(id3);
  // clearInterval(id4);
  // clearInterval(id5);
  // clearInterval(id6);
  // localStorage.removeItem("interval");
  // localStorage.removeItem("intervalAPI");
  // localStorage.removeItem("intHorizontalBarChart");
  // localStorage.removeItem("intPie");
  // localStorage.removeItem("renderChartsint");
  // localStorage.removeItem("intLine");
}

function handleResponse(response) {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        logout();
        // location.reload(true);
      }
      const error =
        LANG.APIERROR || (data && data.message) || response.statusText; //Ignoring server side error and using end user readable message
      return Promise.reject(new Error(error));
    }
    return data;
  });
}
