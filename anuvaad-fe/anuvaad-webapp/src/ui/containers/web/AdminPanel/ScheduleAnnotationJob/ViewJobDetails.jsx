import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import LibraryBooksIcon from "@material-ui/icons/LibraryBooks";

import ToolBar from "./ViewJobDetailHeader";
import { translate } from "../../../../../assets/localisation";
import NewCorpusStyle from "../../../../styles/web/Newcorpus";

import APITransport from "../../../../../flux/actions/apitransport/apitransport";
import FetchJobDetail from '../../../../../flux/actions/apis/view_scheduled_jobs/fetch_job_detail';
import history from "../../../../../web.history";
import Snackbar from "../../../../components/web/common/Snackbar";
import clearJobDetails from '../../../../../flux/actions/apis/view_scheduled_jobs/clear_job_detail';
import clearTask from '../../../../../flux/actions/apis/view_scheduled_jobs/clear_task';
import DataTable from "../../../../components/web/common/DataTable";

class ViewJobDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            message: null,
            variantType: null
        };
    }

    /**
     * life cycle methods
     */
    componentDidMount() {
        this.props.clearJobDetails();
        this.props.clearTask();
        let { APITransport } = this.props
        let apiObj = new FetchJobDetail(this.props.match.params.jobID, "VET_PARALLEL_SENTENCE")
        APITransport(apiObj);
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

    handleJobDetailClick = (taskId, save_count) => {
        if (save_count < 1) {
            this.setState({ open: true, message: 'No sentences are saved', variantType: 'info' })
        } else {
            history.push(`${process.env.PUBLIC_URL}/view-annotator-job/${taskId}`)
        }
        setTimeout(() => {
            this.handleClose();
        }, 3000)
    }

    handleClose = () => {
        this.setState({ open: false, message: null, variantType: null })
    }

    processSnackBar = () => {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                open={this.state.open}
                autoHideDuration={3000}
                onClose={this.handleClose}
                variant={this.state.variantType}
                message={this.state.message}
            />
        );
    }

    render() {
        const columns = [
            {
                name: "taskId",
                label: "Task",
                options: {
                    display: 'excluded'
                },
            },
            {
                name: "userId",
                label: "userID",
                options: {
                    display: 'excluded'
                },
            },
            {
                name: "file_name",
                label: "Filename",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "description",
                label: "Description",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "name",
                label: "Actionable",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "createdOn",
                label: "TimeStamp",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "saved_sentences",
                label: "Saved Sentences",
                options: {
                    filter: false,
                    sort: false,
                    display: 'excluded'
                },
            },
            {
                name: "total_sentences",
                label: "Total Sentences",
                options: {
                    filter: false,
                    sort: false,
                    display: 'excluded'
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
                                    <Tooltip title="View Job Detail" placement="right">
                                        <IconButton
                                            style={{ color: "#233466", padding: "5px" }}
                                            component="a"
                                            onClick={() => this.handleJobDetailClick(tableMeta.rowData[0], tableMeta.rowData[6])}
                                        >
                                            <LibraryBooksIcon />
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
                    noMatch: "Loading...."
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
            count: this.props.job_details.count,
            filterType: "checkbox",
            download: true,
            print: false,
            fixedHeader: true,
            filter: false,
            selectableRows: "none",
            sortOrder: {
                name: "timestamp",
                direction: "desc",
            },
        };
        return (
            < div style={{ }
            }>
                <div style={{ margin: "0% 3% 3% 3%", paddingTop: "2%" }}>
                    <ToolBar />
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <DataTable
                            title={"Job Details"}
                            data={this.props.job_details.result}
                            columns={columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>
                { this.state.open && this.processSnackBar()}
            </div >
        );
    }
}

const mapStateToProps = (state) => ({
    job_details: state.fetch_job_details
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            APITransport,
            CreateCorpus: APITransport,
            clearJobDetails,
            clearTask
        },
        dispatch
    );

export default withRouter(
    withStyles(NewCorpusStyle)(
        connect(mapStateToProps, mapDispatchToProps)(ViewJobDetails)
    )
);
