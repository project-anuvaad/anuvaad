import React from "react";
import { Bar } from "react-chartjs-2";

/**
 * MixedData component
 */

const plugins = [
  {
    afterDraw: (chartInstance, easing) => {}
  }
];

const data = {
  labels: ["Data 1", "Data 2", "Data 3", "Data 4", "Data 5"],
  datasets: [
    {
      label: "Dataset 1",
      backgroundColor: "#2B98FF",
      type: "bar",
      borderWidth: 1,
      data: [80, 85, 70, 75, 85, 75]
    },
    {
      label: "Dataset 2",
      type: "line",
      borderColor: "#2B98FF",
      borderWidth: 1,
      data: [80, 85, 70, 75, 85, 75]
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

class MixedData extends React.Component {
  render() {
    return <Bar data={data} options={options} plugins={plugins} />;
  }
}

export default MixedData;
