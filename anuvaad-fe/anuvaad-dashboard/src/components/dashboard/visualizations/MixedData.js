import React from "react";
import { Bar } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
// import _ from "lodash";
let palette = window.palette;

/**
 * MixedData component
 */

const plugins = [
  {
    afterDraw: (chartInstance, easing) => {
      // const ctx = chartInstance.chart.ctx;
      // ctx.fillText("This text drawn by a plugin", 100, 100);
    }
  }
];
const options = {
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
        // console.log(data)
        var dataset = data.datasets[tooltipItem.datasetIndex];
        var currentValue = dataset.data[tooltipItem.index];
        currentValue = NFormatterFun(
          currentValue,
          dataset.dataSymbol[tooltipItem.index][0],
          dataset.dataSymbol[tooltipItem.index][1],
          true
        );
        return currentValue;
      },
      title: function(tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      }
    }
  }
};

class MixedData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  getData(chartData) {
    var tempData = {
      labels: [],
      datasets: []
    };
    var tempdataSet = {
      label: "",
      type: "line",
      data: [],
      dataSymbol: []
    };
    var tempdataSetTwo = {
      label: "",
      type: "bar",
      data: [],
      dataSymbol: []
    };

    for (var i = 0; i < chartData.length; i++) {
      // Line Data
      if (i === 0) {
        tempdataSetTwo.label = chartData[i].headerName;
        for (var l = 0; l < chartData[i].plots.length; l++) {
          tempData.labels.push(chartData[i].plots[l]["name"]);
          tempdataSetTwo.data.push(chartData[i].plots[l]["value"]);
          tempdataSetTwo.dataSymbol.push([
            chartData[i].plots[l]["symbol"],
            "Unit"
          ]);
        }
      }
      // Bar Data
      if (i === 1) {
        tempdataSet.label = chartData[i].headerName;
        for (var j = 0; j < chartData[i].plots.length; j++) {
          tempdataSet.data.push(chartData[i].plots[j]["value"]);
          tempdataSet.dataSymbol.push([
            chartData[i].plots[j]["symbol"],
            "Unit"
          ]);
        }
      }
    }

    tempdataSet.backgroundColor = palette(
      "cb-Custom1",
      tempdataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    tempdataSet.borderColor = palette(
      "cb-Custom1",
      tempdataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    tempData.datasets.push(tempdataSetTwo);
    tempData.datasets.push(tempdataSet);
    return tempData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);
    if (_data) {
      return <Bar data={_data} options={options} plugins={plugins} />;
    }
    return <div>Loading...</div>;
  }
}

export default MixedData;
