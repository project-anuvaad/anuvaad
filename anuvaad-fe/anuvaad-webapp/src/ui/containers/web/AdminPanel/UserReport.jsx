import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Snackbar from "../../../components/web/common/Snackbar";
import UserReportHeader from "./UserReportHeader"
import Spinner from "../../../components/web/common/Spinner";
import { translate } from "../../../../assets/localisation";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import history from "../../../../web.history";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import FetchDocument from "../../../../flux/actions/apis/view_document/fetch_document";
import JobStatus from "../../../../flux/actions/apis/view_document/translation.progress";
import { clearJobEntry } from "../../../../flux/actions/users/async_job_management";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import DownloadFile from "../../../../flux/actions/apis/download/download_file";
import EventIcon from '@material-ui/icons/Event';
import clearEvent from '../../../../flux/actions/apis/admin/clear_user_event_report';


const TELEMETRY = require("../../../../utils/TelemetryManager");

class UserReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: localStorage.getItem("roles"),
            showInfo: false,
            offset: 0,
            limit: 0,
            currentPageIndex: 0,
            dialogMessage: null,
            timeOut: 3000,
            variant: "info",
            userID: [this.props.match.params.id]

        };
    }

    /**
     * life cycle methods
     */
    componentDidMount() {
        TELEMETRY.pageLoadStarted("user-report");
        this.props.clearEvent();
        if (this.props.job_details.documents.length < 1) {
            this.setState({ showLoader: true });
            this.makeAPICallJobsBulkSearch(
                this.state.offset,
                this.state.limit,
                [""],
                false,
                false,
                false,
                this.state.userID,

            );
        }
        else {
            this.makeAPICallJobsBulkSearch(
                this.state.offset,
                this.state.limit,
                [""],
                false,
                false,
                false,
                this.state.userID,
            )
            this.makeAPICallDocumentsTranslationProgress();
            this.setState({ showLoader: true })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
        TELEMETRY.pageLoadCompleted("user-report");
    }

    componentDidUpdate(prevProps) {
        if (this.props.job_details.changedJob && this.props.job_details.changedJob.hasOwnProperty("jobID") && prevProps.job_details.changedJob !== this.props.job_details.changedJob) {
            this.setState({ showLoader: false })
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
            prevProps.job_details.documents.length === 0 &&
            this.props.job_details.documents.length === 0 &&
            !this.props.apistatus.progress &&
            this.state.showLoader
        ) {
            this.setState({ showLoader: false });
        }
        else if (this.props.fetch_document.result.count !== prevProps.fetch_document.result.count) {
            this.makeAPICallDocumentsTranslationProgress();
            this.setState({ showLoader: false });
        }
        else if (this.props.fetch_document.result.jobIDs !== undefined &&
            this.props.fetch_document.result.jobIDs.length !== prevProps.fetch_document.result.jobIDs.length) {
            this.setState({ showLoader: false });
        }
        else if (this.props.job_details.progress_updated !== prevProps.job_details.progress_updated && this.props.job_details.count === prevProps.job_details.count) {
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

    /**
     * API calls
     */

    makeAPICallJobsBulkSearch(
        offset,
        limit,
        jobIds = [""],
        searchForNewJob = false,
        searchNextPage = false,
        updateExisting = false,
        userIDs = this.state.userID,
    ) {
        const { APITransport } = this.props;
        const apiObj = new FetchDocument(
            offset,
            limit,
            jobIds,
            searchForNewJob,
            searchNextPage,
            updateExisting,
            userIDs,
            true
        );
        APITransport(apiObj);
    }

    makeAPICallDocumentsTranslationProgress(limit) {
        if (limit) {
            var recordIds = this.getRecordIds(limit);
        } else {
            var recordIds = this.getRecordIds();
        }
       
        if (recordIds.length > 0) {
            const uniqueIDs = recordIds.filter((val,id,array) => array.indexOf(val) == id);
            const { APITransport } = this.props;
            const apiObj = new JobStatus(uniqueIDs, true);
            // const apiObj = new JobStatus(recordIds, true);
            APITransport(apiObj);
            this.setState({ showProgress: true, searchToken: false });
        }
    }

    /**
     * helper methods
     */
    getJobsSortedByTimestamp = () => {
        let jobs = this.props.job_details.documents.sort((a, b) => {
            if (a.created_on < b.created_on) {
                return 1;
            }
            return -1;
        });
        return jobs;
    };

    getJobsAsPerPageAndLimit = (page, limit) => {
        if(limit === 0) {
            // limit = 10  
            this.setState({ limit: 10 });
        }
        return this.getJobsSortedByTimestamp().slice(
            page * limit,
            page * limit + limit
        );
    };

    getRecordIds = (limit) => {
        let recordids = [];
        if (limit) {
            this.getJobsAsPerPageAndLimit(
                this.state.currentPageIndex,
                limit
            ).map((job) => job.recordId && recordids.push(job.recordId));
        } else {
            this.getJobsAsPerPageAndLimit(
                this.state.currentPageIndex,
                this.state.limit
            ).map((job) => job.recordId && recordids.push(job.recordId));
        }
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

    /**
     * handlers to process user clicks
     */

    processDocumentView = (fid, fname, status, sentenceCount) => {
        return (
            <Tooltip title="View User Details" placement="right">
                <IconButton style={{ color: '#233466', padding: '5px' }}
                    component="a"
                    onClick={() => this.handleDocumentView(fid, fname, status, sentenceCount)}>
                    <AssessmentOutlinedIcon />
                </IconButton>
            </Tooltip>
        );
    }

    handleDocumentView = (fid, fname, status, sentenceCount) => {
        if (status === 'COMPLETED' && sentenceCount[0] !== '.' && sentenceCount[0] !== '0') {
            const recordID = this.props.job_details.documents.filter(doc => doc.jobID === fid)[0].recordId
            history.push(`${process.env.PUBLIC_URL}/document-stats/${recordID}/${fname}`)
        } else {
            if (status === 'FAILED') {
                this.setState({ dialogMessage: 'Document translation is failed' })
            }
            else if (status === 'INPROGRESS') {
                this.setState({ dialogMessage: 'Document still in progress' })

            } else {
                this.setState({ dialogMessage: 'No sentences are saved' })
            }
        }
        setTimeout(() => {
            this.setState({ dialogMessage: "" })
        }, 3000)
    }


    handleMessageClear = () => {
        setTimeout(() => {
            this.setState({ dialogMessage: "" });
        }, 3000);
    };

    snackBarMessage = () => {
        return (
            <div>
                <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    open={!this.state.timeOut}
                    autoHideDuration={this.state.timeOut}
                    variant={this.state.variant}
                    message={this.state.dialogMessage}
                />
            </div>
        );
    };

    getDateTimeDifference(endTime, startTime) {
        let edate = new Date(endTime);
        let sdate = new Date(startTime);
        let sec = Math.trunc(Math.abs(edate.getTime() - sdate.getTime()) / 1000);
        var date = new Date(0);
        date.setSeconds(sec); // specify value for SECONDS here
        return date.toISOString().substr(11, 8);
    }

    processTableClickedNextOrPrevious = (page) => {
        if (this.state.currentPageIndex < page) {
            /**
             * user wanted to load next set of records
             */
            this.makeAPICallJobsBulkSearch(
                this.state.offset + this.state.limit,
                this.state.limit,
                false,
                false,
                this.state.userID,
            );
            // this.makeAPICallDocumentsTranslationProgress();
            this.setState({
                currentPageIndex: page,
                offset: this.state.offset + this.state.limit,
            });
        } else {
            this.setState({
                currentPageIndex: page,
            });

        }
    };

    processDocumentDownload = (jobId) => {
        return <Tooltip title="Download input file" placement="left">
            <IconButton
                style={{ color: "#233466", padding: "5px" }}
                component="a"
                onClick={() =>
                    this.processDownloadInputFileClick(jobId)
                }
            >
                <CloudDownloadIcon />
            </IconButton>
        </Tooltip>
    }

    processDownloadInputFileClick = (jobId) => {
        this.setState({
            dialogMessage: "Downloading file...",
            timeOut: null,
            variant: "info",
        });
        let job = this.getJobIdDetail(jobId);
        let user_profile = JSON.parse(localStorage.getItem("userProfile"));
        let obj = new DownloadFile(job.converted_filename, this.props.match.params.id);

        const apiReq1 = fetch(obj.apiEndPoint(), {
            method: "get",
            headers: obj.getHeaders().headers,
        })
            .then(async (response) => {
                if (!response.ok) {
                    this.setState({
                        dialogMessage: "Failed to download file...",
                        timeOut: 3000,
                        variant: "info",
                    });
                    console.log("api failed");
                } else {
                    const buffer = new Uint8Array(await response.arrayBuffer());
                    let res = Buffer.from(buffer).toString("base64");

                    fetch("data:image/jpeg;base64," + res)
                        .then((res) => res.blob())
                        .then((blob) => {
                            let a = document.createElement("a");
                            let url = URL.createObjectURL(blob);
                            a.href = url;
                            a.download = job.converted_filename;
                            this.setState({ dialogMessage: null });
                            a.click();
                        });
                }
            })
            .catch((error) => {
                this.setState({
                    dialogMessage: "Failed to download file...",
                    timeOut: 3000,
                    variant: "info",
                });
                console.log("api failed because of server or network", error);
            });
    };

    processEventView = (jobId, status, sentenceCount) => {
        return <Tooltip title="View Events" placement="right">
            <IconButton
                style={{ color: "#233466", padding: "5px" }}
                component="a"
                onClick={() =>
                    this.handleEventView(jobId, status, sentenceCount)
                }
            >
                <EventIcon />
            </IconButton>
        </Tooltip>
    }
    handleEventView = (fid, status, sentenceCount) => {
        if (status === 'COMPLETED' && sentenceCount[0] !== '.' && sentenceCount[0] !== '0') {
            history.push(`${process.env.PUBLIC_URL}/user-event-view/${fid}/${this.state.userID}`)
        } else {
            if (status === 'FAILED') {
                this.setState({ dialogMessage: 'Document translation is failed' })
            }
            else if (status === 'INPROGRESS') {
                this.setState({ dialogMessage: 'Document still in progress' })

            } else {
                this.setState({ dialogMessage: 'No sentences are saved' })
            }
        }
        setTimeout(() => {
            this.setState({ dialogMessage: "" })
        }, 3000)
    }

    render() {
        const columns = [
            {
                name: "filename",
                label: "Filename",
                options: {
                    filter: false,
                    sort: false,
                    // display: "excluded",
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
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "target_language_code",
                label: translate("common.page.label.target"),
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "status",
                label: translate("common.page.table.status"),
                options: {
                    filter: true,
                    sort: false,
                    empty: true,
                },
            },
            {
                name: "progress",
                label: "Sentence Progress",
                options: {
                    filter: true,
                    sort: false,
                    empty: true,
                },
            },
            {
                name: "word_count",
                label: "Word Count",
                options: {
                    filter: true,
                    sort: false,
                    empty: true,
                },
            }, {
                name: "bleu_score",
                label: "Average Bleu",
                options: {
                    hint: "Total bleu score / Total saved sentence",
                    sort: false
                }
            }, {
                name: "spent_time",
                label: "Time Spent",
                options: {
                    sort: false
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
                label: "Job time",
                options: {
                    filter: true,
                    sort: true,
                    display: "excluded",

                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            return (
                                <div>
                                    {tableMeta.rowData[5] === "COMPLETED" &&
                                        this.getDateTimeDifference(
                                            tableMeta.rowData[10],
                                            tableMeta.rowData[12]
                                        )}
                                </div>
                            );
                        }
                    },
                },
            },
            {
                name: "created_on",
                label: translate("common.page.label.timeStamp"),
                options: {
                    filter: true,
                    sort: true,
                    display: "excluded",
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            return (
                                <div>
                                    {this.getDateTimeFromTimestamp(tableMeta.rowData[12])}
                                </div>
                            );
                        }
                    },
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
                            return (
                                <div>
                                    {this.processDocumentView(tableMeta.rowData[1], tableMeta.rowData[0], tableMeta.rowData[5], tableMeta.rowData[6])}
                                    {this.processDocumentDownload(tableMeta.rowData[1])}
                                    {this.processEventView(tableMeta.rowData[1], tableMeta.rowData[5], tableMeta.rowData[6])}
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
                        this.props.fetch_document.state,
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

            onTableChange: (action, tableState) => {
                switch (action) {
                    case "changePage":
                        this.processTableClickedNextOrPrevious(
                            tableState.page
                        );
                        this.setState({ showLoader: true, limit: tableState.rowsPerPage })
                        break;
                    case "changeRowsPerPage":
                        this.setState({ showLoader: true, limit: tableState.rowsPerPage, currentPageIndex: tableState.page  })
                        this.makeAPICallDocumentsTranslationProgress(tableState.rowsPerPage);
                        break;
                    default:
                }
            },
            count: this.props.job_details.count,
            filterType: "checkbox",
            download: false,
            print: false,
            fixedHeader: true,
            filter: false,
            selectableRows: "none",
            sortOrder: {
                name: "timestamp",
                direction: "desc",
            },
            page: this.state.currentPageIndex,
        };
        return (
            <div style={{ minHeight: window.innerHeight - 2 }}>
                <div style={{ margin: "0% 3% 3% 3%", paddingTop: "7%", paddingBottom: "1%" }}>
                    <UserReportHeader />
                    {/* {!this.state.showLoader && ( */}
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={`${this.props.match.params.name}'s Detail`}
                            data={this.getJobsSortedByTimestamp()}
                            columns={columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                    {/* )} */}
                    {/* {
                        this.state.showLoader &&
                        <Spinner />
                    } */}
                </div>
                {this.state.dialogMessage && this.snackBarMessage()}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    apistatus: state.apistatus,
    job_details: state.job_details,
    fetch_document: state.fetchDocument
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            clearJobEntry,
            APITransport,
            CreateCorpus: APITransport,
            FetchDocument,
            clearEvent
        },
        dispatch
    );

export default withRouter(
    withStyles(NewCorpusStyle)(
        connect(mapStateToProps, mapDispatchToProps)(UserReport)
    )
);
