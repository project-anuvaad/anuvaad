import React from "react";
import { HorizontalBar } from "react-chartjs-2";

/**
 * HorizontalBarChart component
 */

const data = {
  labels: ["Data 1", "Data 2", "Data 3", "Data 4", "Data 5"],
  datasets: [
    {
      label: "Dataset 1",
      backgroundColor: "#2B98FF",
      borderWidth: 1,
      data: [80, 75, 70, 65, 60, 55]
    }
  ]
};

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          beginAtZero: true
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
      }
    ]
  },
  responsive: true,
  options: {
    responsive: true,
    maintainAspectRatio: true
  },
  legend: {
    display: true,
    position: "bottom",
    labels: {
      boxWidth: 10
    }
  }
};

class HorizontalBarChart extends React.Component {
  render() {
    return (
      <HorizontalBar
        className="cursorStyleOne"
        style={{ fill: "none" }}
        data={data}
        options={options}
      ></HorizontalBar>
    );
  }
}

export default HorizontalBarChart;
