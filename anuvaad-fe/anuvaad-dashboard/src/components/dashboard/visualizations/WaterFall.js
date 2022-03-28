import React from "react";
import { Chart } from "react-google-charts";
// import _ from "lodash";
// let palette = window.palette;

/**
 * WaterFall component
 */

// const options = {
//   minColor: "#42d4f4",
//   midColor: "#f032e6",
//   maxColor: "#ffd4b3",
//   headerHeight: 0,
//   fontColor: "black",
//   showScale: false
// };
const data = [
  ["Day", "", "", "", ""],
  ["Mon", 20, 28, 38, 45],
  ["Tue", 31, 38, 55, 66],
  ["Wed", 50, 55, 77, 80],
  ["Thu", 77, 77, 66, 50],
  ["Fri", 68, 66, 22, 15]
];
const options = {
  legend: "none",
  bar: { groupWidth: "100%" }, // Remove space between bars.
  candlestick: {
    fallingColor: { strokeWidth: 0, fill: "#a52714" }, // red
    risingColor: { strokeWidth: 0, fill: "#0f9d58" } // green
  }
};
class WaterFall extends React.Component {

  // constructor(props) {
  //   super(props);
  // }

  // getData(chartData) {
  //   // console.log("chartData: "+JSON.stringify(chartData))
  //   let tempData = ["Name", "Value", "Color"];
  //   let tempdataSet = ["Header", "", 0];
  //   let dataSet = [];
  //   let finalData = [];
  //   let fullData = [];
  //
  //
  //   /**
  //     * Lodash function to transform the response data into suitable format
  //     * inorder to get visualized into the dashboard
  //     */
  //   _.map(chartData, function(k, v) {
  //     var plots = k["plots"];
  //
  //     for (var i = 0; i < plots.length; i++) {
  //       dataSet.push(plots[i]["name"]);
  //       dataSet.push("Header");
  //       dataSet.push(plots[i]["value"]);
  //     }
  //   });
  //
  //
  //   /**
  //     * Loop to separate the data into multiple array elements
  //     */
  //   let i;
  //   let j;
  //   let parts = 3;
  //
  //   for (i = 0, j = dataSet.length; i < j; i += parts) {
  //     finalData.push(dataSet.slice(i, i + parts));
  //   }
  //
  //   fullData.push(tempData);
  //   fullData.push(tempdataSet);
  //   finalData.map((value, index) => {
  //     fullData.push(value);
  //   });
  //   return fullData;
  //   // console.log("tempData: "+JSON.stringify(tempData))
  //   // console.log("DataSet: "+JSON.stringify(fullData));
  // }

  render() {
    // let { chartData } = this.props;
    // let _data = this.getData(chartData);
    // console.log("data: "+JSON.stringify(_data))

    // if (_data) {
      return (
        <Chart
          chartType="CandlestickChart"
          width="100%"
          height="400px"
          data={data}
          options={options}
        />
      );
    // }
    // return <div>Loading...</div>;
  }
}

export default WaterFall;
