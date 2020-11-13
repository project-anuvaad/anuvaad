import React from "react";
import { Bubble } from "react-chartjs-2";
// import NFormatterFun from '../NumberFormaterFun';
import _ from "lodash";
let palette = window.palette;

/**
 * BubbleChart component
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
      ],
      xAxes: [
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
  // tooltips: {
  //   callbacks: {
  //     label: function(tooltipItem, data) {
  //       // console.log(data);
  //       var dataset = data.datasets[tooltipItem.datasetIndex];
  //       // var meta = dataset._meta[Object.keys(dataset._meta)[0]];
  //       // var total = meta.total;
  //       var currentValue = dataset.data[tooltipItem.index];
  //
  //       // var percentage = parseFloat((currentValue / total * 100).toFixed(1));
  //       // // if (dataset.dataSymbol[tooltipItem.index][0] == 'number' || dataset.dataSymbol[tooltipItem.index][1] == 'Unit') {
  //       // currentValue = NFormatterFun(currentValue, dataset.dataSymbol[tooltipItem.index][0], dataset.dataSymbol[tooltipItem.index][1], true)
  //       // }
  //       // return currentValue + ' (' + percentage + '%)';
  //       // console.log("Value: "+JSON.stringify(this.tempData))
  //       return JSON.stringify(currentValue);
  //     },
  //     title: function(tooltipItem, data) {
  //       return data.labels[tooltipItem[0].index];
  //     }
  //   }
  // }
};

class BubbleChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    // if (data[0]) {
    //   this.loadChart(data[0]);
    // }
  }

  getData(chartData) {
    let dataTransformed = [];
    let child = [];
    let bgColor = [];
    let brColor = [];

    bgColor.push(
      palette("cb-Custom1", chartData.length).map(function(hex) {
        return "#" + hex;
      })
    );

    brColor.push(
      palette("cb-Custom1", chartData.length).map(function(hex) {
        return "#" + hex;
      })
    );

    _.forEach(chartData, function(k, v) {
      var plots = k["plots"];

      for (var i = 0; i < plots.length; i++) {
        child.push({
          label: k.headerName,
          fill: false,
          lineTension: 0.1,
          backgroundColor: bgColor[0][v],
          borderColor: bgColor[0][v],
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [
            {
              x: plots[i]["xAxis"],
              y: plots[i]["yAxis"],
              r: plots[i]["zAxis"]
            }
          ]
        });
      }
    });

    dataTransformed.push({ labels: ["Data"], datasets: child });
    return dataTransformed[0];
  }

  render() {
    let { chartData } = this.props;
    // console.log("Bubble data: "+JSON.stringify(data))
    let data = this.getData(chartData);

    // data = JSON.stringify(data);
    // 	let intPie;
    // intPie = setInterval(() => (this.getData(chartData)), 10000);
    // localStorage.setItem("intPie", intPie);
    //     console.log("PieChart chartData", chartData);
    // console.log("PieChart _data", _data);
    // console.log("Data: " + JSON.stringify(data));
    if (data) {
      return (
        <Bubble
          height={this.props.dimensions.height}
          data={data}
          options={options}
        />
      );
    }
    return <div>Loading...</div>;
  }
}

export default BubbleChart;
