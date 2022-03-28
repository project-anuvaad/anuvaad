import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import NFormatterFun from "../numberFormaterFun";
// import _ from "lodash";

/**
 * Areachart component
 */

class AreaChartType extends PureComponent {
  manupulateData(chartData) {
    let tempElement = [];
    chartData.forEach((d, i) => {
      let tempVal = "";

      d.plots.forEach((d1, i) => {
        tempVal = NFormatterFun(d1.value, d1.symbol, "Unit");
        tempVal =
          typeof tempVal == "string"
            ? parseFloat(tempVal.replace(/,/g, ""))
            : tempVal;
        tempElement.push({ name: d1.name, uv: tempVal });
      });
    });
    return tempElement;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.manupulateData(chartData);
    // console.log("Data: "+JSON.stringify(_data));

    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={_data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="uv"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default AreaChartType;
