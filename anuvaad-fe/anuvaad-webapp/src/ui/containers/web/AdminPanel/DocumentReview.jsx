import React from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { translate } from "../../../../assets/localisation";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import FileContent from "../../../../flux/actions/apis/document_translate/fetchcontent";
import UserReportHeader from "./UserReportHeader"
import DataTable from "../../../components/web/common/DataTable";
import { Button, FilledInput, FormControl, FormControlLabel, IconButton, Input, InputAdornment, OutlinedInput, Switch, TextField } from "@material-ui/core";
import history from "../../../../web.history";
import BackIcon from '@material-ui/icons/ArrowBack';
import CheckIcon from '@material-ui/icons/Check';
import Snackbar from "../../../components/web/common/Snackbar";
import updateReviewInFetchContent from "../../../../flux/actions/apis/document_translate/updateReviewInFetchContent";
import saveConetent from "../../../../flux/actions/apis/document_translate/savecontent";
import ConfirmBox from "../../../components/web/common/ConfirmBox";
import UpdateGranularStatus from "../../../../flux/actions/apis/document_translate/update_granular_status";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";

class DocumentReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roles"),
      data: [],
      showLoading: false,
      confirmDialogue: {
        open: false,
        message: "",
        onConfirm: null,
        onCancle: this.onCloseConfirmBox
      },
      snackbarInfo: {
        open: false,
        message: "",
        variant: "info"
      }
    };
  }

  componentDidMount() {
    const { APITransport } = this.props
    const apiObj = new FileContent(this.props.match.params.recordId, "0", "0", false, true);
    APITransport(apiObj)

    console.log("this.props.count --- ", this.props.count);
  }

  fetchDocumentsToReview = () => {
    const apiObj = new FetchDocument(
      0,
      0,
      [""],
      false,
      false,
      false,
      [],
      true,
      true
    );
    APITransport(apiObj);
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          padding: '3px 10px 3px',
        },
      },
    }
  })

  processTableClickedNextOrPrevious = (page) => {
    if (this.state.currentPageIndex < page) {
      this.setState({
        currentPageIndex: page,
        offset: this.state.offset + this.state.limit
      });
    }
  };

  handleCloseInfo = () => {
    let currentInfoState = {...this.state.snackbarInfo};
    currentInfoState = {
      open: false,
      message: "",
      variant: "info"
    };
    this.setState({ snackbarInfo: currentInfoState });
  }

  updateGranularity = (statusArr, successMessage, shouldGoBack = true) => {
    let jobId = this.props.match.params.jobId;
    const apiObj = new UpdateGranularStatus(jobId, statusArr);

    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      // console.log("rsp_data ---- ", rsp_data);
      if (rsp_data?.status == "SUCCESS") {
        // show info for granularity
        let currentInfoState = {...this.state.snackbarInfo};
        currentInfoState = {
          open: true,
          message: successMessage,
          variant: "info"
        };
        this.setState({ snackbarInfo: currentInfoState });
        this.fetchDocumentsToReview();
        shouldGoBack && setTimeout(() => {
          history.goBack()
        }, 2000);
      }

    }).catch(err => {
      let currentInfoState = {...this.state.snackbarInfo};
      currentInfoState = {
        open: true,
        message: "Failed to update granularity.",
        variant: "error"
      };
      this.setState({ snackbarInfo: currentInfoState });
      console.log(err);
    })

  }

  onCloseConfirmBox = () => {
    let currentconfirmDialogueState = this.state.confirmDialogue;
    currentconfirmDialogueState.open = false;
    currentconfirmDialogueState.message = "";
    currentconfirmDialogueState.onConfirm = null;
    this.setState({ confirmDialogue: currentconfirmDialogueState })
  }

  onApproveClick = () => {
    let statusArr = this.props.match.params.currentStatus === "FINAL EDITING - COMPLETED" ? ["reviewerInProgress", "reviewerCompleted"] : ["reviewerCompleted"]
    this.updateGranularity(statusArr, "Document Verified!");
    // console.log("this.props.match.params.jobId --- ", this.props.match.params.jobId);
    this.onCloseConfirmBox()
  }

  sendForCorrectionClick = () => {
    let statusArr = this.props.match.params.currentStatus === "FINAL EDITING - COMPLETED" ? ["reviewerInProgress", "manualEditingStartTime"] : ["manualEditingStartTime"]
    this.updateGranularity(statusArr, "Document Sent For Correction!")
    this.onCloseConfirmBox()
  }

  openAprroveConfirmBox = () => {
    let currentconfirmDialogueState = this.state.confirmDialogue;
    currentconfirmDialogueState.open = true;
    currentconfirmDialogueState.message = "Are you sure you want to mark the document translation to be accurate and upload this document to improve the model?";
    currentconfirmDialogueState.onConfirm = this.onApproveClick;
    this.setState({ confirmDialogue: currentconfirmDialogueState })
  }

  openSendForCorrectionConfirmBox = () => {
    let currentconfirmDialogueState = this.state.confirmDialogue;
    currentconfirmDialogueState.open = true;
    currentconfirmDialogueState.message = "Are you sure you want to mark the document translation to be inaccurate and have the translator re-edit it?";
    currentconfirmDialogueState.onConfirm = this.sendForCorrectionClick;
    this.setState({ confirmDialogue: currentconfirmDialogueState })
  }

  onReviewChange = (e, tableMeta) => {
    // console.log("tableMeta --- ", tableMeta);
    let fetchContentData = this.props.fetchContent;
    fetchContentData.data[tableMeta.rowIndex].review = e.target.value;
    updateReviewInFetchContent(fetchContentData);
  }

  onSubmitIndividualReview = (senetenceData) => {
    this.handleCloseInfo();
    let senetenceObj = {
      "comments": senetenceData.review,
      "redo": true,
      "s_id": senetenceData.s_id,
      "n_id": senetenceData.n_id
    }

    let apiObj = new saveConetent(senetenceObj, true);

    fetch(apiObj.apiEndPoint(), {
      method: apiObj.method,
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        this.updateGranularity(["reviewerInProgress"], "Review Comment Updated!", false)
      }
      )
      .catch(error => console.log('error', error));
  }

  render() {
    const columns = [
      {
        name: "s0_src",
        label: 'Source',
        options: {
          filter: false,
          sort: true,
          setCellProps: () => ({ style: { maxWidth: "250px" } }),
        }
      },
      {
        name: "s0_tgt",
        label: "Machine Translation",
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({ style: { maxWidth: "250px" } }),
        }
      },
      {
        name: "tgt",
        label: "Manual Translation",
        options: {
          filter: false,
          sort: false,
          setCellProps: () => ({ style: { maxWidth: "250px" } }),
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData[4] == "-") {
              return ""
            } else {
              return value
            }
          }
        }
      },
      {
        name: "tgt",
        label: 'Proof Read',
        options: {
          filter: false,
          sort: true,
          display: "exclude"
        }
      },

      {
        name: "bleu_score",
        label: "Bleu Score",
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "time_spent",
        label: "Time Spent",
        options: {
          filter: false,
          sort: false,
          display: "exclude"
        }
      }, {
        name: "Action",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align: "center" } },
          setCellProps: () => { return { align: "center" } },
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div style={{ alignItems: "center" }}>
                  <OutlinedInput
                    placeholder="Add Review"
                    defaultValue={tableMeta.tableData[tableMeta.rowIndex]?.comments ? tableMeta.tableData[tableMeta.rowIndex]?.comments : ""}
                    onChange={e => this.onReviewChange(e, tableMeta)}
                    fullWidth
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          title="Add comment for this translation if you want correction."
                          aria-label="add comment"
                          onClick={(e) => this.onSubmitIndividualReview(tableMeta.tableData[tableMeta.rowIndex])}
                        >
                          <CheckIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </div>
              );
            }
          },
        }
      }
    ];


    const options = {
      textLabels: {
        body: {
          noMatch: "Loading...."
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        },
        options: { sortDirection: 'desc' }
      },
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.processTableClickedNextOrPrevious(tableState.page)
            break;
          default:
        }
      },
      count: this.props.count,
      rowsPerPageOptions: [10, 25, this.props.fetchContent?.data ? this.props.fetchContent?.data?.length : 100],
      filterType: "checkbox",
      download: true,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: 'registered_time',
        direction: 'desc'
      },
      page: this.state.currentPageIndex
    };

    return (
      <div style={{
        // height: window.innerHeight,
        // overflow: 'auto'
      }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "4%" }}>
          {/* <UserReportHeader /> */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, alignItems: "center" }}>
            <div>
              <IconButton
                onClick={() => {
                  history.goBack()
                }}
                color="inherit" aria-label="Menu" style={{ margin: "0px 5px" }}
              >
                <BackIcon />
              </IconButton>
            </div>
            <div style={{ display: "flex" }}>
              <Button variant="contained" color="primary" size="small" onClick={this.openAprroveConfirmBox}>Approve</Button>
              <Button variant="contained" color="primary" size="small" style={{ marginLeft: 2 }} onClick={this.openSendForCorrectionConfirmBox}>Send For Correction</Button>
            </div>
          </div>
          {
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <DataTable title={this.props.match.params.fname}
                columns={columns} options={options}
                data={this.props.apistatus.progress ? [] : this.props.fetchContent.data} />
            </MuiThemeProvider>
          }
        </div>
        <ConfirmBox
          open={this.state.confirmDialogue.open}
          onClose={this.state.confirmDialogue.onCancle}
          title=""
          contentText={this.state.confirmDialogue.message}
          onConfirm={this.state.confirmDialogue.onConfirm}
        />
        {this.state.snackbarInfo.open && <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={this.state.snackbarInfo.open}
          autoHideDuration={3000}
          onClose={this.handleCloseInfo}
          variant={this.state.snackbarInfo.variant}
          message={this.state.snackbarInfo.message}
        />}
      </div >
    );
  }
}

const mapStateToProps = state => ({
  fetchContent: state.fetchContent,
  apistatus: state.apistatus
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    APITransport,
    FileContent,
  },
  dispatch
);
export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(DocumentReview)));
