import React from "react";
import { Polar } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
import _ from "lodash";
let polarPalette = window.palette;

/**
 * Polar area component
 */

const polarOptions = {
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

class PolarArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }
  getData(chartData) {
    var polarTempData = {
      labels: [],
      datasets: []
    };
    var polarTempdataSet = {
      label: "",
      data: [],
      dataSymbol: []
    };

    _.map(chartData, function(k, v) {
      var plots = k["plots"];

      for (var i = 0; i < plots.length; i++) {
        polarTempData.labels.push(plots[i]["name"]);
        polarTempdataSet.data.push(plots[i]["value"]);
        polarTempdataSet.dataSymbol.push([plots[i]["symbol"], "Unit"]);
      }
    });

    polarTempdataSet.backgroundColor = polarPalette(
      "cb-Custom1",
      polarTempdataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    polarTempdataSet.borderColor = polarPalette(
      "cb-Custom1",
      polarTempdataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    polarTempData.datasets.push(polarTempdataSet);
    return polarTempData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);

    if (_data) {
      return (
        <Polar
          height={this.props.dimensions.height}
          data={_data}
          options={polarOptions}
        />
      );
    }
    return <div>Loading...</div>;
  }
}

export default PolarArea;
