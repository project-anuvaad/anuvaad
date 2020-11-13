import React, { Component } from "react";
import GenericCharts from "../../visualizations/GenericCharts";

/**
 * Page layout to display the charts which are generated dynamically
 */

class PageLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  render() {
    let { chartRowData, row } = this.props;

    return (
      <div key={`generic${row}`}>
        {chartRowData.map((vizData, j) => (
          <GenericCharts
            key={j}
            row={row}
            chartData={vizData}
            pathProps={this.props.pathName}
          />
        ))}
      </div>
    );
  }
}

export default PageLayout;
