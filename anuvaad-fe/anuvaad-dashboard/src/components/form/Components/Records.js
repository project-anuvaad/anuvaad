import React, { Component } from "react";
import LocalizedStrings from "react-localization";
import { translations } from "../../../translations.js";

let strings = new LocalizedStrings(translations);

class Records extends Component {
  constructor(props) {
    super(props);
    this.state = {
      language: "en",
      sort: "asc",
    };
    this.sortTable = this.sortTable.bind(this);
    this.searchTable = this.searchTable.bind(this);
  }

  sortTable = (event) => {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("borderless");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[1];
        y = rows[i + 1].getElementsByTagName("TD")[1];
        //check if the two rows should switch place:
        if (this.state.sort === "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            this.setState({
              sort: "desc",
            });
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else {
          this.setState({
            sort: "asc",
          });
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  };

  searchTable = (event) => {
    var input,
      filter,
      table,
      tr,
      th,
      td,
      i,
      j,
      txtValue,
      rowsCount,
      visibleElements = 0;
    input = event.target;
    filter = input.value.toUpperCase();
    table = document.getElementById("borderless");
    tr = table.getElementsByTagName("tr");
    th = table.getElementsByTagName("th");
    rowsCount = document.getElementById("rows-count");
    for (i = 1; i < tr.length; i++) {
      let display = false;
      for (j = 0; j < th.length; j++) {
        td = tr[i].getElementsByTagName("td")[parseInt(j)];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            display = true;
          }
        }
      }
      if (display) {
        tr[i].style.display = "";
        visibleElements += 1;
      } else {
        tr[i].style.display = "none";
      }
    }
    rowsCount.innerHTML = visibleElements;
  };

  render() {
    strings.setLanguage(
      localStorage.getItem("language") || this.state.language
    );
    return (
      <div className="row pt-4 mt-4">
        <div className="row col-12">
          <div className="col-md-9">
            <div className="form-group has-search">
              <div className="col-md-4">
                <span className="fa fa-search form-control-feedback"></span>
                <input
                  type="text"
                  className="form-control search-items has-search"
                  id="searchInput"
                  onKeyUp={(event) => this.searchTable(event)}
                  placeholder={strings.searchForForm}
                />
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="row col-12">
              <div className="col-6">
                <img
                  src="/img/all-filter.png"
                  className="table-filter"
                  alt=""
                />
                {strings.all}
              </div>
              <div className="col-6">
                {this.state.sort === "asc" && (
                  <div>
                    <img
                      src="/img/sort.png"
                      className="table-filter pointer rotateimg180"
                      alt=""
                      onClick={(event) => this.sortTable(event)}
                    />
                    {strings.sortAZ}
                  </div>
                )}
                {this.state.sort === "desc" && (
                  <div>
                    <img
                      src="/img/sort.png"
                      className="table-filter pointer"
                      alt=""
                      onClick={(event) => this.sortTable(event)}
                    />
                    {strings.sortZA}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="col-12">
              <h6 className="pl-1">
                <span id="rows-count">4</span> {strings.items}
              </h6>
              <table
                className="table borderless table-striped users-list"
                id="borderless"
              >
                <thead>
                  <tr>
                    <th width="33.33%" scope="col">
                      {strings.formName}
                    </th>
                    <th width="33.33%" scope="col">
                      {strings.uploadedBy}
                    </th>
                    <th width="33.33%" scope="col">
                      {strings.submittedOn}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CAF_230</td>
                    <td>D Ajay Gosh</td>
                    <td>Uploaded on 10/03/220</td>
                  </tr>
                  <tr>
                    <td>CAF_231</td>
                    <td>C Ajay Gosh</td>
                    <td>Uploaded on 11/03/220</td>
                  </tr>
                  <tr>
                    <td>CAF_233</td>
                    <td>B Ajay Gosh</td>
                    <td>Uploaded on 12/03/220</td>
                  </tr>
                  <tr>
                    <td>CAF_234</td>
                    <td>A Ajay Gosh</td>
                    <td>Uploaded on 13/03/220</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Records;
