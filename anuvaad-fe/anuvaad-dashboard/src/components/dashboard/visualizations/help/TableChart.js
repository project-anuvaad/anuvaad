import React from "react";

/**
 * Table chart component
 */

class TableChart extends React.Component {
  render() {
    return (
      <div className="table-responsive" id="tableChart">
        <table className="table table-hover metricTextColor">
          <thead>
            <tr>
              <th>Firstname</th>
              <th>Lastname</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Username</td>
              <td>One</td>
              <td>usernameone@example.com</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>Two</td>
              <td>usernametwo@example.com</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>Three</td>
              <td>usernamethree@example.com</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default TableChart;
