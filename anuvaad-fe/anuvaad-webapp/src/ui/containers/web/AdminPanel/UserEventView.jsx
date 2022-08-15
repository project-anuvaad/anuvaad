import React from "react";
import Header from "./UserEventViewHeader";
import UserEventReport from "../../../../flux/actions/apis/admin/get_user_event_report";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Spinner from "../../../components/web/common/Spinner";
import { translate } from "../../../../assets/localisation";
import ViewListIcon from "@material-ui/icons/ViewList";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import JSONViewerModal from "./JSONViewerModal";
import Snackbar from "../../../components/web/common/Snackbar";
import copy from "copy-to-clipboard";
import { Button } from "@material-ui/core";
import exportFromJSON from "export-from-json";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DataTable from "../../../components/web/common/DataTable";
class UserEventView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: false,
      openModal: false,
      user_events: [],
      open: false,
      dialogMessage: "",
      timeOut: 3000,
      variant: "info",
    };
  }

  componentDidMount() {
    if (this.props.eventData.length < 1) {
      this.setState({ showLoader: true });
      const { jobId, uid } = this.props.match.params;
      const { APITransport } = this.props;
      const apiObj = new UserEventReport("SAVE", jobId, uid);
      APITransport(apiObj);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.eventData.length !== this.props.eventData.length &&
      this.state.showLoader
    ) {
      this.setState({ showLoader: false });
    }
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            padding: "3px 10px 3px",
          },
        },
      },
    });

  renderEventList = (s_id, time) => {
    const sentence_data = this.props.eventData.filter(
      (data) => data.s_id === s_id && data.time_spent === time
    );
    return (
      <Tooltip title="View Events JSON" placement="right">
        <IconButton
          style={{ color: "#233466", padding: "5px" }}
          component="a"
          onClick={() => this.handleEventListView(sentence_data[0].user_events)}
        >
          <ViewListIcon />
        </IconButton>
      </Tooltip>
    );
  };

  handleEventListView = (events) => {
    if (events.length) {
      this.setState({ openModal: true, user_events: events });
    } else {
      this.setState({
        open: true,
        dialogMessage: "No user events are present",
        variant: "info",
      });
    }
    setTimeout(() => {
      this.setState({ open: false, dialogMessage: "", variant: "info" });
    }, 3000);
  };

  renderJSONModalView = () => {
    return (
      <Modal open={this.state.openModal} onClose={this.handleModalClose}>
        <JSONViewerModal
          copy={this.handleCopyJSON}
          close={this.handleModalClose}
          user_events={this.state.user_events}
        />
      </Modal>
    );
  };

  handleDownLoad = () => {
    const data = this.props.eventData;
    const fileName = "ExportData";
    const exportType = "json";

    exportFromJSON({ data, fileName, exportType });
  };

  handleCopyJSON = () => {
    var data = document.getElementById("json-pretty").innerText;
    copy(data);

    this.setState({
      open: true,
      dialogMessage: "JSON Copied successfully...",
      variant: "success",
      openModal: false,
    });
    setTimeout(() => {
      this.setState({ open: false, dialogMessage: "", variant: "info" });
    }, 3000);
  };

  handleModalClose = () => {
    this.setState({ openModal: false });
  };

  snackBarMessage = () => {
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={this.state.open}
          autoHideDuration={this.state.timeOut}
          variant={this.state.variant}
          message={this.state.dialogMessage}
        />
      </div>
    );
  };

  render() {
    const AddJsonDownload = () => (
      <Tooltip disableFocusListener title="Download Json">
        <IconButton onClick={() => this.handleDownLoad()}>
          <CloudDownloadIcon />
        </IconButton>
      </Tooltip>
    );
    const columns = [
      {
        name: "s_id",
        label: "Sentence Id",
        options: {
          filter: false,
          sort: false,
          display: "excluded",
        },
      },
      {
        name: "src",
        label: "Source",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "mt",
        label: "Machine Translation",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "tgt",
        label: "Target",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "bleu_score",
        label: "Bleu Score",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "time_spent",
        label: "Time Spent",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "user_events",
        label: "User Events",
        options: {
          filter: false,
          sort: false,
          display: "excluded",
        },
      },

      {
        name: "Action",
        label: translate("common.page.label.action"),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return <div>{this.renderEventList(tableMeta.rowData[0], tableMeta.rowData[5])}</div>;
            }
          },
        },
      },
    ];

    const options = {
      textLabels: {
        body: {},
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns"),
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages"),
        },
        options: { sortDirection: "desc" },
      },

      customToolbar: AddJsonDownload,
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
    };

    return (
      <div style={{ height: window.innerHeight - 70 }}>
        <div style={{ margin: "0% 3% 3% 3%", paddingTop: "7vh" }}>
          <Header />
          {!this.state.showLoader && (
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <DataTable
                title={`User Event Report`}
                data={this.props.eventData}
                columns={columns}
                options={options}
              />
            </MuiThemeProvider>
          )}
          {this.state.showLoader && <Spinner />}
        </div>
        {this.state.open && this.snackBarMessage()}
        {this.state.openModal && this.renderJSONModalView()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  eventData: state.getUserReport.responseData,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport,
    },
    dispatch
  );

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserEventView)
);
