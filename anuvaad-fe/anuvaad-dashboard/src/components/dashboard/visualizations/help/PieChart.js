import React from "react";
import { Pie } from "react-chartjs-2";

/**
 * PieChart component
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
  }
};

class PieChart extends React.Component {
  render() {
    return <Pie data={data} options={pieChartOptions} />;
  }
}

export default PieChart;
