import React from "react";
import { Pie } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
import _ from "lodash";
let piePalette = window.palette;

/**
 * PieChart component
 */

const pieChartOptions = {
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
  },
  tooltips: {
    callbacks: {
      label: function(tooltipItem, data) {
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
        var total = meta.total;
        var currentValue = dataset.data[tooltipItem.index];
        var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
        currentValue = NFormatterFun(
          currentValue,
          dataset.dataSymbol[tooltipItem.index][0],
          dataset.dataSymbol[tooltipItem.index][1],
          true
        );
        return currentValue + " (" + percentage + "%)";
      },
      title: function(tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      }
    }
  }
};

class PieChart extends React.Component {
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
  updatePieVisuals = () => {
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

  getData(chartData) {
    var pieChartTempData = {
      labels: [],
      datasets: []
    };
    var pieChartTempDataSet = {
      label: "",
      data: [],
      dataSymbol: []
    };

    _.map(chartData, function(k, v) {
      var plots = k["plots"];
      for (var i = 0; i < plots.length; i++) {
        pieChartTempData.labels.push(plots[i]["name"]);
        pieChartTempDataSet.data.push(plots[i]["value"]);
        pieChartTempDataSet.dataSymbol.push([plots[i]["symbol"], "Unit"]);
      }
    });

    pieChartTempDataSet.backgroundColor = piePalette(
      "tol",
      pieChartTempDataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    pieChartTempDataSet.borderColor = piePalette(
      "tol",
      pieChartTempDataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    pieChartTempData.datasets.push(pieChartTempDataSet);
    return pieChartTempData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);

    /*
     * Function to get the chart label title
     */
    const getPieLabelFilter = elems => {
      if (localStorage.getItem("filterKey") && elems[0] !== undefined) {
        let index = elems[0]._index;
        let selectedLabel = {
          labels: []
        };
        // let finalLabelArray = [];
        // let tempArray = [];
        selectedLabel.labels.push(elems[0]._chart.data.labels[index]);
        localStorage.setItem("label", selectedLabel.labels);
        this.updatePieVisuals();
        // console.log("PieChart GetLabelFilter: "+elems[0]._chart.data.labels[index]);
      } else {
        // console.log("Out!");
      }
    };

    if (_data) {
      return (
        <Pie
          height={this.props.dimensions.height}
          data={_data}
          options={pieChartOptions}
          getElementAtEvent={elems => getPieLabelFilter(elems)}
        />
      );
    }
    return <div>Loading...</div>;
  }
}

export default PieChart;
