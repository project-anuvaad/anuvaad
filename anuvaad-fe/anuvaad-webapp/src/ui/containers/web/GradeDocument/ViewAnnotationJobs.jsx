import React from 'react';
import Header from './ViewAnnotationJobHeader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import { translate } from "../../../../assets/localisation";

class ViewAnnotationJobs extends React.Component {
    getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTableBodyCell: {
                root: {
                    padding: '3px 10px 3px',
                },
            },
            MUIDataTableHeadCell: {
                fixedHeader: {
                    paddingLeft: '1.2%'
                }
            }
        }
    })

    render() {
        const columns = [
            {
                name: "userID",
                label: "userID",
                options: {
                    filter: false,
                    sort: false,
                    display: "exclude",
                }
            },
            {
                name: "userName",
                label: "userName",
                options: {
                    filter: false,
                    sort: false,
                    display: "exclude"
                }
            },
            {
                name: "name",
                label: 'Name',
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "userName",
                label: translate("common.page.label.email"),
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "roles",
                label: translate("common.page.label.role"),
                options: {
                    filter: false,
                    sort: true,
                }
            },

            {
                name: "orgId",
                label: "Organization",
                options: {
                    filter: false,
                    sort: false,
                }
            },
            {
                name: "registered_time",
                label: translate("common.page.label.timeStamp"),
                options: {
                    filter: true,
                    sort: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            return (
                                <div>
                                    {tableMeta.rowData[6]}
                                </div>
                            )
                        }
                    }
                }
            },
            {
                name: "is_active",
                label: translate('common.page.label.action'),
                options: {
                    filter: true,
                    sort: false,
                    empty: true,
                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            return (
                                <div>
                                    {this.processSwitch(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[4], tableMeta.rowData[7])}
                                    {this.processModal(tableMeta.rowData[1])}
                                    {this.processUserView(tableMeta.rowData[0], tableMeta.rowData[2])}
                                </div>
                            );
                        }
                    }
                }
            }
        ];
        const options = {
            textLabels: {
                body: {
                    noMatch: this.props.count > 0 && this.props.count > this.props.userinfo.data.length ? "Loading...." : translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
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
            count: this.props.count,
            rowsPerPageOptions: [10, 20, 50],
            filterType: "checkbox",
            download: false,
            print: false,
            fixedHeader: true,
            filter: false,
            selectableRows: "none"
        };
        return (
            <div style={{ height: window.innerHeight }}>
                <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
                    <Header />
                    {
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable title={translate("common.page.title.userdetails")}
                                columns={columns} options={options} />
                        </MuiThemeProvider>
                    }
                </div>
            </div>
        )
    }
}

export default ViewAnnotationJobs;