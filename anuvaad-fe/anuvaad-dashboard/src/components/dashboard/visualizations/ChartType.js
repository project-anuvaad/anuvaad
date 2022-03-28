import React from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
// import TableChart from './TableChart';
import _ from "lodash";
import DoughnutChart from "./DoughnutChart";
import HorizontalBarChart from "./HorizontalBarChart";
import PolarArea from "./PolarArea";
import TableChart from "./TableChart";
import MetricVisual from "./MetricVisual";
import RadarChart from "./RadarChart";
import BubbleChart from "./BubbleChart";
import ScatterChart from "./ScatterChart";
// import TreeMap from "./TreeMap";
import WaterFall from "./WaterFall";
import SanKeyChart from "./SanKeyChart";
import MixedData from "./MixedData";
import AreaChartType from "./AreaChartType";
import StackedBarChart from "./StackedBarChart";
import MultiBarChart from "./MultiBarChart";
import MapVisual from "./MapVisual";
import DistrictVisual from "./DistrictVisual";
import CalendarHeatMap from "./CalendarHeatMap";
import D3TreeMap from "./D3TreeMap";
import { DashboardService } from "../../../services/dashboard.service";
import ExportChart from "../../../helpers/exportJsonToExcel";

/**
 * Component to genearte the required charts
 * as per the response from the API
 */

class ChartType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartsGData: {}
    };
  }

  componentDidMount() {
    // let intervalAPI;
    this.callAPI();
    // intervalAPI = setInterval(() => (this.callAPI()), 10000);
    // localStorage.setItem("intervalAPI", intervalAPI);
  }

  callAPI() {
    // if(localStorage.getItem("currentDashboard") === "/dashboards") {
    // console.log("Props: " + JSON.stringify(this.props));

    let code = _.chain(this.props)
      .get("chartData")
      .first()
      .get("id")
      .value();

    DashboardService.getData(code).then(
      response => {
        this.setState(prevState => ({
          ...prevState,
          chartsGData: {
            ...prevState.chartsGData,
            [code]: response.responseData
          }
        }));
      },
      error => {}
    );
  }

  render() {
    let chartKey = _.chain(this.props)
      .get("chartData")
      .first()
      .get("id")
      .value();

    let chartType = _.chain(this.props)
      .get("chartData")
      .first()
      .get("chartType")
      .toUpper()
      .value();

    let data = _.chain(this.state)
      .get("chartsGData")
      .get(chartKey)
      .get("data")
      .value();

    let filter = _.chain(this.props)
      .get("chartData")
      .first()
      .get("filter")
      .value();

    let deepFilter = _.chain(this.state)
      .get("chartsGData")
      .get(chartKey)
      .get("filter")
      .value();

    let drillDownId = _.chain(this.state)
      .get("chartsGData")
      .get(chartKey)
      .get("drillDownChartId")
      .value();

    // console.log("ChartTypes chartsGData", this.state.chartsGData);
    // console.log("ChartTypes chartKey", chartKey)
    // console.log("ChartTypes props", this.props);
    // console.log("ChartTypes data", data);
    // console.log("ChartDrillDownId: ", drillDownId);
    // console.log("DeepFilter: ", deepFilter);

    if (filter) {
      localStorage.setItem("filterKey", filter);
    } else if (deepFilter) {
      localStorage.setItem("filterKey", deepFilter);
    }

    if (data) {
      ExportChart.setAttribute(chartKey, data); 
      // var chartData = this.state.data.responseData;
      // this.state.data = null;
      switch (chartType) {
        case "PIE":
          return (
            <PieChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              pathName={this.props.pathName.pathProps}
            />
          );
        case "DONUT":
          return (
            <DoughnutChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              pathName={this.props.pathName.pathProps}
            />
          );
        case "LINE":
          return (
            <LineChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              pathName={this.props.pathName.pathProps}
            />
          );
        case "BAR":
          return (
            <BarChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              pathName={this.props.pathName.pathProps}
              drillDownId={drillDownId}
              filter={filter}
            />
          );
        case "MULTIBAR":
          return (
            <MultiBarChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "HORIZONTALBAR":
          return (
            <HorizontalBarChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              pathName={this.props.pathName.pathProps}
            />
          );
        case "INDIAMAP":
          return (
            <MapVisual
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              drillDownId={drillDownId}
              filter={filter}
              width={420}
              height={500}
            />
          );
        case "INDIADISTRICTMAP":
          return (
            <DistrictVisual
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              width={420}
              height={500}
            />
          );

        case "TREEMAP":
          return (
            <D3TreeMap
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              width={420}
              height={500}
            />
          );
        case "POLARAREA":
          return (
            <PolarArea
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "TABLE":
          return (
            <TableChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "METRICCOLLECTION":
          return (
            <MetricVisual
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        // {
        /*  case "TREEMAP":
          return (
            <TreeMap
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );*/
        // }
        case "RADAR":
          return (
            <RadarChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "BUBBLECHART":
          return (
            <BubbleChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "SCATTER":
          return (
            <ScatterChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "WATERFALL":
          return (
            <WaterFall
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "SANKEY":
          return (
            <SanKeyChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "MIXED":
          return (
            <MixedData
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "AREA":
          return (
            <AreaChartType
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
            />
          );
        case "STACKEDBAR":
          return (
            <StackedBarChart
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              pathName={this.props.pathName.pathProps}
            />
          );
        case "CALENDARHEATMAP":
          return (
            <CalendarHeatMap
              chartData={data}
              label={this.props.label}
              unit={this.state.unit}
              GFilterData={this.props.GFilterData}
              dimensions={this.props.dimensions}
              section={this.props.section}
              width={420}
              height={500}
            />
          );

        // case 'TABLE':
        //     return <TableChart chartData={data}
        //         chartKey={chartKey}
        //         chartParent={this.props.chartData}
        //         unit={this.state.unit}
        //         GFilterData={this.props.GFilterData}
        //         filters={this.props.filters}
        //         dimensions={this.props.dimensions}
        //         section={this.props.section}
        //         label={this.props.label}
        //         page={this.props.page}
        //     />
        default:
          return false;
      }
    }
    return <div> Loading... </div>;
  }
}

export default ChartType;
