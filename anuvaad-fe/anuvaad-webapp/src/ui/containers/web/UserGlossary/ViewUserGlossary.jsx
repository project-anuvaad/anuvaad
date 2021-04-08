import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { translate } from "../../../../assets/localisation";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import Header from './ViewUserGlossaryHeader';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { clearJobEntry } from "../../../../flux/actions/users/async_job_management";
import DeleteIcon from "@material-ui/icons/Delete";


const getMuiTheme = () =>
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

const MyGlossary = () => {
    const columns = [
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
                                <Tooltip title="Delete Glossary" placement="left">
                                    <IconButton
                                        style={{ color: "#233466", padding: "5px" }}
                                        component="a"
                                    >
                                        <DeleteIcon />
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
        rowsPerPageOptions: [10],
        count: 0,
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
        page: 0,
    };
    return (
        <div style={{ maxHeight: window.innerHeight, height: window.innerHeight, overflow: "auto" }}>
            <div style={{ margin: "0% 3% 3% 3%", paddingTop: "7%" }}>
                <Header />
                {
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title={translate("common.page.title.glossary")}
                            columns={columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    apistatus: state.apistatus,
    view_scheduled_jobs: state.view_scheduled_jobs,
    async_job_status: state.async_job_status,
    page_no: state.document_pageno.pageno
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            clearJobEntry,
            APITransport,
            CreateCorpus: APITransport,
        },
        dispatch
    );

export default withRouter(
    withStyles(NewCorpusStyle)(
        connect(mapStateToProps, mapDispatchToProps)(MyGlossary)
    )
);