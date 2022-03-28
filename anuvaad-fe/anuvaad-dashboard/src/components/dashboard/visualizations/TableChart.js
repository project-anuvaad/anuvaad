import React from "react";
// import NFormatterFun from '../NumberFormaterFun';
// import _ from 'lodash';
// let palette = window.palette;

/**
 * Table chart component
 */

class TableChart extends React.Component {
  // constructor(props) {
  // 	super(props);
  // }

  getData(chartData) {
    // console.log("chartdata: "+JSON.stringify(chartData))
    var tempData = {
      row: [],
      columnHeader: [],
      rowValue: []
    };

    chartData
      .filter(Boolean)
      .map(rowName => tempData.row.push(rowName.headerName));
    // console.log("New row: "+tempData.row);

    chartData
      .filter(Boolean)
      .map(columnHeading =>
        tempData.columnHeader.push(columnHeading.plots.map(label => label.name))
      );
    // console.log("New columnHeader: "+tempData.columnHeader);

    chartData
      .filter(Boolean)
      .map(value =>
        tempData.rowValue.push(value.plots.map(label => label.value))
      );
    // console.log("New rowValue: "+tempData.rowValue);

    return tempData;
  }

  render() {
    let { chartData } = this.props;
    let _data = this.getData(chartData);
    // console.log("Table data: "+JSON.stringify(_data));
    // 	let intPie;
    // intPie = setInterval(() => (this.getData(chartData)), 10000);
    // localStorage.setItem("intPie", intPie);
    //     console.log("PieChart chartData", chartData);
    // console.log("PieChart _data", _data);
    // console.log("Data: "+JSON.stringify(this.data));

    // let row = [];
    // this.data.responseData.data.map((rowName) => row.push(rowName.headerName));
    // console.log("rowName: "+row);

    // let columnHeader = [];
    // this.data.responseData.data.map((columnHeading) => columnHeader.push(columnHeading.plots.map(label => label.name)));
    // console.log("columnHeading: "+columnHeader[0]);
    // columnHeader.map((field) => columns.dataField = field.toLowerCase);
    // columns[0].dataField = columnHeader[0].map((field) => field.toLowerCase());
    // columns[0].text = columnHeader[0].map((field) => field);

    // let rowValue = [];
    // this.data.responseData.data.map((value) => rowValue.push(value.plots.map(label => label.value)));
    //   console.log("rowValue: "+rowValue);
    // console.log("Data: "+JSON.stringify(_data));

    if (_data) {
      return (
        <div className="table-responsive" id="tableChart">
          {_data.columnHeader.length && (
            <table className="table table-hover metricTextColor">
              <thead>
                <tr>
                  {_data.columnHeader[0].map((value, index) => (
                    <th key={index} scope="col">
                      {value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {_data.row.map((value, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{value}</td>
                    {_data.rowValue[index]
                      .filter(i => i !== null)
                      .map((text, id) => (
                        <td key={id}>{Math.round(text)}</td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/*<nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item"><a class="page-link" href="#">Previous</a></li>
                  <li class="page-item"><a class="page-link" href="#">1</a></li>
                  <li class="page-item"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
              </nav>*/}
        </div>
      );
    }
    return <div>Loading...</div>;
  }
}

export default TableChart;
