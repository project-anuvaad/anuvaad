import React from "react";
// import NFormatterFun from '../NumberFormaterFun';
// let palette = window.palette;

/**
 * Metric visual component
 */

class MetricVisual extends React.Component {
  // constructor(props) {
  // 	super(props);
  // }

  getData(chartData) {
    // var tempData = {
    // 	row: [],
    // 	columnHeader: [],
    // 	rowValue: []
    // };
    return chartData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);
    // 	let intPie;
    // intPie = setInterval(() => (this.getData(chartData)), 10000);
    // localStorage.setItem("intPie", intPie);
    //     console.log("PieChart chartData", chartData);
    // console.log("PieChart _data", _data);
    // console.log("Data: "+JSON.stringify(this.data));

    if (_data) {
      return (
        <div className="">
          {_data.map((value, index) => (
            <div className="customLineHeight" key={index}>
              <p className="metricTextColor">{value.headerName}</p>
              {!value.isDecimal ? (
                <p className="largeNum">{Math.round(value.headerValue)}</p>
              ) : (
                <p className="largeNum">{value.headerValue}</p>
              )}
              <p>&nbsp;</p>
            </div>
          ))}
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default MetricVisual;
