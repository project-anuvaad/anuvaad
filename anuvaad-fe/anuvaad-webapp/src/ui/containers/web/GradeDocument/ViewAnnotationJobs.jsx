import React from 'react';
import Header from './ViewAnnotationJobHeader';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from "mui-datatables";
import { translate } from "../../../../assets/localisation";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import fetchUserJob from '../../../../flux/actions/apis/user/fetch_user_job';
import APITransport from '../../../../flux/actions/apitransport/apitransport';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Spinner from "../../../components/web/common/Spinner";
import history from "../../../../web.history";


class ViewAnnotationJobs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false
        }
    }

    componentDidMount() {
        this.setState({ showLoader: true })
        let { APITransport } = this.props
        let apiObj = new fetchUserJob();
        APITransport(apiObj);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.fetchuserjob.result.length !== this.props.fetchuserjob.result.length) {
            this.setState({ showLoader: false })
        }
        if (prevProps.fetchuserjob.result.length > 0 && this.props.job_detail === 0 && this.state.showLoader) {
            this.setState({ showLoader: false })
        }
    }

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
    processUserView = (taskId) => {
        return (
            <Tooltip title="View User Details" placement="right">
                <IconButton style={{ color: '#233466', padding: '5px' }}
                    component="a"
                    onClick={() => history.push(`${process.env.PUBLIC_URL}/grading-sentence-card/${taskId}/1/1`)}
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
                name: "file_identifier",
                label: "file_identifier",
                options: {
                    filter: false,
                    sort: false,
                    display: "exclude",
                }
            },
            {
                name: "file_name",
                label: 'FileName',
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "description",
                label: 'Job Description',
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "createdOn",
                label: translate("common.page.label.timeStamp"),
                options: {
                    filter: true,
                    sort: true,
                }
            },

            {
                name: "jobId",
                label: "Job ID",
                options: {
                    filter: true,
                    sort: true,
                    display: 'excluded'
                }
            },
            {
                name: "taskId",
                label: "Task ID",
                options: {
                    filter: true,
                    sort: true,
                    display: 'excluded'
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
                                    {this.processUserView(tableMeta.rowData[5])}
                                </div>
                            );
                        }
                    }
                }
            }
        ];
        const options = {
            textLabels: {
                toolbar: {
                    search: translate("graderReport.page.muiTable.search"),
                    viewColumns: translate("graderReport.page.muiTable.viewColumns")
                },
                pagination: {
                    rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
                },
                options: { sortDirection: 'desc' }
            },
            count: this.props.fetchuserjob.count,
            rowsPerPageOptions: [10, 20, 50],
            filterType: "checkbox",
            download: false,
            print: false,
            fixedHeader: true,
            filter: false,
            selectableRows: "none",
            sortOrder: {
                name: "createdOn",
                direction: "desc",
            },
        };
        return (
            <div style={{ height: window.innerHeight }}>
                <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
                    <Header />
                    {this.state.showLoader ?
                        <Spinner />
                        :
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <MUIDataTable title={"Job Details"}
                                columns={columns} options={options}
                                data={this.props.fetchuserjob.result} />
                        </MuiThemeProvider>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        fetchuserjob: state.fetchuserjob,
        job_detail: state.taskdetail.count
    }
}

const mapDispatchToProps = dispatch => bindActionCreators(
    {
        APITransport,
    },
    dispatch
);


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ViewAnnotationJobs));