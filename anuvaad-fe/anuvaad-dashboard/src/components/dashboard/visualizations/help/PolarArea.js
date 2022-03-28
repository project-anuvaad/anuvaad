import React from "react";
import { Polar } from "react-chartjs-2";

/**
 * Polar area component
 */

const data = {
  datasets: [
    {
      data: [18, 19, 5, 4, 16],
      backgroundColor: ["#3CB44B", "#4364D8", "#42D4F4", "#FABEBE", "#BFEF45"],
      label: "Dataset 1" // for legend
    }
  ],
  labels: ["Data 1", "Data 2", "Data 3", "Data 4", "Data 5"]
};

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
  }
};

class PolarArea extends React.Component {
  render() {
    return <Polar data={data} options={polarOptions} />;
  }
}

export default PolarArea;
