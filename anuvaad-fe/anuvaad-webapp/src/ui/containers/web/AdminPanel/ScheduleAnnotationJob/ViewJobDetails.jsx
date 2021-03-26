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


const TELEMETRY = require("../../../../../utils/TelemetryManager");

class ViewJobDetails extends React.Component {
    constructor(props) {
        super(props);
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
        };
    }

    /**
     * life cycle methods
     */
    componentDidMount() {
        let { APITransport } = this.props
        let apiObj = new FetchJobDetail(this.props.match.params.jobID, "VET_PARALLEL_SENTENCE")
        APITransport(apiObj);
    }

    componentWillUnmount() {

    }

    componentDidUpdate(prevProps) {

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

    /**
     * API calls
     */

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
                                        onClick={()=>history.push(`${process.env.PUBLIC_URL}/view-annotator-job/${tableMeta.rowData[0]}`)}
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
            <div style={{ maxHeight: window.innerHeight, height: window.innerHeight, overflow: "auto" }}>
                <div style={{ margin: "0% 3% 3% 3%", paddingTop: "7%" }}>
                    <ToolBar />
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={"Job Details"}
                            data={this.props.job_details.count && this.props.job_details.result}
                            columns={columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>
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
        },
        dispatch
    );

export default withRouter(
    withStyles(NewCorpusStyle)(
        connect(mapStateToProps, mapDispatchToProps)(ViewJobDetails)
    )
);
