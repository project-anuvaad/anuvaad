import React, { Component } from "react";
import BrandNavBar from "./components/common/BrandNavBar";
import HeaderNavBar from "./components/common/HeaderNavBar";
import WidgetNavBar from "./components/common/WidgetNavBar";
import FilterNavBar from "./components/common/FilterNavBar";
import PropTypes from "prop-types";
import PageLayout from "./components/common/PageLayout";
import { DashboardService } from "../../services/dashboard.service";
import _ from "lodash";

/**
 * Dashboard component
 */

class Dashboard extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      dashboardConfigData: [],
      selectedTab: "",
      trigger: false,
      colorTrigger: true
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (localStorage.getItem("currentDashId")) {
      DashboardService.getConfig().then(
        response => {
          this.setState(
            prevState => ({
              ...prevState,
              dashboardConfigData: response.responseData
            }),
            () =>
              localStorage.setItem(
                "customFilters",
                JSON.stringify(this.state.dashboardConfigData[0].filters)
              )
          );
        },
        error => {}
      );
    } else {
      setTimeout(
        () =>
          DashboardService.getConfig().then(
            response => {
              this.setState(
                prevState => ({
                  ...prevState,
                  dashboardConfigData: response.responseData
                }),
                () =>
                  localStorage.setItem(
                    "customFilters",
                    JSON.stringify(this.state.dashboardConfigData[0].filters)
                  )
              );
            },
            error => {}
          ),
        500
      );
    }
  }

  componentWillUnmount() {
    localStorage.removeItem("label");
    localStorage.removeItem("filterKey");
    localStorage.removeItem("customFilters");
    localStorage.removeItem("customFiltersConfigUnitKey");
    localStorage.removeItem("customFiltersConfigUnitFilter");
    localStorage.removeItem("customFiltersConfigCountryKey");
    localStorage.removeItem("customFiltersConfigCountryFilter");
    localStorage.removeItem("customFiltersConfigThirdFilter");
    localStorage.removeItem("customFiltersConfigThirdKey");
    this._isMounted = false;
  }

  UNSAFE_componentWillReceiveProps(prevProps) {
    if (prevProps.history.location.state) {
      if (prevProps.history.location.state.trigger === true) {
        this.setState({
          trigger: true
        });
        if (this.state.trigger) {
          this.setState({
            trigger: false
          });
        }
      }
    }
  }

  renderCharts = () => {
    let { dashboardConfigData } = this.state;
    let tabsInitData = _.chain(dashboardConfigData)
      .first()
      .get("visualizations")
      .groupBy("name")
      .value();
    return (
      <div>
        {_.map(tabsInitData, (k, v) => {
          return (
            <PageLayout
              key={v}
              chartRowData={k}
              row={k.row}
              pathName={this.props}
            />
          );
        })}
      </div>
    );
  };

  render() {
    return (
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 dashboardBG h-100 heightMin">
        <div className="row">
          <BrandNavBar />
          <HeaderNavBar pathName={this.props} history={this.props.history} />
          <FilterNavBar pathName={this.props} />
          <WidgetNavBar history={this.props.history} pathName={this.props} />
        </div>
        <div className="row tabText">
          <div className="col-md-12 mt-5">
            {!this.state.trigger &&
              this.state.dashboardConfigData &&
              this.state.dashboardConfigData.length>0 &&
              this.renderCharts()}
            {this.state.trigger &&
              this.state.dashboardConfigData &&
              this.state.dashboardConfigData.length &&
              this.renderCharts()}
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
