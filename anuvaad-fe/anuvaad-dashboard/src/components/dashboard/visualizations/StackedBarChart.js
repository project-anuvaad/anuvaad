import React from "react";
import { Bar } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
let stackedBarPalette = window.palette;

/**
 * Stacked BarChart component
 */

const options = {
  scales: {
    xAxes: [
      {
        stacked: true,
        gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
      }
    ],
    yAxes: [
      {
        stacked: true
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
          stacked: true,
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
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var label = data.datasets[tooltipItem.datasetIndex].label;
        var currentValue = dataset.data[tooltipItem.index];
        localStorage.setItem("label", label);
        return label + ": " + currentValue;
      }
    }
  }
};

class StackedBarChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      trigger: ""
    };
  }

  /**
   * Function to update the chart visualization
   */
  updateStackedBarVisuals = () => {
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

  manupulateData(chartData) {
    var stackedBarTempData = {
      labels: [],
      datasets: []
    };
    let colors = stackedBarPalette("cb-Custom1", chartData.length).map(function(
      hex
    ) {
      return "#" + hex;
    });
    chartData.forEach((d, i) => {
      let stackedBarTempObj = {
        label: "",
        borderColor: colors[i],
        backgroundColor: colors[i],
        fill: false
      };
      let stackedbarTempdataArr = [];
      let stackedbartempdatalabel = [],
        tempVal = "";
      // let val = NFormatterFun(_.get(d,'headerValue.value'), _.get(d,'headerValue.symbol'), this.props.GFilterData['Denomination'])
      // tempObj.label = d.headerName + " : " + val;
      stackedBarTempObj.label = d.headerName;
      d.plots.forEach((d1, i) => {
        tempVal = NFormatterFun(d1.value, d1.symbol, "Unit");
        tempVal =
          typeof tempVal == "string"
            ? parseFloat(tempVal.replace(/,/g, ""))
            : tempVal;
        stackedbarTempdataArr.push(tempVal);
        stackedbartempdatalabel.push(d1.name);
      });
      stackedBarTempObj.data = stackedbarTempdataArr;
      stackedBarTempData.labels = stackedbartempdatalabel;
      stackedBarTempData.datasets.push(stackedBarTempObj);
    });
    return stackedBarTempData;
  }

  render() {
    let { chartData } = this.props;
    let data = this.manupulateData(chartData);

    /*
     * Function to get the chart label title
     */
    const getStackedBarLabelFilter = elems => {
      if (localStorage.getItem("filterKey") && elems[0] !== undefined) {
        let selectedLabel = {
          labels: []
        };
        // let finalLabelArray = [];
        selectedLabel.labels.push(localStorage.getItem("label"));
        this.updateStackedBarVisuals();
      } else {
        // console.log("Out!");
      }
    };

    if (data) {
      return (
        <Bar
          height={this.props.dimensions.height}
          style={{ fill: "none" }}
          data={data}
          options={options}
          onElementsClick={elems => getStackedBarLabelFilter(elems)}
        ></Bar>
      );
    }
    return <div>Loading...</div>;
  }
}

export default StackedBarChart;
