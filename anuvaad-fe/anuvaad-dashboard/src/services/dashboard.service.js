import { APIS, APP, LANG } from "../constants";
import { authHeader } from "../helpers/authHeader";
import * as moment from "moment";

export const DashboardService = {
  getConfig,
  getData
};

let sDate,
  eDate,
  labelFilter,
  selectedStateFilter,
  key,
  customUnitFilterKey,
  customCountryFilterKey,
  customThirdFilterKey;
let customUnitFilterLabel = [];
let customCountryFilterLabel = [];
let customThirdFilterLabel = [];

function getConfig() {
  const requestOptions = {
    method: APP.REQUEST.GET,
    headers: authHeader()
  };
  return fetch(
    process.env.REACT_APP_API_URL +
      APIS.MULTIPLEDASHBOARD.GETCONFIG +
      localStorage.getItem("currentDashId"),
    requestOptions
  ).then(handleResponse);
}

function getData(code) {
  labelFilter = localStorage.getItem("label");
  selectedStateFilter = localStorage.getItem("selectedState");
  customUnitFilterLabel = [];
  customUnitFilterLabel.push(
    localStorage.getItem("customFiltersConfigUnitFilter")
  );
  customUnitFilterLabel = Array.from(new Set(customUnitFilterLabel));
  customUnitFilterKey = localStorage.getItem("customFiltersConfigUnitKey");

  customCountryFilterLabel = [];
  customCountryFilterLabel.push(
    localStorage.getItem("customFiltersConfigCountryFilter")
  );
  customCountryFilterLabel = Array.from(new Set(customCountryFilterLabel));
  customCountryFilterKey = localStorage.getItem(
    "customFiltersConfigCountryKey"
  );

  customThirdFilterLabel = [];
  customThirdFilterLabel.push(
    localStorage.getItem("customFiltersConfigThirdFilter")
  );
  customThirdFilterLabel = Array.from(new Set(customThirdFilterLabel));
  customThirdFilterKey = localStorage.getItem("customFiltersConfigThirdKey");

  key = localStorage.getItem("filterKey");
  sDate = localStorage.getItem("startDate");
  eDate = localStorage.getItem("endDate");
  let reqObj;

  if (
    customUnitFilterLabel[0] === "All Units" ||
    customUnitFilterLabel[0] === "All"
  ) {
    customUnitFilterLabel = null;
    // customUnitFilterLabel = [];
  }

  // if (customUnitFilterLabel[0] === "All") {
  //   customUnitFilterLabel = null;
  //   // customUnitFilterLabel = [];
  // }

  if (customCountryFilterLabel[0] === "All") {
    customCountryFilterLabel = null;
    // customCountryFilterLabel = [];
  }

  if (customThirdFilterLabel[0] === "All") {
    customThirdFilterLabel = null;
    // customThirdFilterLabel = [];
  }

  if (selectedStateFilter === "All") {
    localStorage.removeItem("selectedState");
  }

  if (labelFilter && sDate && eDate) {
    sDate = moment(sDate);
    eDate = moment(eDate);
    let startDate = Number(sDate);
    let endDate = Number(eDate);
    let duration = { startDate: startDate, endDate: endDate };
    // console.log("Duration: "+JSON.stringify(duration));
    // console.log("1");
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: { [key]: labelFilter },
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: duration
      }
    };
  } else if (labelFilter) {
    let startRange = moment().startOf("year");
    let endRange = moment().endOf("year");
    startRange = Number(startRange);
    endRange = Number(endRange);
    // let thisMonth = { startDate: startRange, endDate: endRange };
    let thisYear = { startDate: startRange, endDate: endRange };
    // console.log("2");
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: { [key]: labelFilter },
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: thisYear
      }
    };
  } else if (
    !customUnitFilterLabel &&
    !customCountryFilterLabel &&
    !customThirdFilterLabel &&
    selectedStateFilter &&
    selectedStateFilter !== "All" &&
    sDate &&
    eDate
  ) {
    sDate = moment(sDate);
    eDate = moment(eDate);
    let startDate = Number(sDate);
    let endDate = Number(eDate);
    let duration = { startDate: startDate, endDate: endDate };
    // console.log("Duration: "+JSON.stringify(duration));
    // console.log("3");
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: { [key]: selectedStateFilter },
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: duration
      }
    };
  } else if (
    !customUnitFilterLabel &&
    !customCountryFilterLabel &&
    !customThirdFilterLabel &&
    selectedStateFilter &&
    selectedStateFilter !== "All"
  ) {
    let startRange = moment().startOf("year");
    let endRange = moment().endOf("year");
    startRange = Number(startRange);
    endRange = Number(endRange);
    // let thisMonth = { startDate: startRange, endDate: endRange };
    let thisYear = { startDate: startRange, endDate: endRange };
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    // console.log("4");
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: { [key]: selectedStateFilter },
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: thisYear
      }
    };
  } else if (customUnitFilterKey && customUnitFilterLabel && sDate && eDate) {
    sDate = moment(sDate);
    eDate = moment(eDate);
    let startDate = Number(sDate);
    let endDate = Number(eDate);
    let duration = { startDate: startDate, endDate: endDate };

    // console.log("Duration: "+JSON.stringify(duration));
    if (
      customCountryFilterKey &&
      customCountryFilterLabel &&
      !customThirdFilterKey &&
      !customThirdFilterLabel
    ) {
      let filterUnits = {
        [customUnitFilterKey]: customUnitFilterLabel,
        [customCountryFilterKey]: customCountryFilterLabel
      };
      // console.log("5");
      reqObj = {
        RequestInfo: {
          authToken: "null"
        },
        headers: {
          tenantId: "null"
        },

        aggregationRequestDto: {
          dashboardId: localStorage.getItem("currentDashId"),
          visualizationType: "METRIC",
          visualizationCode: code,
          queryType: "",
          filters: filterUnits,
          moduleLevel: "",
          aggregationFactors: null,
          requestDate: duration
        }
      };
    } else if (customThirdFilterKey && customThirdFilterLabel) {
      let filterUnits;
      if (customCountryFilterKey && customCountryFilterLabel) {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel,
          [customThirdFilterKey]: customThirdFilterLabel
        };
      } else if (
        customCountryFilterKey &&
        customCountryFilterLabel &&
        selectedStateFilter &&
        selectedStateFilter !== "All"
      ) {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel,
          [customThirdFilterKey]: customThirdFilterLabel,
          [key]: selectedStateFilter
        };
      } else if (selectedStateFilter && selectedStateFilter !== "All") {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customThirdFilterKey]: customThirdFilterLabel,
          [key]: selectedStateFilter
        };
      } else {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customThirdFilterKey]: customThirdFilterLabel
        };
      }
      // console.log("6");
      reqObj = {
        RequestInfo: {
          authToken: "null"
        },
        headers: {
          tenantId: "null"
        },

        aggregationRequestDto: {
          dashboardId: localStorage.getItem("currentDashId"),
          visualizationType: "METRIC",
          visualizationCode: code,
          queryType: "",
          filters: filterUnits,
          moduleLevel: "",
          aggregationFactors: null,
          requestDate: duration
        }
      };
    } else {
      let filterUnits;
      if (customCountryFilterKey && customCountryFilterLabel) {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel
        };
      } else if (
        customCountryFilterKey &&
        customCountryFilterLabel &&
        selectedStateFilter &&
        selectedStateFilter !== "All"
      ) {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel,
          [key]: selectedStateFilter
        };
      } else if (selectedStateFilter && selectedStateFilter !== "All") {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [key]: selectedStateFilter
        };
      } else {
        filterUnits = { [customUnitFilterKey]: customUnitFilterLabel };
      }
      // console.log("7");
      reqObj = {
        RequestInfo: {
          authToken: "null"
        },
        headers: {
          tenantId: "null"
        },

        aggregationRequestDto: {
          dashboardId: localStorage.getItem("currentDashId"),
          visualizationType: "METRIC",
          visualizationCode: code,
          queryType: "",
          filters: filterUnits,
          moduleLevel: "",
          aggregationFactors: null,
          requestDate: duration
        }
      };
    }
  } else if (customUnitFilterKey && customUnitFilterLabel) {
    let startRange = moment().startOf("year");
    let endRange = moment().endOf("year");
    startRange = Number(startRange);
    endRange = Number(endRange);
    // let thisMonth = { startDate: startRange, endDate: endRange };
    let thisYear = { startDate: startRange, endDate: endRange };
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    if (
      customCountryFilterKey &&
      customCountryFilterLabel &&
      !customThirdFilterKey &&
      !customThirdFilterLabel
    ) {
      let filterUnits = {
        [customUnitFilterKey]: customUnitFilterLabel,
        [customCountryFilterKey]: customCountryFilterLabel
      };
      // console.log("8");
      reqObj = {
        RequestInfo: {
          authToken: "null"
        },
        headers: {
          tenantId: "null"
        },

        aggregationRequestDto: {
          dashboardId: localStorage.getItem("currentDashId"),
          visualizationType: "METRIC",
          visualizationCode: code,
          queryType: "",
          filters: filterUnits,
          moduleLevel: "",
          aggregationFactors: null,
          requestDate: thisYear
        }
      };
    } else if (customCountryFilterKey && customCountryFilterLabel) {
      let filterUnits;
      if (customThirdFilterKey && customThirdFilterLabel) {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel,
          [customThirdFilterKey]: customThirdFilterLabel
        };
      } else if (selectedStateFilter && selectedStateFilter !== "All") {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel,
          [key]: selectedStateFilter
        };
      } else {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customCountryFilterKey]: customCountryFilterLabel
        };
      }

      // console.log("9");
      reqObj = {
        RequestInfo: {
          authToken: "null"
        },
        headers: {
          tenantId: "null"
        },

        aggregationRequestDto: {
          dashboardId: localStorage.getItem("currentDashId"),
          visualizationType: "METRIC",
          visualizationCode: code,
          queryType: "",
          filters: filterUnits,
          moduleLevel: "",
          aggregationFactors: null,
          requestDate: thisYear
        }
      };
    } else {
      let filterUnits;
      if (customThirdFilterKey && customThirdFilterLabel) {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [customThirdFilterKey]: customThirdFilterLabel
        };
      } else if (selectedStateFilter && selectedStateFilter !== "All") {
        filterUnits = {
          [customUnitFilterKey]: customUnitFilterLabel,
          [key]: selectedStateFilter
        };
      } else {
        filterUnits = { [customUnitFilterKey]: customUnitFilterLabel };
      }
      // console.log("10");
      reqObj = {
        RequestInfo: {
          authToken: "null"
        },
        headers: {
          tenantId: "null"
        },

        aggregationRequestDto: {
          dashboardId: localStorage.getItem("currentDashId"),
          visualizationType: "METRIC",
          visualizationCode: code,
          queryType: "",
          filters: filterUnits,
          moduleLevel: "",
          aggregationFactors: null,
          requestDate: thisYear
        }
      };
    }
  } else if (
    customCountryFilterKey &&
    customCountryFilterLabel &&
    sDate &&
    eDate
  ) {
    sDate = moment(sDate);
    eDate = moment(eDate);
    let startDate = Number(sDate);
    let endDate = Number(eDate);
    let duration = { startDate: startDate, endDate: endDate };
    // console.log("Duration: "+JSON.stringify(duration));
    let filterUnits;
    if (customThirdFilterKey && customThirdFilterLabel) {
      filterUnits = {
        [customCountryFilterKey]: customCountryFilterLabel,
        [customThirdFilterKey]: customThirdFilterLabel
      };
    } else if (selectedStateFilter && selectedStateFilter !== "All") {
      filterUnits = {
        [customCountryFilterKey]: customCountryFilterLabel,
        [key]: selectedStateFilter
      };
    } else {
      filterUnits = { [customCountryFilterKey]: customCountryFilterLabel };
    }
    // console.log("11");
    // let filterUnits = { [customCountryFilterKey]: customCountryFilterKey };
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: filterUnits,
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: duration
      }
    };
  } else if (customCountryFilterKey && customCountryFilterLabel) {
    let startRange = moment().startOf("year");
    let endRange = moment().endOf("year");
    startRange = Number(startRange);
    endRange = Number(endRange);
    // let thisMonth = { startDate: startRange, endDate: endRange };
    let thisYear = { startDate: startRange, endDate: endRange };
    let filterUnits;
    if (customThirdFilterKey && customThirdFilterLabel) {
      filterUnits = {
        [customCountryFilterKey]: customCountryFilterLabel,
        [customThirdFilterKey]: customThirdFilterLabel
      };
    } else if (selectedStateFilter && selectedStateFilter !== "All") {
      filterUnits = {
        [customCountryFilterKey]: customCountryFilterLabel,
        [key]: selectedStateFilter
      };
    } else {
      filterUnits = { [customCountryFilterKey]: customCountryFilterLabel };
    }
    // console.log("12");
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: filterUnits,
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: thisYear
      }
    };
  } else if (customThirdFilterKey && customThirdFilterLabel && sDate && eDate) {
    sDate = moment(sDate);
    eDate = moment(eDate);
    let startDate = Number(sDate);
    let endDate = Number(eDate);
    let duration = { startDate: startDate, endDate: endDate };
    // console.log("Duration: "+JSON.stringify(duration));
    let filterUnits;
    if (selectedStateFilter && selectedStateFilter !== "All") {
      filterUnits = {
        [customThirdFilterKey]: customThirdFilterLabel,
        [key]: selectedStateFilter
      };
    } else {
      filterUnits = { [customThirdFilterKey]: customThirdFilterLabel };
    }
    // console.log("13");
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: filterUnits,
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: duration
      }
    };
  } else if (customThirdFilterKey && customThirdFilterLabel) {
    let startRange = moment().startOf("year");
    let endRange = moment().endOf("year");
    startRange = Number(startRange);
    endRange = Number(endRange);
    // let thisMonth = { startDate: startRange, endDate: endRange };
    let thisYear = { startDate: startRange, endDate: endRange };
    let filterUnits;
    if (selectedStateFilter && selectedStateFilter !== "All") {
      filterUnits = {
        [customThirdFilterKey]: customThirdFilterLabel,
        [key]: selectedStateFilter
      };
    } else {
      filterUnits = { [customThirdFilterKey]: customThirdFilterLabel };
    }
    // console.log("14");
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: filterUnits,
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: thisYear
      }
    };
  } else if (sDate && eDate) {
    sDate = moment(sDate);
    eDate = moment(eDate);
    let startDate = Number(sDate);
    let endDate = Number(eDate);
    let duration = { startDate: startDate, endDate: endDate };
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    let filterUnits;
    if (selectedStateFilter && selectedStateFilter !== "All") {
      filterUnits = { [key]: selectedStateFilter };
    } else {
      filterUnits = {};
    }
    // console.log("15");
    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: filterUnits,
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: duration
      }
    };
  } else {
    let startRange = moment().startOf("year");
    let endRange = moment().endOf("year");
    startRange = Number(startRange);
    endRange = Number(endRange);
    // let thisMonth = { startDate: startRange, endDate: endRange };
    let thisYear = { startDate: startRange, endDate: endRange };
    // console.log("thisMonth: "+JSON.stringify(thisMonth));
    let filterUnits;
    if (
      selectedStateFilter &&
      customUnitFilterLabel !== "All" &&
      customCountryFilterLabel !== "All" &&
      customThirdFilterLabel !== "All" &&
      selectedStateFilter !== "All"
    ) {
      filterUnits = { [key]: selectedStateFilter };
    } else {
      filterUnits = {};
    }

    // console.log("16");

    reqObj = {
      RequestInfo: {
        authToken: "null"
      },
      headers: {
        tenantId: "null"
      },

      aggregationRequestDto: {
        dashboardId: localStorage.getItem("currentDashId"),
        visualizationType: "METRIC",
        visualizationCode: code,
        queryType: "",
        filters: filterUnits,
        moduleLevel: "",
        aggregationFactors: null,
        requestDate: thisYear
      }
    };
  }

  const requestOptions = {
    method: APP.REQUEST.POST,
    body: JSON.stringify(reqObj),
    headers: authHeader()
  };
  return fetch(
    process.env.REACT_APP_API_URL + APIS.MULTIPLEDASHBOARD.GETCHART,
    requestOptions
  ).then(handleResponse);
}

function handleResponse(response) {
  return response.text().then(text => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error =
        LANG.APIERROR || (data && data.message) || response.statusText;
      return Promise.reject(new Error(error));
    }
    return data;
  });
}
