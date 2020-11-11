import React from "react";
import { Doughnut } from "react-chartjs-2";

/**
 * DoughnutChart component
 */

const data = {
  labels: ["Data 1", "Data 2", "Data 3"],
  datasets: [
    {
      data: [289, 58, 111],
      backgroundColor: ["#3CB44B", "#4364D8", "#42D4F4"],
      hoverBackgroundColor: ["#3CB44B", "#4364D8", "#42D4F4"],
      borderWidth: 0
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

class DoughnutChart extends React.Component {
  render() {
    return <Doughnut data={data} options={options} />;
  }
}

export default DoughnutChart;
