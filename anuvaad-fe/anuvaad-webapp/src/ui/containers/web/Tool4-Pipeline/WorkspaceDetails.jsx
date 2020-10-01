import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import { Button } from "@material-ui/core";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchCompositionWorkspace from "../../../../flux/actions/apis/fetchcompositionworkspace";
import TabDetals from "./WorkspaceDetailsTab";
import history from "../../../../web.history";
import { translate } from "../../../../assets/localisation";

class WorkspaceDetails extends React.Component {
  intervalID;

  constructor(props) {
    super(props);
    this.state = {
      value: 2,
      page: 0,
      rowsPerPage: 10,
      serverSideFilterList: [],
      filters: []
    };
  }

  componentDidMount() {
    this.handleFetchWorkspace();
    this.intervalID = setInterval(this.handleFetchWorkspace, 10000);
  }

  componentWillUnmount() {
    clearTimeout(this.intervalID);
  }

  handleFetchWorkspace = () => {
    const { APITransport } = this.props;
    const apiObj = new FetchCompositionWorkspace(this.state.rowsPerPage, this.state.page + 1, "PROCESSING", "");
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
    const apiObj = new FetchCompositionWorkspace(this.state.rowsPerPage, this.state.page + 1, "PROCESSING", "", val);
    APITransport(apiObj);
    this.setState({ filter: val });
  };

  changePage = (page, rowsPerPage) => {
    const { APITransport } = this.props;
    const apiObj = new FetchCompositionWorkspace(rowsPerPage, page + 1, "PROCESSING", "");
    APITransport(apiObj);
    this.setState({ page, rowsPerPage });
  };

  handleFilterSubmit = filterList => () => {
    clearTimeout(this.intervalID);
    const apiObj = new FetchCompositionWorkspace(this.state.rowsPerPage, this.state.page + 1, "PROCESSING", "", filterList);
    this.props.APITransport(apiObj);
    this.setState({ filter: filterList });
  };

  handleClick = rowData => {
    this.setState({ workSpacename: rowData[0], id: rowData[1] });
    if (rowData[2] === "At Step2") {
      history.push(`${`${process.env.PUBLIC_URL}/sentence-extraction/`}${rowData[0]}/${rowData[1]}`);
    }
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
        label: "id",
        options: {
          display: "excluded",
          filter: false
        }
      },
      {
        name: "step",
        label: "step",
        options: {
          filter: false,
          display: "excluded"
        }
      },
      {
        name: "status",
        label: translate("common.page.table.status"),
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "sentence_count",
        label: "Sentence Count",
        options: {
          display: "excluded",
          filter: false
        }
      },
      {
        name: "username",
        label: translate("common.page.table.username"),
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "created_at",
        label: translate("common.page.table.createdAt"),
        options: {
          filter: false,
          sort: false
        }
      }
    ];

    const options = {
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(WorkspaceDetails));
