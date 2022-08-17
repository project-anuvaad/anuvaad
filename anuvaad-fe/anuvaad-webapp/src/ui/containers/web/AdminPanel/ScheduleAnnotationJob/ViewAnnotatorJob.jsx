import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import ToolBar from "./ViewAnnotatorJobHeader";
import { translate } from "../../../../../assets/localisation";
import NewCorpusStyle from "../../../../styles/web/Newcorpus";

import APITransport from "../../../../../flux/actions/apitransport/apitransport";
import FetchTaskDetails from '../../../../../flux/actions/apis/view_scheduled_jobs/fetch_annotator_job';
import DataTable from "../../../../components/web/common/DataTable";

class ViewAnnotatorJob extends React.Component {
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
        let apiObj = new FetchTaskDetails(this.props.match.params.taskId)
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

    /**
     * API calls
     */

    render() {
        const columns = [
            {
                name: "source",
                label: "Source",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "target",
                label: "Target",
                options: {
                    filter: false,
                    sort: false,
                },
            },
            {
                name: "score",
                label: "Score",
                options: {
                    filter: false,
                    sort: false,
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
            count: this.props.taskdetail.count,
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
            <div style={{ }}>
                <div style={{ margin: "0% 3% 3% 3%", paddingTop: "2%" }}>
                    <ToolBar />
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <DataTable
                            title={"Job Details"}
                            data={this.props.taskdetail.result}
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
    taskdetail: state.taskdetail
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
        connect(mapStateToProps, mapDispatchToProps)(ViewAnnotatorJob)
    )
);
