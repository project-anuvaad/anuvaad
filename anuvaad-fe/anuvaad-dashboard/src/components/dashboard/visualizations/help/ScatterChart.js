import React from "react";
import { Scatter } from "react-chartjs-2";

/**
 * ScatterChart component
 */

const data = {
  labels: ["Data 1"],
  datasets: [
    {
      label: "Dataset 1",
      fill: false,
      backgroundColor: "#2B98FF",
      pointBorderColor: "#2B98FF",
      pointBackgroundColor: "#fff",
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: "rgba(75,192,192,1)",
      pointHoverBorderColor: "rgba(220,220,220,1)",
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [
        { x: 61, y: 71 },
        { x: 52, y: 42 },
        { x: 83, y: 93 },
        { x: 84, y: 24 },
        { x: 55, y: 35 },
        { x: 56, y: 26 },
        { x: 47, y: 17 },
        { x: 68, y: 78 },
        { x: 59, y: 49 },
        { x: 88, y: 91 },
        { x: 89, y: 28 },
        { x: 57, y: 35 },
        { x: 56, y: 24 },
        { x: 42, y: 16 }
      ]
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

class ScatterChart extends React.Component {
  render() {
    return <Scatter data={data} options={options} />;
  }
}

export default ScatterChart;
