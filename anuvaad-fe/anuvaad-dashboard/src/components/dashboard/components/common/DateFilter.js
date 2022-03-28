import React, { Component } from "react";
import * as moment from "moment";
import { DashboardService } from "../../../../services/dashboard.service";
import _ from "lodash";
import Datepicker from "../datePicker/Datepicker";

/**
 * Custom Date Filter component
 */

class DateFilter extends Component {
  container = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      showDateFilter: false,
      showCustomDateFilter: false,
      showDropDown: false,
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
      widgetData: [],
      dateListOne: [
        {
          date: [moment().startOf("isoWeek"), moment().endOf("isoWeek")],
          filter: "This week"
        },
        {
          date: [moment().startOf("month"), moment().endOf("month")],
          filter: "This month"
        },
        {
          date: [
            moment()
              .quarter(moment().quarter())
              .startOf("quarter"),
            moment()
              .quarter(moment().quarter())
              .endOf("quarter")
          ],
          filter: "This quarter"
        },
        {
          date: [moment().startOf("year"), moment().endOf("year")],
          filter: "This year"
        }
      ],
      dateListTwo: [
        {
          date: [
            moment()
              .subtract(1, "weeks")
              .startOf("isoWeek"),
            moment()
              .subtract(1, "weeks")
              .endOf("isoWeek")
          ],
          filter: "Last week"
        },
        {
          date: [
            moment()
              .subtract(1, "month")
              .startOf("month"),
            moment()
              .subtract(1, "month")
              .endOf("month")
          ],
          filter: "Last month"
        },
        {
          date: [
            moment()
              .quarter(moment().quarter())
              .subtract(1, "quarter")
              .startOf("quarter"),
            moment()
              .quarter(moment().quarter())
              .subtract(1, "quarter")
              .endOf("quarter")
          ],
          filter: "Last quarter"
        },
        {
          date: [
            moment()
              .subtract(1, "year")
              .startOf("year"),
            moment()
              .subtract(1, "year")
              .endOf("year")
          ],
          filter: "Last year"
        }
      ],
      dateListThree: [
        {
          date: [moment().subtract(6, "days"), moment()],
          filter: "Last 7 days"
        },
        {
          date: [moment().subtract(29, "days"), moment()],
          filter: "Last 30 days"
        },
        {
          date: [moment().subtract(3, "month"), moment()],
          filter: "Last 3 months"
        },
        {
          date: [moment().subtract(6, "month"), moment()],
          filter: "Last 6 months"
        }
      ],
      dateColumnOneHeader: [
        {
          date: [moment().startOf("day"), +moment().endOf("day")],
          filter: "Today"
        }
      ],
      dateColumnTwoHeader: [
        {
          date: [
            moment()
              .subtract(1, "days")
              .startOf("day"),
            moment()
              .subtract(1, "days")
              .endOf("day")
          ],
          filter: "Yesterday"
        }
      ]
    };

    this.showFilter = this.showFilter.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
    if (
      !localStorage.getItem("selectedFilter") &&
      !localStorage.getItem("selectedDate")
    ) {
      // let thisMonthRange =
      //   moment()
      //     .startOf("month")
      //     .format("DD MMM") +
      //   " - " +
      //   moment()
      //     .endOf("month")
      //     .format("DD MMM");
      let thisYearRange =
          moment().startOf("year").format("DD MMM") +
              " - " +
              moment().endOf("year")
                .format("DD MMM");
      this.setState({
        selectedFilter: "This year",
        selectedDate: thisYearRange
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
            },
            error => {}
          ),
        1000
      );
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log("Props: "+JSON.stringify(nextProps.pathName.pathName.history.location.state.trigger))
    if (nextProps !== undefined) {
      if (nextProps.pathName.pathName.history.location.state !== undefined) {
        if (nextProps.pathName.pathName.history.location.state !== null) {
          if (
            nextProps.pathName.pathName.history.location.state.trigger === true
          ) {
            this.getWidgets();
            this.setState({
              showDropDown: false
            });
            if (
              localStorage.getItem("selectedFilter") &&
              localStorage.getItem("selectedDate")
            ) {
              this.setState({
                selectedFilter: localStorage.getItem("selectedFilter"),
                selectedDate: localStorage.getItem("selectedDate")
              });
            }
          }
        } else {
          this.getWidgets();
          this.setState({
            showDropDown: false
          });
          if (
            localStorage.getItem("selectedFilter") &&
            localStorage.getItem("selectedDate")
          ) {
            this.setState({
              selectedFilter: localStorage.getItem("selectedFilter"),
              selectedDate: localStorage.getItem("selectedDate")
            });
          }
        }
      }
    }
  }

  /**
   * Function to get the chart data dynamically
   * as per the arguments passed
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
   * Function to update the chart visualization
   */
  updateVisuals = () => {
    this.setState({
      trigger: true
    });
    this.props.pathName.pathName.history.push({
      pathName: "/dashboards",
      state: { trigger: this.state.trigger }
    });
    this.setState({
      trigger: false
    });
    this.props.pathName.pathName.history.push({
      pathName: "/dashboards",
      state: { trigger: this.state.trigger }
    });
  };

  /**
   * Toggle function to show/hide the custom date filters
   */
  showFilter = () => {
    this.setState({
      showDateFilter: true,
      showDropDown: true
    });
  };

  /**
   * Function to close date dropdown
   * when the user clicks outside it
   */
  handleClickOutside = event => {
    if (
      this.container.current &&
      !this.container.current.contains(event.target)
    ) {
      this.setState({
        showDateFilter: false,
        showDropDown: false
      });
    }
  };

  /**
   * Function to get date selected from the custom date filter
   */
  async getDate(dateFilter) {
    await this.setState(
      {
        selectedFilter: dateFilter.filter,
        selectedDate:
          moment(dateFilter.date[0]._d).format("DD MMM") +
          " - " +
          moment(dateFilter.date[1]._d).format("DD MMM"),
        showDateFilter: false,
        showCustomDateFilter: false,
        startDate: dateFilter.date[0],
        endDate: dateFilter.date[1]
      },
      () => {
        localStorage.setItem("selectedFilter", this.state.selectedFilter);
        localStorage.setItem("selectedDate", this.state.selectedDate);
      }
    );
    await localStorage.setItem("startDate", moment(dateFilter.date[0]));
    await localStorage.setItem("endDate", moment(dateFilter.date[1]));
    this.updateVisuals();
  }

  /**
   * Function to show/hide the date range picker
   */
  getCustomDate = () => {
    this.setState({
      showCustomDateFilter: true
    });
  };

  /**
   * Function to load the data for the Widgets
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

  /**
   * Function to get the date range
   * from the date range picker
   */
  onDateChange = (e, l) => {
    if (e !== null && l !== null) {
      let finalRange =
        moment(e).format("DD MMM") + " - " + moment(l).format("DD MMM");
      this.setState(
        {
          selectedFilter: "Custom",
          selectedDate: finalRange
        },
        () => {
          localStorage.setItem("selectedFilter", this.state.selectedFilter);
          localStorage.setItem("selectedDate", this.state.selectedDate);
        }
      );
      localStorage.setItem("startDate", moment(e));
      localStorage.setItem("endDate", moment(l));
      if (
        localStorage.getItem("startDate") !== "Invalid date" &&
        localStorage.getItem("endDate") !== "Invalid date"
      ) {
        this.setState({ showCustomDateFilter: false, showDateFilter: false });
        this.updateVisuals();
        this.getWidgets();
        setTimeout(() => this.updateVisuals(), 1000);
      }
    }
  };

  render() {
    return (
      <div className="dateFilterTextColor" style={{ marginTop: "0.3em" }}>
        {!this.state.showDateFilter && (
          <div className="row d-md-flex d-lg-flex">
            <div className="vl"></div>
            <div
              className="pl-3 pr-4 customPadding cursorStyleOne"
              onClick={this.showFilter}
            >
              <h5 className="">{this.state.selectedFilter}</h5>
              <p className="">{this.state.selectedDate}</p>
            </div>
          </div>
        )}
        {this.state.showDateFilter && (
          <div className="row d-sm-flex d-md-flex d-lg-flex">
            <div className="vl d-sm-flex d-md-flex d-lg-flex"></div>

            <div
              className="pl-3 pr-4 d-sm-flex d-md-block d-lg-block d-xl-block customPadding cursorStyleOne"
              onClick={this.showFilter}
            >
              <h5 className="">{this.state.selectedFilter}</h5>
              <p className="">{this.state.selectedDate}</p>
            </div>
          </div>
        )}
        {this.state.showDateFilter && this.state.showDropDown && (
          <div className="container" ref={this.container}>
            {!this.state.showCustomDateFilter && (
              <div className="dateDropDown">
                <h6 className="pl-3 font-weight-bold mt-4">Presets</h6>
                <div className="row ml-3 mb-1 customMargin mt-4">
                  <div className="">
                    {this.state.dateColumnOneHeader.map(dateFilter => (
                      <p
                        id="dateList"
                        key={dateFilter.filter}
                        className={
                          this.state.selectedFilter === dateFilter.filter
                            ? "activeFilter p-1"
                            : "p-1"
                        }
                        onClick={() => this.getDate(dateFilter)}
                      >
                        {dateFilter.filter}
                      </p>
                    ))}
                  </div>
                  <div className="ml-5 pl-2 customMargin">
                    {this.state.dateColumnTwoHeader.map(dateFilter => (
                      <p
                        id="dateList"
                        key={dateFilter.filter}
                        className={
                          this.state.selectedFilter === dateFilter.filter
                            ? "activeFilter p-1"
                            : "p-1"
                        }
                        onClick={() => this.getDate(dateFilter)}
                      >
                        {dateFilter.filter}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="row ml-3 customMargin">
                  <div className="">
                    {this.state.dateListOne.map(dateFilter => (
                      <p
                        id="dateList"
                        key={dateFilter.filter}
                        className={
                          this.state.selectedFilter === dateFilter.filter
                            ? "activeFilter p-1"
                            : "p-1"
                        }
                        onClick={() => this.getDate(dateFilter)}
                      >
                        {dateFilter.filter}
                      </p>
                    ))}
                  </div>
                  <div className="ml-4 customMargin">
                    {this.state.dateListTwo.map(dateFilter => (
                      <p
                        id="dateList"
                        key={dateFilter.filter}
                        className={
                          this.state.selectedFilter === dateFilter.filter
                            ? "activeFilter p-1"
                            : "p-1"
                        }
                        onClick={() => this.getDate(dateFilter)}
                      >
                        {dateFilter.filter}
                      </p>
                    ))}
                  </div>
                  <div className="ml-4 customMargin">
                    {this.state.dateListThree.map(dateFilter => (
                      <p
                        id="dateList"
                        key={dateFilter.filter}
                        className={
                          this.state.selectedFilter === dateFilter.filter
                            ? "activeFilter p-1"
                            : "p-1"
                        }
                        onClick={() => this.getDate(dateFilter)}
                      >
                        {dateFilter.filter}
                      </p>
                    ))}
                  </div>
                  <div className="row moveRight col-md-9 ml-5 customMargin">
                    <Datepicker
                      pathName={this.props}
                      history={this.props.history}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default DateFilter;
