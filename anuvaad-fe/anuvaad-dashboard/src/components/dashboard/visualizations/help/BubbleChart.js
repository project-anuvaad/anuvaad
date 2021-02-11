import React from "react";
import { Bubble } from "react-chartjs-2";

/**
 * BubbleChart component
 */

const data = {
  labels: ["Data 1"],
  datasets: [
    {
      label: "Dataset 1",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#2B98FF",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [{ x: 5, y: 8, r: 6 }]
    },
    {
      label: "Dataset 2",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#3CB44B",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [{ x: 10, y: 15, r: 8 }]
    },
    {
      label: "Dataset 3",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#AAFFC3",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [{ x: 8, y: 10, r: 4 }]
    },
    {
      label: "Dataset 4",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#4364D8",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [{ x: 25, y: 18, r: 10 }]
    },
    {
      label: "Dataset 5",
      fill: false,
      lineTension: 0.1,
      backgroundColor: "#42D4F4",
      borderCapStyle: "butt",
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: "miter",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [{ x: 18, y: 15, r: 12 }]
    }
  ]
};

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
};

class BubbleChart extends React.Component {
  render() {
    return <Bubble data={data} options={options} />;
  }
}

export default BubbleChart;
