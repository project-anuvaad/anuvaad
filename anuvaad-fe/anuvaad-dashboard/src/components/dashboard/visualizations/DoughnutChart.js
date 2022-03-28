import React from "react";
import { Doughnut } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
import _ from "lodash";
let doughnutPalette = window.palette;

/**
 * DoughnutChart component
 */

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
        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
        var total = meta.total;
        var currentValue = dataset.data[tooltipItem.index];
        var percentage = parseFloat(((currentValue / total) * 100).toFixed(1));
        // if (dataset.dataSymbol[tooltipItem.index][0] == 'number' || dataset.dataSymbol[tooltipItem.index][1] == 'Unit') {
        currentValue = NFormatterFun(
          currentValue,
          dataset.dataSymbol[tooltipItem.index][0],
          dataset.dataSymbol[tooltipItem.index][1],
          true
        );
        // }
        return currentValue + " (" + percentage + "%)";
      },
      title: function(tooltipItem, data) {
        return data.labels[tooltipItem[0].index];
      }
    }
  }
};

class DoughnutChart extends React.Component {
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
  updateDoughNutVisuals = () => {
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
    var doughnutTempData = {
      labels: [],
      datasets: []
    };
    var doughnutTempDataSet = {
      label: "",
      data: [],
      dataSymbol: []
    };

    _.map(chartData, function(k, v) {
      var plots = k["plots"];
      for (var i = 0; i < plots.length; i++) {
        doughnutTempData.labels.push(plots[i]["name"]);
        //tempdataSet.data.push(NFormatterFun(plots[i]['value'], plots[i]['symbol'], this.props.GFilterData['Denomination']));
        doughnutTempDataSet.data.push(plots[i]["value"]);
        doughnutTempDataSet.dataSymbol.push([plots[i]["symbol"], "Unit"]);
      }
      // }.bind(this));
    });
    doughnutTempDataSet.backgroundColor = doughnutPalette(
      "cb-Custom1",
      doughnutTempDataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    doughnutTempDataSet.borderColor = doughnutPalette(
      "cb-Custom1",
      doughnutTempDataSet.data.length
    ).map(function(hex) {
      return "#" + hex;
    });
    doughnutTempData.datasets.push(doughnutTempDataSet);
    return doughnutTempData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);
    //     console.log("DoughnutChart chartData", chartData);
    // console.log("DoughnutChart _data", _data);

    /*
     * Function to get the chart label title
     */
    const getDoughnutLabelFilter = elems => {
      if (localStorage.getItem("filterKey") && elems[0] !== undefined) {
        let index = elems[0]._index;
        let selectedLabel = {
          labels: []
        };
        // let finalLabelArray = [];
        // let tempArray = [];
        selectedLabel.labels.push(elems[0]._chart.data.labels[index]);
        localStorage.setItem("label", selectedLabel.labels);
        this.updateDoughNutVisuals();
        // console.log("Doughnut GetLabelFilter: "+elems[0]._chart.data.labels[index]);
      } else {
        // console.log("Out!");
      }
    };

    if (_data) {
      return (
        <Doughnut
          height={this.props.dimensions.height}
          data={_data}
          options={options}
          onElementsClick={elems => getDoughnutLabelFilter(elems)}
        />
      );
    }
    return <div>Loading...</div>;
  }
}

export default DoughnutChart;
