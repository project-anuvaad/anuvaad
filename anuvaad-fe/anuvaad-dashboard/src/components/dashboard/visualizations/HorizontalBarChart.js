import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import NFormatterFun from "../numberFormaterFun";
let hbarPalette = window.palette;

/**
 * HorizontalBarChart component
 */

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
  constructor(props) {
    super(props);
    this.state = {
      trigger: ""
    };
  }

  /**
   * Function to update the chart visualization
   */
  updateHbarVisuals = () => {
    this.setState({
      trigger: true
    });
    this.props.pathName.history.push({
      pathName: "/dashboards",
      state: { trigger: this.state.trigger }
    });
    setTimeout(() => {
      this.props.pathName.history.push({
        pathName: "/dashboards",
        state: { trigger: this.state.trigger }
      });
    }, 500);
  };

  manupulateData(chartData) {
    var tempdata = {
      labels: [],
      datasets: []
    };
    let colors = hbarPalette("cb-Custom1", chartData.length).map(function(hex) {
      return "#" + hex;
    });
    chartData.forEach((d, i) => {
      let tempObj = {
        label: "",
        borderColor: colors[i],
        backgroundColor: colors[i],
        fill: false
      };
      let tempdataArr = [];
      let tempdatalabel = [],
        tempVal = "";
      tempObj.label = d.headerName;
      d.plots.forEach((d1, i) => {
        tempVal = NFormatterFun(d1.value, d1.symbol, "Unit");
        tempVal =
          typeof tempVal == "string"
            ? parseFloat(tempVal.replace(/,/g, ""))
            : tempVal;
        tempdataArr.push(tempVal);
        tempdatalabel.push(d1.name);
      });
      tempObj.data = tempdataArr;
      tempdata.labels = tempdatalabel;
      tempdata.datasets.push(tempObj);
    });
    return tempdata;
  }

  render() {
    let { chartData } = this.props;

    let data = this.manupulateData(chartData);

    /*
     * Function to get the chart label title
     */
    const getHbarLabelFilter = elems => {
      if (localStorage.getItem("filterKey") && elems[0] !== undefined) {
        let selectedLabel = {
          labels: []
        };
        // let finalLabelArray = [];
        // let tempArray = [];

        // if(localStorage.getItem("label")) {
        //   console.log("localStorage present");
        //   selectedLabel.labels.push(localStorage.getItem("label"));
        //   console.log("selectedLabel: "+JSON.stringify(selectedLabel));
        //   finalLabelArray.push(elems[0]._view.label);
        //   console.log("finalLabelArray: "+finalLabelArray);
        //   tempArray = selectedLabel.labels.concat(finalLabelArray);
        //   console.log("tempArray: "+JSON.stringify(tempArray));
        // } else {
        //   console.log("localStorage absent");
        //   selectedLabel.labels.push(elems[0]._view.label);
        //   localStorage.setItem("label", selectedLabel.labels);
        // }

        // console.log("selectedLabel length before: "+selectedLabel.length + " ," + selectedLabel);
        selectedLabel.labels.push(elems[0]._view.label);
        localStorage.setItem("label", selectedLabel.labels);

        // console.log("selectedLabel: "+JSON.stringify(selectedLabel));
        // console.log("finalLabelArray length after: "+finalLabelArray.length + " ," + finalLabelArray);
        // console.log("HorizontalBar GetLabelFilter: "+selectedLabel);

        this.updateHbarVisuals();
      } else {
        // console.log("Out!");
      }
    };

    if (data) {
      return (
        <HorizontalBar
          height={this.props.dimensions.height}
          className="cursorStyleOne"
          style={{ fill: "none" }}
          data={data}
          options={options}
          onElementsClick={elems => getHbarLabelFilter(elems)}
        ></HorizontalBar>
      );
    }
    return <div>Loading...</div>;
  }
}

export default HorizontalBarChart;
