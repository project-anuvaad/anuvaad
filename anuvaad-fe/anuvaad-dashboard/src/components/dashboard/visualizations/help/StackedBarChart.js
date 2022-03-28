import React from "react";
import { Bar } from "react-chartjs-2";
let stackedBarPalette = window.palette;

/**
 * Stacked BarChart component
 */

const data = {
  labels: ["January", "February", "March", "April", "May", "June", "July"],
  datasets: [
    {
      label: "My First dataset",
      backgroundColor: "#2B98FF",
      borderWidth: 1,
      data: [65, 59, 80, 81, 56, 55, 40]
    }
  ]
};

const options = {
  scales: {
    xAxes: [
      {
        stacked: true,
        gridLines: {
          color: "rgba(0, 0, 0, 0)"
        }
      }
    ],
    yAxes: [
      {
        stacked: true
      }
    ]
  },
  responsive: true,
  options: {
    responsive: true,

    maintainAspectRatio: true,
    scales: {
      yAxes: [
        {
          stacked: true,
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

class StackedBarChart extends React.Component {
  render() {
    return (
      <Bar
        height={this.props.dimensions.height}
        style={{ fill: "none" }}
        data={data}
        options={options}
        onElementsClick={elems => getStackedBarLabelFilter(elems)}
      ></Bar>
    );
  }
}

export default StackedBarChart;
