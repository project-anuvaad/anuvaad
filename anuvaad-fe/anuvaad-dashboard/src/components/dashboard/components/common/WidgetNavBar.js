import React, { Component } from "react";
import * as moment from "moment";
import { DashboardService } from "../../../../services/dashboard.service";
import _ from "lodash";
import "file-saver";
import domtoimage from "dom-to-image";

/**
 * Widget Navbar Component
 * Holds all the widgets and drill throught filter labels
 */

class WidgetNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDateFilter: false,
      showCustomDateFilter: false,
      dashboardConfigData: [],
      selectedDate: moment().format("DD MMM YY"),
      selectedFilter: "Today",
      rangeSelected: "",
      startDate: "",
      endDate: "",
      trigger: "",
      selectedTab: "",
      tabsInitDataId: [],
      chartsGData: {},
      widgetData: []
    };
  }

  componentDidMount() {
    if (
      !localStorage.getItem("selectedFilter") &&
      !localStorage.getItem("selectedDate")
    ) {
      let thisMonthRange =
        moment()
          .startOf("month")
          .format("DD MMM") +
        " - " +
        moment()
          .endOf("month")
          .format("DD MMM");
      this.setState({
        selectedFilter: "This month",
        selectedDate: thisMonthRange
      });
    } else {
      this.setState({
        selectedFilter: localStorage.getItem("selectedFilter"),
        selectedDate: localStorage.getItem("selectedDate")
      });
    }

    if (localStorage.getItem("currentDashId")) {
      DashboardService.getConfig().then(
        response => {
          this.setState(prevState => ({
            ...prevState,
            dashboardConfigData: response.responseData
          }));
          if (!this.state.chartsGData.length) {
            setTimeout(() => this.getWidgets(), 800);
          }
        },
        error => {}
      );
    } else {
      setTimeout(
        () =>
          DashboardService.getConfig().then(
            response => {
              this.setState(prevState => ({
                ...prevState,
                dashboardConfigData: response.responseData
              }));
              if (!this.state.chartsGData.length) {
                setTimeout(() => this.getWidgets(), 800);
              }
            },
            error => {}
          ),
        1000
      );
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps !== undefined) {
      if (nextProps.history.location.state !== undefined) {
        if (nextProps.history.location.state !== null) {
          if (nextProps.history.location.state.trigger === true) {
            this.getWidgets();
          }
        }
      }
    }
  }

  /**
   * Function to get the chart data as per the dashboard selection
   */
  getChartData = code => {
    DashboardService.getData(code).then(
      response => {
        this.setState(
          prevState => ({
            ...prevState,
            chartsGData: {
              ...prevState.chartsGData,
              [code]: response.responseData
            }
          }),
          () => {
            // localStorage.setItem("chartData",JSON.stringify(this.state.chartsGData))
            // console.log("State: "+JSON.stringify(this.state.chartsGData))
            let chartDetails = JSON.stringify(this.state.chartsGData);
            chartDetails = JSON.parse(chartDetails);
            chartDetails = _.chain(chartDetails).map();
            chartDetails = JSON.stringify(chartDetails);
            chartDetails = JSON.parse(chartDetails);
            let chartData = [];
            chartDetails.map(details => chartData.push(details.data[0]));
            this.setState({
              widgetData: [...chartData]
            });
          }
        );
      },
      error => {}
    );
  };

  /**
   * Function to get the widgets data as per the dashboard selection
   */
  getWidgets = () => {
    let data = this.state.dashboardConfigData;
    let dashboardWidget = _.chain(data)
      .first()
      .get("widgetCharts")
      .groupBy("name")
      .value();
    let widgetArray = _.chain(dashboardWidget).map();
    widgetArray = JSON.stringify(widgetArray);
    widgetArray = JSON.parse(widgetArray);
    let id = [];
    widgetArray.map(code => id.push(code[0].id));
    id.map(code => this.getChartData(code));
  };

  filterImage = node => {
    return (
      node.id !== "downloadDashIcon" &&
      node.id !== "dropdownMenuButton" &&
      node.id !== "zoomIn" &&
      node.id !== "zoomOut" &&
      node.id !== "zoomInBtn" &&
      node.id !== "zoomOutBtn"
    );
  };

  /**
   * Function to update the chart visualization
   */
  updateVisuals = () => {
    this.setState({
      trigger: true
    });
    this.props.pathName.history.push({
      pathName: "/dashboards",
      state: { trigger: this.state.trigger }
    });
    setTimeout(() => {
      this.props.pathName.history.push({
        pathName: "/dashboards",
        state: { trigger: this.state.trigger }
      });
    }, 500);
  };

  render() {
    return (
      <nav className="navbar navbar-light col-md-12 col-lg-12 col-xl-12 detailNavHeight tabText detailNavBarbuiltBorder">
        <div className="row d-sm-flex d-md-flex d-lg-flex">
          {this.state.widgetData.map(data => (
            <div className="" key={data.headerName}>
              <p className="pl-4 mb-1 metricTextColor">{data.headerName}</p>
              {/*<p className="pl-4 mb-1 largeNum">{data.headerValue}</p>*/}
              {!data.isDecimal ? (
                <p className="pl-4 mb-1 largeNum">
                  {Math.round(data.headerValue)}
                </p>
              ) : (
                <p className="pl-4 mb-1 largeNum">{data.headerValue}</p>
              )}
            </div>
          ))}

          {localStorage.getItem("label") && localStorage.getItem("filterKey") && (
            <div
              className="moveRight"
              style={{ right: "15%", marginTop: "-0.8em" }}
            >
              <p className="" style={{ marginLeft: "-1em" }}>
                Filters Applied
              </p>
              <div className="row chipFilter">
                <p className="pl-2 pt-2 pr-3">
                  {localStorage.getItem("label")}
                </p>
                <p
                  className="pt-2 metricTextColor cursorStyleOne moveRight"
                  style={{ marginTop: "-3.5em" }}
                  onClick={() => {
                    this.updateVisuals();
                    localStorage.removeItem("label");
                  }}
                >
                  X
                </p>
              </div>
            </div>
          )}

          <img
            className="moveRight mt-3 cursorStyleOne mr-5 downloadDashIcon"
            src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw=="
            alt="download page"
            title="Download current dashboard"
            id="downloadDashIcon"
            onClick={() =>
              domtoimage
                .toBlob(
                  document.getElementById("root"),
                  { filter: this.filterImage },
                  { style: "transform:(scale(2,2))" }
                )
                .then(blob =>
                  window.saveAs(blob, localStorage.getItem("currentDashboard"))
                )
            }
          />
        </div>
      </nav>
    );
  }
}

export default WidgetNavBar;
