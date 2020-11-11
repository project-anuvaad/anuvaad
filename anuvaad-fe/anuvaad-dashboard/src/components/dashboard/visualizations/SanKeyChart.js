import React from "react";
import { Chart } from "react-google-charts";
// import _ from "lodash";
// let palette = window.palette;

/**
 * SanKeyChart component
 */

 const data = [
   ["From", "To", "Weight"],
   [ 'Brazil', 'Portugal', 5 ],
     [ 'Brazil', 'France', 1 ],
     [ 'Brazil', 'Spain', 1 ],
     [ 'Brazil', 'England', 1 ],
     [ 'Canada', 'Portugal', 1 ],
     [ 'Canada', 'France', 5 ],
     [ 'Canada', 'England', 1 ],
     [ 'Mexico', 'Portugal', 1 ],
     [ 'Mexico', 'France', 1 ],
     [ 'Mexico', 'Spain', 5 ],
     [ 'Mexico', 'England', 1 ],
     [ 'USA', 'Portugal', 1 ],
     [ 'USA', 'France', 1 ],
     [ 'USA', 'Spain', 1 ],
     [ 'USA', 'England', 5 ],
     [ 'Portugal', 'Angola', 2 ],
     [ 'Portugal', 'Senegal', 1 ],
     [ 'Portugal', 'Morocco', 1 ],
     [ 'Portugal', 'South Africa', 3 ],
     [ 'France', 'Angola', 1 ],
     [ 'France', 'Senegal', 3 ],
     [ 'France', 'Mali', 3 ],
     [ 'France', 'Morocco', 3 ],
     [ 'France', 'South Africa', 1 ],
     [ 'Spain', 'Senegal', 1 ],
     [ 'Spain', 'Morocco', 3 ],
     [ 'Spain', 'South Africa', 1 ],
     [ 'England', 'Angola', 1 ],
     [ 'England', 'Senegal', 1 ],
     [ 'England', 'Morocco', 2 ],
     [ 'England', 'South Africa', 7 ],
     [ 'South Africa', 'China', 5 ],
     [ 'South Africa', 'India', 1 ],
     [ 'South Africa', 'Japan', 3 ],
     [ 'Angola', 'China', 5 ],
     [ 'Angola', 'India', 1 ],
     [ 'Angola', 'Japan', 3 ],
     [ 'Senegal', 'China', 5 ],
     [ 'Senegal', 'India', 1 ],
     [ 'Senegal', 'Japan', 3 ],
     [ 'Mali', 'China', 5 ],
     [ 'Mali', 'India', 1 ],
     [ 'Mali', 'Japan', 3 ],
     [ 'Morocco', 'China', 5 ],
     [ 'Morocco', 'India', 1 ],
     [ 'Morocco', 'Japan', 3 ]
 ];
 const options = {};

class SanKeyChart extends React.Component {

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
          height={this.props.dimensions.height}
          chartType="Sankey"
          width="100%"
          data={data}
          options={options}
        />
      );
    // }
    // return <div>Loading...</div>;
  }
}

export default SanKeyChart;
