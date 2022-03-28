import React from "react";
import { Radar } from "react-chartjs-2";

/**
 * Radar chart component
 */
const data = {
  labels: [
    "Data 1",
    "Data 2",
    "Data 3",
    "Data 4",
    "Data 5",
    "Data 6",
    "Data 7"
  ],
  datasets: [
    {
      label: "Dataset 1",
      backgroundColor: "#4364D8",
      borderColor: "#4364D8",
      pointBackgroundColor: "rgba(179,181,198,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(179,181,198,1)",
      data: [68, 55, 88, 83, 58, 65, 42]
    },
    {
      label: "Dataset 2",
      backgroundColor: "#42D4F4",
      borderColor: "#42D4F4",
      pointBackgroundColor: "rgba(255,99,132,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(255,99,132,1)",
      data: [38, 44, 36, 15, 98, 26, 99]
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

class RadarChart extends React.Component {
  render() {
    return <Radar data={data} options={options} />;
  }
}

export default RadarChart;
