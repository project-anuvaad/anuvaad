//Line Chart
import React from "react";
import { Line } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
let linePalette = window.palette;

/**
 * LineChart component
 */

const options = {
  scales: {
    xAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
      }
    ]
  },
  responsive: true,
  options: {
    responsive: true,

    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      boxWidth: 10
    }
  }
};

class LineChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trigger: ""
    };
  }

  // callforNewData(elems) {
  // 	console.log(elems[0]._datasetIndex + ', ' + elems[0]._index);
  // 	// this.setState({ data: null })
  //
  // }

  /**
   * Function to update the chart visualization
   */
  updateLineVisuals = () => {
    this.setState({
      trigger: true
    });
    this.props.pathName.history.push({
      pathName: "/dashboards",
      state: { trigger: this.state.trigger }
    });
  };

  manupulateData(chartData) {
    // let temp, tempdata;
    // temp = this.props.chartData;
    var tempdata = {
      labels: [],
      datasets: []
    };

    chartData.forEach((d, i) => {
      let colors = linePalette("cb-Custom1", chartData.length).map(function(
        hex
      ) {
        return "#" + hex;
      });
      let tempObj = {
        label: "",
        borderColor: colors[i],
        backgroundColor: colors[i],
        fill: false
      };

      let tempdataArr = [];
      let tempdatalabel = [],
        tempVal = "";
      tempObj.label = d.headerName;
      d.plots.forEach((d1, i) => {
        tempVal = NFormatterFun(d1.value, d1.symbol, "Unit");
        tempVal =
          typeof tempVal == "string"
            ? parseFloat(tempVal.replace(/,/g, ""))
            : tempVal;
        tempdataArr.push(tempVal);
        tempdatalabel.push(d1.name);
      });
      tempObj.data = tempdataArr;
      tempdata.labels = tempdatalabel;
      tempdata.datasets.push(tempObj);
    });
    return tempdata;
  }

  render() {
    let { chartData } = this.props;
    let data = this.manupulateData(chartData);

    /*
     * Function to get the chart label title
     */
    const getLineLabelFilter = elems => {
      if (localStorage.getItem("filterKey") && elems[0] !== undefined) {
        let index = elems[0]._datasetIndex;
        let selectedLabel = elems[0]._xScale.chart.data.datasets[index].label;
        // console.log("LineChart GetLabelFilter: "+elems[0]._xScale.chart.data.datasets[index].label);
        localStorage.setItem("label", selectedLabel);
        this.updateLineVisuals();
      } else {
        // console.log("Out!");
      }
    };

    if (data) {
      return (
        <Line
          height={this.props.dimensions.height}
          style={{ fill: "none" }}
          data={data}
          options={options}
          getElementAtEvent={elems => getLineLabelFilter(elems)}
        ></Line>
      );
    }
    return <div>Loading...</div>;
  }
}

export default LineChart;
