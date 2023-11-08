import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Snackbar from "../../../components/web/common/Snackbar";
import DeleteIcon from "@material-ui/icons/Delete";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import ToolBar from "./ViewDocHeader";
import ProgressBar from "../../../components/web/common/ProgressBar";
import Dialog from "../../../components/web/common/SimpleDialog";
import Spinner from "../../../components/web/common/Spinner";
import { translate } from "../../../../assets/localisation";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import history from "../../../../web.history";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";
import MarkInactive from "../../../../flux/actions/apis/view_document/markinactive";
import JobStatus from "../../../../flux/actions/apis/view_document/translation.progress";
import { clearJobEntry } from "../../../../flux/actions/users/async_job_management";
import DownloadFile from "../../../../flux/actions/apis/download/download_file";
import fetchpageno from '../../../../flux/actions/apis/view_document/fetch_page_no';
import DataTable from "../../../components/web/common/DataTable";
import { Button, TableCell, TableRow, TextField, TableFooter, Typography, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import UploadProcessModal from "../DocumentUpload/UploadProcessModal";
import GranularTaskDetailsModal from "./GranularTaskDetailsModal";
import { CustomTableFooter } from "../../../components/web/common/CustomTableFooter";
import ClearContent from "../../../../flux/actions/apis/document_translate/clearcontent";

const TELEMETRY = require("../../../../utils/TelemetryManager");

class ViewDocument extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.pageInputRef = React.createRef();
    this.state = {
      role: localStorage.getItem("roles"),
      showInfo: false,
      offset: 0,
      limit: 10,
      currentPageIndex: 0,
      maxPageNum: 0,
      dialogMessage: null,
      timeOut: 3000,
      variant: "info",
      isInputActive: false,
      inputPageNumber: 1,
      selectedGranularStatus: false,
      filterOptionData: [
        {label: "All", value: false},
          // ["auto_translation_inprogress", "auto_translation_completed", "manual_editing_inprogress", "manual_editing_completed", "reviewer_in_progress", "manual_reediting_completed", "manual_reediting_in_progress", "reviewer_completed", "parallel_document_uploaded"] },
        {label: "Auto Translation - In Progress", value: ["auto_translation_in_progress"] },
        {label: "Auto Translation - Completed", value: ["auto_translation_completed"] },
        {label: "Final Editing - In Progress", value: ["manual_editing_in_progress", "manual_reediting_in_progress"] },
        {label: "Final Editing - Completed", value: ["manual_editing_completed", "manual_reediting_completed"] },
        {label: "Review - In Progress", value: ["reviewer_in_progress"] },
        {label: "Review - Completed", value: ["reviewer_completed", "parallel_document_uploaded"] },
      ]
    };
  }

  /**
   * life cycle methods
   */
  componentDidMount() {
    this.timerId = setInterval(this.checkInprogressJobStatus.bind(this), 30000);
    TELEMETRY.pageLoadStarted("view-document");

    // if (this.props.job_details.documents.length < 1) {
    //   this.makeAPICallJobsBulkSearch(
    //     this.state.offset,
    //     this.state.limit,
    //     false,
    //     false
    //   );
    //   this.setState({ showLoader: true });
    // } else if (this.props.async_job_status.job) {
    //   /**
    //    * a job got started, fetch it status
    //    */
    //   this.makeAPICallJobsBulkSearch(
    //     this.state.offset,
    //     this.state.limit,
    //     [this.props.async_job_status.job.jobID],
    //     true,
    //     false
    //   );
    // }
    this.makeAPICallJobsBulkSearch(
      this.state.offset,
      this.state.limit,
      false,
      false
    );
    this.setState({ showLoader: true });
    this.makeAPICallDocumentsTranslationProgress();

    window.addEventListener("keydown", (e) => this.keyPress(e));
    return () => {
      window.removeEventListener("keydown", (e) => this.keyPress(e));
    }
  }

  keyPress = (e) => {
    // e.preventDefault();
    if (e.code === "Enter" && this.state.isInputActive) {
      e.preventDefault();
      this.onChangePageMAnually();
    }
  };

  onChangePageMAnually = () => {
    this.tableRef.current.changePage(Number(this.state.inputPageNumber) - 1);
    this.setState({ currentPageIndex: this.state.inputPageNumber - 1 }, () => {
      this.makeAPICallDocumentsTranslationProgress();
    });
  }

  componentWillUnmount() {
    ClearContent();
    clearInterval(this.timerId);
    TELEMETRY.pageLoadCompleted("view-document");
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.job_details.changedJob && this.props.job_details.changedJob.hasOwnProperty("jobID") && prevProps.job_details.changedJob !== this.props.job_details.changedJob) {
      TELEMETRY.endWorkflow(this.props.job_details.changedJob.source_language_code, this.props.job_details.changedJob.target_language_code, this.props.job_details.changedJob.filename, this.props.job_details.changedJob.jobID, this.props.job_details.changedJob.status)
    }

    if (
      prevProps.job_details.documents.length !==
      this.props.job_details.documents.length
    ) {
      /**
       * update job progress status only progress_updated is false
       */
      if (!this.props.job_details.progress_updated) {
        this.makeAPICallDocumentsTranslationProgress();
        this.setState({ showLoader: false });
      }

      if (this.props.job_details.document_deleted) {
        this.setState({
          dialogMessage: "Deleted successfully ",
          variant: "success",
          timeOut: 3000,
        });
      }
      this.props.clearJobEntry();
    } else if (
      (prevProps.job_details.documents.length === 0 &&
      this.props.job_details.documents.length === 0 &&
      !this.props.apistatus.progress &&
      this.state.showLoader) || 
      (!this.props.apistatus.progress &&
      this.state.showLoader)
    ) {
      this.setState({ showLoader: false });
    }

    if(prevState.selectedGranularStatus !== this.state.selectedGranularStatus){
      this.makeAPICallJobsBulkSearch(
        this.state.offset,
        this.state.limit,
        false,
        false
      );
      this.setState({ showLoader: true });
    }
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            padding: "3px 10px 3px",
            overflow: "auto"
          },
        },
      },
    });

  // getSnapshotBeforeUpdate(prevProps, prevState) {
  //   TELEMETRY.pageLoadStarted('view-document')
  //   /**
  //    * getSnapshotBeforeUpdate() must return null
  //    */
  //   return null;
  // }

  /**
   * API calls
   */
  checkInprogressJobStatus = () => {
    let inprogressJobIds = this.props.job_details.documents
      .filter((job) => job.status === "INPROGRESS" || job.status === "STARTED")
      .map((job) => job.jobID);
    if (inprogressJobIds.length > 0) {
      this.makeAPICallJobsBulkSearch(
        this.state.offset,
        this.state.limit,
        inprogressJobIds,
        false,
        false,
        true
      );
    }
  };

  makeAPICallJobsBulkSearch(
    offset,
    limit,
    jobIds = [""],
    searchForNewJob = false,
    searchNextPage = false,
    updateExisting = false
  ) {
    const { APITransport } = this.props;
    const apiObj = new FetchDocument(
      0,
      0,
      jobIds,
      searchForNewJob,
      searchNextPage,
      updateExisting,
      false,
      false,
      false,
      this.state.selectedGranularStatus[0] === "auto_translation_in_progress" ? false : this.state.selectedGranularStatus,
      this.state.selectedGranularStatus[0] === "auto_translation_in_progress" ? ["INPROGRESS"] : this.state.selectedGranularStatus[0] === "auto_translation_completed" ? ["COMPLETED"]: [""]
    );
    APITransport(apiObj);
  }

  makeAPICallJobDelete(jobId) {
    const { APITransport } = this.props;
    const apiObj = new MarkInactive(jobId);

    APITransport(apiObj);
    this.setState({
      showProgress: true,
      searchToken: false,
      dialogMessage: " Selected document is deleting, please wait...!",
      timeOut: null,
    });
  }

  makeAPICallDocumentsTranslationProgress(jobIds) {
    var recordIds = this.getRecordIds();
    if (recordIds.length > 0) {
      const { APITransport } = this.props;
      const apiObj = new JobStatus(recordIds);
      APITransport(apiObj);
      this.setState({ showProgress: true, searchToken: false });
    }
  }

  /**
   * helper methods
   */
  getJobsSortedByTimestamp = () => {
    // console.log("this.props.job_details.documents ======== ", this.props.job_details.documents);
    let jobs = this.props.job_details.documents.sort((a, b) => {
      if (a.created_on < b.created_on) {
        return 1;
      }
      return -1;
    });
    // console.log("jobs ======== ", jobs);
    return jobs;
  };

  getJobsAsPerPageAndLimit = (page, limit) => {
    // console.log("this.getJobsSortedByTimestamp() ------- ", this.getJobsSortedByTimestamp());
    return this.getJobsSortedByTimestamp()
      .slice(
        page * limit,
        page * limit + limit
      );
  };

  getRecordIds = () => {
    let recordids = [];
    this.getJobsAsPerPageAndLimit(
      this.state.currentPageIndex,
      this.state.limit
    ).map((job) => job.recordId && recordids.push(job.recordId));
    return recordids;
  };

  getJobIdDetail = (jobId) => {
    return this.getJobsSortedByTimestamp().filter(
      (job) => job.jobID === jobId
    )[0];
  };

  getDateTimeFromTimestamp = (t) => {
    let date = new Date(t);
    return (
      ("0" + date.getDate()).slice(-2) +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("0" + date.getHours()).slice(-2) +
      ":" +
      ("0" + date.getMinutes()).slice(-2)
    );
  };

  showProgressIndicator = () => {
    return (
      <div>
        <ProgressBar token={true} val={1000} eta={2000 * 1000}></ProgressBar>
      </div>
    );
  };

  /**
   * handlers to process user clicks
   */

  processJobTimelinesClick(jobId, recordId) {
    let taskDetails = this.getJobIdDetail(jobId);
    // console.log("taskDetails ---- ", taskDetails);
    this.setState({ showInfo: true, message: taskDetails, dialogType: "info", dialogTitle: "File Process Information" });
  }

  processGranularStausInfoClick(jobId, recordId) {
    let taskDetails = this.getJobIdDetail(jobId);
    // console.log("taskDetails ---- ", taskDetails);
    this.setState({ showInfo: true, message: taskDetails, dialogType: "info", dialogTitle: "File Process Information" });
  }

  handleDialogClose() {
    this.setState({ showInfo: false, dialogType: null, dialogTitle: null, message: null });
  }

  handleDialogSubmit = (jobId) => {
    this.setState({ showInfo: false, dialogType: null, dialogTitle: null, value: null, message: null });
    this.makeAPICallJobDelete(jobId);
  }

  processDeleteJobClick = (fileName, jobId, recordId) => {
    this.setState({ showInfo: true, message: "Do you want to delete a file " + fileName + " ?", dialogTitle: "Delete " + fileName, value: jobId })
    // this.makeAPICallJobDelete(jobId);
  };

  processViewDocumentClick = (jobId, recordId, status, workflowCode, granularStatus) => {
    let role = localStorage.getItem("roles")
    let job = this.getJobIdDetail(jobId);
    job.filename = job.filename?.includes("#") ? job.filename?.split("#").join("%23") : job.filename;

    if (status === "COMPLETED") {
      history.push(
        `${process.env.PUBLIC_URL}/interactive-document/${job.recordId}/${job.converted_filename}/${job.model_id}/${job.filename}/${workflowCode}/${job.source_language_code}/${job.target_language_code}`,
        this.state
      );


    } else if (status === "INPROGRESS" || status === "STARTED") {
      this.setState({
        dialogMessage: "Please wait process is Inprogress!",
        timeOut: 3000,
        variant: "info",
      });
      this.handleMessageClear();
    } else {
      this.setState({
        dialogMessage: "Document Translation Failed!",
        timeOut: 3000,
        variant: "error",
      });
      this.handleMessageClear();
    }
  };

  handleMessageClear = () => {
    setTimeout(() => {
      this.setState({ dialogMessage: "" });
    }, 3000);
  };

  snackBarMessage = () => {
    return (
      <div>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={!this.state.timeOut}
          autoHideDuration={this.state.timeOut}
          variant={this.state.variant}
          message={this.state.dialogMessage}
        />
      </div>
    );
  };

  processDownloadInputFileClick = (jobId, recordId) => {
    this.setState({
      dialogMessage: "Downloading file...",
      timeOut: null,
      variant: "info",
    });
    let job = this.getJobIdDetail(jobId);
    // console.log("job ----- ", job);
    let user_profile = JSON.parse(localStorage.getItem("userProfile"));
    // console.log(job.converted_filename, user_profile.userID)
    let obj = new DownloadFile(job.converted_filename, user_profile.userID);

    const apiReq1 = fetch(obj.apiEndPoint(), {
      method: "get",
      headers: obj.getHeaders().headers,
    })
      .then(async (response) => {
        if (!response.ok) {
          this.setState({
            dialogMessage: "Failed to download file...",
            timeOut: 3000,
            variant: "error",
          });
          // console.log("api failed");
        } else {
          const buffer = new Uint8Array(await response.arrayBuffer());
          let res = Buffer.from(buffer).toString("base64");

          fetch("data:image/jpeg;base64," + res)
            .then((res) => res.blob())
            .then((blob) => {
              let a = document.createElement("a");
              let url = URL.createObjectURL(blob);
              a.href = url;
              a.download = job.filename;
              this.setState({ dialogMessage: null });
              a.click();
            });
        }
      })
      .catch((error) => {
        this.setState({
          dialogMessage: "Failed to download file...",
          timeOut: 3000,
          variant: "error",
        });
        // console.log("api failed because of server or network", error);
      });
  };

  getDateTimeDifference(endTime, startTime) {
    let edate = new Date(endTime);
    let sdate = new Date(startTime);
    let sec = Math.trunc(Math.abs(edate.getTime() - sdate.getTime()) / 1000);
    var date = new Date(0);
    date.setSeconds(sec == 0 ? 1 : sec); // specify value for SECONDS here
    return date.toISOString().substr(11, 8);
  }

  processTableClickedNextOrPrevious = (page, sortOrder) => {
    if (this.props.page_no < page) {
      /**
       * user wanted to load next set of records
       */
      this.props.fetchpageno()
      this.makeAPICallJobsBulkSearch(
        page * this.state.limit,
        // this.state.offset + this.state.limit,
        this.state.limit,
        false,
        false,
        true
      );
      this.setState({
        currentPageIndex: page,
        offset: page * this.state.limit,
      });
    }
  };

  handleInputPageChange = (event, totalPageCount) => {
    if (event.target.value <= totalPageCount) {
      this.setState({ inputPageNumber: event.target.value })
    } else if (event.target.value > totalPageCount) {
      this.setState({ inputPageNumber: totalPageCount })
    } else if (event.target.value == 0) {
      this.setState({ inputPageNumber: 1 })
    } else if (event.target.value < 0) {
      this.setState({ inputPageNumber: 1 })
    }
  }

  render() {
    const columns = [
      {
        name: "filename",
        label: "Filename",
        options: {
          filter: false,
          sort: false,
          viewColumns: false,
          setCellProps: () => ({
            style: {
              wordBreak: "break-word"
            }
          }),
        },
      },
      {
        name: "jobID",
        label: "JobID",
        options: {
          display: "excluded",
        },
      },
      {
        name: "recordId",
        label: "RecordId",
        options: {
          display: "excluded",
        },
      },
      {
        name: "source_language_code",
        label: translate("common.page.label.source"),
        options: {
          viewColumns: false,
          filter: false,
          sort: false,
        },
      },
      {
        name: "target_language_code",
        label: translate("common.page.label.target"),
        options: {
          viewColumns: false,
          filter: false,
          sort: false,
        },
      },
      {
        name: "model_name",
        label: "Translation Model",
        options: {
          filter: false,
          sort: false,
          display: false,
        },
      },
      {
        name: "status",
        label: "Translation Status",
        options: {
          filter: true,
          sort: false,
          empty: true,
          display: false
        },
      },
      {
        name: "progress",
        label: "Sentence Progress",
        options: {
          filter: true,
          sort: false,
          empty: true,
          display: false,
        },
      },
      {
        name: "word_count",
        label: "Word Count",
        options: {
          filter: true,
          sort: false,
          empty: true,
          // display: false,
        },
      },
      {
        name: "description",
        label: "Description",
        options: {
          display: 'false',
          sort: false,
        }
      },
      {
        name: "spent_time",
        label: "Time Spent",
        options: {
          sort: false,
          // display: false,
        }
      },
      {
        name: "endTime",
        label: "End Time",
        options: {
          display: "excluded",
        },
      },
      {
        name: "Time Taken",
        label: "Translation Time",
        options: {
          filter: true,
          sort: true,
          display: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  {tableMeta.rowData[6] === "COMPLETED" &&
                    this.getDateTimeDifference(
                      tableMeta.rowData[11],
                      tableMeta.rowData[13]
                    )}
                </div>
              );
            }
          },
        },
      },
      {
        name: "created_on",
        label: "Translation Start Time",
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  {this.getDateTimeFromTimestamp(tableMeta.rowData[13])}
                </div>
              );
            }
          },
        },
      },
      {
        name: "workflowCode",
        label: "Workflow Code",
        options: {
          display: "excluded",
        },
      },
      {
        name: "currentGranularStatus",
        label: "Status",
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <Typography variant="body2" style={{color: value.trim() === "FINAL DOCUMENT UPLOADED" ? "#0f650f9c" : "#000000" }}><b>{value}</b></Typography>
          }
        },
      },
      {
        name: "Action",
        label: translate("common.page.label.action"),
        options: {
          filter: false,
          sort: false,
          empty: true,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  <Tooltip title="Info" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() => {
                        // console.log("tableMeta ---- ", tableMeta)
                        this.processJobTimelinesClick(
                          tableMeta.rowData[1],
                          tableMeta.rowData[2]
                        )
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="View document" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() =>
                        this.processViewDocumentClick(
                          tableMeta.rowData[1],
                          tableMeta.rowData[2],
                          tableMeta.rowData[6],
                          tableMeta.rowData[14],
                          tableMeta.rowData[15].trim()
                        )
                      }
                    >
                      <LibraryBooksIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete job" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() =>
                        this.processDeleteJobClick(
                          tableMeta.rowData[0],
                          tableMeta.rowData[1],
                          tableMeta.rowData[2]
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Download input file" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() =>
                        this.processDownloadInputFileClick(
                          tableMeta.rowData[1],
                          tableMeta.rowData[2]
                        )
                      }
                    >
                      <CloudDownloadIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }
          },
        },
      },
    ];

    const options = {
      textLabels: {
        body: {
          noMatch:
            this.props.job_details.count > 0 &&
              this.props.job_details.count >
              this.props.job_details.documents.length
              ? "Loading...."
              : translate("gradeReport.page.muiNoTitle.sorryRecordNotFound"),
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns"),
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages"),
        },
        options: { sortDirection: "desc" },
      },
      // jumpToPage: true,
      // onChangeRowsPerPage: (limit) => {
      //   // console.log("onChangeRowsPerPage is being called")
      //   let diffValue = limit - this.state.limit;
      //   if (diffValue > 0) {
      //     this.makeAPICallJobsBulkSearch(this.state.offset + diffValue, limit - this.state.limit, false, false, true)
      //   }

      //   this.setState({ limit })

      // },

      rowsPerPageOptions: [10],

      onTableChange: (action, tableState) => {
        switch (action) {
          case "search":
            this.tableRef.current.changePage(0);
            this.setState({ currentPageIndex: 0 });
            break;
          default:
        }
      },
      count: this.props.job_details.count,
      filterType: "checkbox",
      download: this.getJobsSortedByTimestamp()?.length > 0 ? true : false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: "timestamp",
        direction: "desc",
      },
      page: this.state.currentPageIndex,
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage
      ) => {
        const startIndex = page * rowsPerPage;
        const endIndex = (page + 1) * rowsPerPage;
        const totalPageCount = Math.ceil(this.props.job_details.count / 10);
        return (
          <CustomTableFooter
            renderCondition={totalPageCount > 0}
            countLabel={"Total Documents"}
            totalCount={this.props.job_details.count}
            pageInputRef={this.pageInputRef}
            inputValue={this.state.inputPageNumber}
            onInputFocus={()=>this.setState({ isInputActive: true })}
            onInputBlur={()=>this.setState({ isInputActive: false })}
            handleInputChange={this.handleInputPageChange}
            totalPageCount={totalPageCount}
            onGoToPageClick={this.onChangePageMAnually}
            onBackArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex - 1 }, ()=>this.makeAPICallDocumentsTranslationProgress())
              this.tableRef.current.changePage(Number(this.state.currentPageIndex - 1))
            }
            }
            onRightArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex + 1 }, () => this.makeAPICallDocumentsTranslationProgress())
              this.tableRef.current.changePage(Number(this.state.currentPageIndex + 1))
            }
            }
            backArrowTabIndex={this.state.currentPageIndex - 1}
            backArrowDisable={this.state.currentPageIndex == 0}
            rightArrowTabIndex={this.state.currentPageIndex + 1}
            rightArrowDisable={this.state.currentPageIndex == (totalPageCount-1)}
            pageTextInfo={`Page ${parseInt(this.state.currentPageIndex + 1)} of ${parseInt(totalPageCount)}`}
          />
        );
      }
    };

    return (
      <div style={{}}>
        <div style={{ margin: "0% 3% 3% 3%", paddingTop: "2%" }}>
          <ToolBar />
          {!this.state.showLoader && (
            <MuiThemeProvider theme={this.getMuiTheme()}>
                                  <div
                        style={{
                            width: "100%",
                            textAlign: "end",
                            marginBottom: 10
                        }}
                    >
                        <FormControl style={{ textAlign: "start" }}>
                            <InputLabel id="demo-simple-select-label">Filter By Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.selectedGranularStatus}
                                // defaultValue={this.state.selectedFilter}
                                style={{ width: 300, fontSize: "1rem" }}
                                onChange={(e) => {
                                    // console.log("e.target.value   ", e.target.value);
                                    this.setState({ selectedGranularStatus: e.target.value })
                                }}
                            >
                                {
                                    this.state.filterOptionData.map((el, i) => {
                                        return <MenuItem
                                            selected={i == 0}
                                            value={el.value}
                                            style={{ fontSize: "1rem" }}
                                        >
                                            {el.label}
                                        </MenuItem>
                                    })
                                }
                            </Select>
                        </FormControl>
                    </div>
              <DataTable
                title={"Translate " + translate("common.page.title.document")}
                data={this.getJobsSortedByTimestamp()}
                columns={columns}
                options={options}
                innerRef={this.tableRef}
              />
            </MuiThemeProvider>
          )}
        </div>
        {this.state.showInfo && (
          <GranularTaskDetailsModal
            message={this.state.message}
            type={this.state.dialogType}
            handleClose={this.handleDialogClose.bind(this)}
            open
            title={this.state.dialogTitle}
            handleSubmit={this.handleDialogSubmit.bind(this)}
            value={this.state.value}
          />
        )}
        {(this.state.showLoader || this.state.loaderDelete) && <Spinner />}
        {this.state.dialogMessage && this.snackBarMessage()}
        {/* <UploadProcessModal /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.login,
  apistatus: state.apistatus,
  job_details: state.job_details,
  async_job_status: state.async_job_status,
  page_no: state.document_pageno.pageno
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      clearJobEntry,
      APITransport,
      CreateCorpus: APITransport,
      fetchpageno
    },
    dispatch
  );

export default withRouter(
  withStyles(NewCorpusStyle)(
    connect(mapStateToProps, mapDispatchToProps)(ViewDocument)
  )
);
