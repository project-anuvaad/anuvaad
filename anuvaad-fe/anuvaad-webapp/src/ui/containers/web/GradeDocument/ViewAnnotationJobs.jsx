import React from 'react';
import Header from './ViewAnnotationJobHeader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import { translate } from "../../../../assets/localisation";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";


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
    processUserView = (id, name) => {
        return (
            <Tooltip title="View User Details" placement="right">
                <IconButton style={{ color: '#233466', padding: '5px' }}
                    component="a"
                >
                    <LibraryBooksIcon />
                </IconButton>
            </Tooltip>
        );
    }

    processDownloadDocumentView = () => {
        return <Tooltip title="Download input file" placement="left">
            <IconButton
                style={{ color: "#233466", padding: "5px" }}
                component="a"
            >
                <CloudDownloadIcon />
            </IconButton>
        </Tooltip>
    }

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
    render() {
        const dummyData = [{ fID: '1', fname: 'Dummy-file.csv', jobDesc: 'This is a dummy file.' }]
        const columns = [
            {
                name: "fID",
                label: "fID",
                options: {
                    filter: false,
                    sort: false,
                    display: "exclude",
                }
            },
            {
                name: "fname",
                label: 'FileName',
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "jobDesc",
                label: 'Job Description',
                options: {
                    filter: false,
                    sort: true,
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
                                    {this.getDateTimeFromTimestamp(Date.now())}
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
                                    {this.processUserView(tableMeta.rowData[0], tableMeta.rowData[2])}
                                    {this.processDownloadDocumentView()}
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
                                columns={columns} options={options} data={dummyData} />
                        </MuiThemeProvider>
                    }
                </div>
            </div>
        )
    }
}

export default ViewAnnotationJobs;