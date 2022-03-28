import NFormatterFun from "../components/dashboard/numberFormaterFun";
const ExportChart = {
  _charts: {},

  setAttribute(key, value) {
    this._charts[key] = value;
  },

  getRows(chartCode) {
    var rows = [];
    var tempVal;
    var chartData = [];
    for (var j in this._charts[chartCode]) {
      chartData = this._charts[chartCode][j].plots;
      // eslint-disable-next-line no-loop-func
      chartData.forEach((d1, i) => {
        if (i === 0) {
          if (d1.parentLabel !== null && d1.parentLabel !== "") {
            rows.push([d1.label, d1.valueLabel, d1.parentLabel]);
          } else {
            rows.push([d1.label,this._charts[chartCode][j].headerName]);
          }
        }
        tempVal = NFormatterFun(d1.value, d1.symbol, "Unit");
        tempVal =
          typeof tempVal == "string"
            ? parseFloat(tempVal.replace(/,/g, ""))
            : tempVal;
        if (d1.parentName !== null && d1.parentName !== "") {
          rows.push([d1.name, tempVal, d1.parentName]);
        } else {
          rows.push([d1.name, tempVal]);
        }
      });
    }
    return rows;
  },

  tableToCsv(filename) {
    var tableParentId = "#" + filename.replace(/\s/g, "");
    var csv = [];
    var rows = document.querySelectorAll(tableParentId + " table tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td, th");
      for (var j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText.replace(/,/g, ""));
      }
      csv.push(row.join(","));
    }
    // Download CSV file
    this.downloadCSV(csv.join("\n"), filename);
  },

  toCsv(filename, chartCode) {
    var rows = this.getRows(chartCode);
    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }
    this.downloadCSV(csvFile, filename);
  },

  downloadCSV(csvFile, filename) {
    var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename + ".csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  },
};

export default ExportChart;
