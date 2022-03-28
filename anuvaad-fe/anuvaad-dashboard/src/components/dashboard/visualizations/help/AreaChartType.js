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

/**
 * Areachart component
 */

const data = [
  {
    name: "Data 1",
    uv: 4000,
    pv: 2400,
    amt: 2400
  },
  {
    name: "Data 2",
    uv: 3000,
    pv: 1398,
    amt: 2210
  },
  {
    name: "Data 3",
    uv: 2000,
    pv: 9800,
    amt: 2290
  },
  {
    name: "Data 4",
    uv: 2780,
    pv: 3908,
    amt: 2000
  }
];

class AreaChartType extends PureComponent {
  render() {
    return (
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
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
              fill="#2B98FF"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default AreaChartType;
