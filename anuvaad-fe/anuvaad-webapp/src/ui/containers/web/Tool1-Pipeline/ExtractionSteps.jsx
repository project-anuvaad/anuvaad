import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchWorkspace from "../../../../flux/actions/apis/fetchworkspace";
import TabDetals from "./WorkspaceDetailsTab";
import history from "../../../../web.history";
import { translate } from "../../../../assets/localisation";

class ExtractionSteps extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      value: 2,
      page: 0,
      rowsPerPage: 10,
      serverSideFilterList: [],
      filters: [],
      filter: "",
      time: new Date().toLocaleTimeString()
    };
  }

  componentDidMount() {
    this.handleFetchWorkspace();
    this.intervalID = setInterval(this.handleFetchWorkspace, 3000);
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  handleFetchWorkspace = val => {
    const { APITransport } = this.props;
    const apiObj = new FetchWorkspace(this.state.rowsPerPage, this.state.page + 1, "PROCESSING", this.state.filter);
    APITransport(apiObj);
    this.setState({ showLoader: true, filter: val });
  };

  handleReset = val => {
    const { APITransport } = this.props;
    const apiObj = new FetchWorkspace(this.state.rowsPerPage, this.state.page + 1, "PROCESSING", val);
    APITransport(apiObj);
    this.setState({ showLoader: true, filter: val });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.fetchWorkspace !== this.props.fetchWorkspace) {
      this.setState({ name: this.props.fetchWorkspace.data, count: this.props.fetchWorkspace.count });
    }
  }

  handleClick = rowData => {
    this.setState({ workSpacename: rowData[0], id: rowData[1] });
    if (rowData[2] === "At Step1") {
      history.push(`${`${process.env.PUBLIC_URL}/apply-token/`}${rowData[0]}/${rowData[1]}`);
    }
  };

  handleFilterSubmit = filterList => () => {
    clearTimeout(this.intervalID);
    const apiObj = new FetchWorkspace(this.state.rowsPerPage, this.state.page + 1, "PROCESSING", filterList);
    this.props.APITransport(apiObj);
    this.setState({ showLoader: true, filter: filterList });
  };

  changePage = (page, rowsPerPage) => {
    const { APITransport } = this.props;
    const apiObj = new FetchWorkspace(rowsPerPage, page + 1, "PROCESSING", this.state.filter);
    APITransport(apiObj);
    this.setState({ page, rowsPerPage });
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
          sort: false,
          filterList: this.state.filters[0]
        }
      },
      {
        name: "session_id",
        options: {
          display: "excluded",
          filter: false
        }
      },
      {
        name: "step",
        label: translate("common.page.table.status"),
        options: {
          sort: false,
          filter: false
        }
      },
      {
        name: "username",
        label: translate("common.page.table.username"),
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "created_at",
        label: translate("common.page.table.createdAt"),
        options: {
          sort: false,
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
      filter: true,
      serverSideFilterList: this.state.serverSideFilterList,
      filterType: "textField",

      download: false,
      print: false,
      fixedHeaderOptions: { xAxis: false, yAxis: true },
      search: false,
      serverSide: true,
      count: this.state.count,
      selectableRows: "none",
      page: this.state.page / this.state.rowsPerPage,
      onRowClick: rowData => this.handleClick(rowData),
      onFilterDialogOpen: () => {
        clearTimeout(this.intervalID);
      },
      onFilterDialogClose: () => { },
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
          default:
            return null;
        }
      }
    };

    return (
      <div>
        <TabDetals activeStep={this.state.value} style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }} />
        <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "40px" }}>
          <MUIDataTable title={translate("common.tools.title.processingWorkspaces")} data={this.state.name} columns={columns} options={options} />
        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExtractionSteps));
