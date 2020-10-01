import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchMTWorkspace from "../../../../flux/actions/apis/fetchworkspace";
import { translate } from "../../../../assets/localisation";

class DataSource extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      page: 0,
      rowsPerPage: 10,
      serverSideFilterList: [],
      filters: [],
      download: false,
      fileId: ""
    };
  }

  componentDidMount() {
    this.handleFetchWorkspace();
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  handleFetchWorkspace = () => {
    const { APITransport } = this.props;
    const apiObj = new FetchMTWorkspace(this.state.rowsPerPage, this.state.page + 1, "", "");
    APITransport(apiObj);
    this.setState({ showLoader: true });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.fetchWorkspace !== this.props.fetchWorkspace) {
      this.setState({ name: this.props.fetchWorkspace.data, count: this.props.fetchWorkspace.count });
    }
  }

  handleReset = val => {
    const { APITransport } = this.props;
    const apiObj = new FetchMTWorkspace(this.state.rowsPerPage, this.state.page + 1, "", "", val);
    APITransport(apiObj);
    this.setState({ filter: val });
  };

  changePage = (page, rowsPerPage) => {
    const { APITransport } = this.props;
    const apiObj = new FetchMTWorkspace(rowsPerPage, page + 1, "", "");
    APITransport(apiObj);
    this.setState({ page, rowsPerPage });
  };

  handleFilterSubmit = filterList => () => {
    clearTimeout(this.intervalID);
    const apiObj = new FetchMTWorkspace(this.state.rowsPerPage, this.state.page + 1, "", "", filterList);
    this.props.APITransport(apiObj);
    this.setState({ filter: filterList });
  };

  handleClick = rowData => {
    this.setState({download: true, fileId: rowData[4] });
    const link = document.createElement("a");
    link.href = (process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org/download/") + rowData[4];
    document.body.appendChild(link);
    link.click();
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    const columns = [
      {
        name: "title",
        label: translate("common.page.table.workspace"),
        options: {
          filter: true,
          sort: true,
          filterList: this.state.filters[0]
        }
      },
      {
        name: "session_id",
        label: translate("common.page.label.id"),
        options: {
          display: "excluded",
          filter: false
        }
      },
      {
        name: "username",
        label: translate("tool1.datasource.label.uploadBy"),
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "created_at",
        label: translate("too1.datasource.label.uploadedAt"),
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "sentence_file",
        options: {
          display: "excluded",
          filter: false
        }
      }
    ];

    const options = {
      textLabels: {
        body: {
          noMatch: translate('gradeReport.page.muiNoTitle.sorryRecordNotFound')
        },
        toolbar: {
          search: translate('graderReport.page.muiTable.search'),
          viewColumns: translate('graderReport.page.muiTable.viewColumns'),
          filterTable: translate('graderReport.page.muiTable.filterTable'),
        },
        pagination: {
          rowsPerPage: translate('graderReport.page.muiTable.rowsPerPages'),
        }
    },
      filterType: "textField",
      download: false,
      print: false,
      search: false,
      filter: true,
      serverSide: true,
      count: this.state.count,
      selectableRows: "none",
      page: this.state.page / this.state.rowsPerPage,
      onRowClick: rowData => this.handleClick(rowData),
      onFilterDialogOpen: () => {
        clearTimeout(this.intervalID);
      },
      onFilterDialogClose: () => {},
      onFilterChange: (column, filterList, type, reset) => {
        if (type === "reset") {
          this.handleReset("");
        }
      },
      customFilterDialogFooter: filterList => (
        <div style={{ marginTop: "40px" }}>
          <Button color="primary" variant="contained" onClick={this.handleFilterSubmit(filterList[0])}>
            {translate("common.page.button.applyFilter")}
          </Button>
        </div>
      ),
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.changePage(tableState.page, tableState.rowsPerPage);
            break;

          case "changeRowsPerPage":
            this.changePage(tableState.page, tableState.rowsPerPage);
            break;
            default:return null;
        }
      }
    };

    return (
      <div>
        <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }}>
          <MUIDataTable title={translate("common.page.data.dataSource")} data={this.state.name} columns={columns} options={options} />
        </div>
        {this.state.download && this.state.fileId !== null && (
          <a dangerouslySetInnerHTML={{ __html: ' ' }} href={`${ process.env.REACT_APP_BASE_URL ? process.env.REACT_APP_BASE_URL : "http://auth.anuvaad.org"}/download/${this.state.fileId}`} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchWorkspace: state.fetchWorkspace
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DataSource));
