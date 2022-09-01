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
import Snackbar from "../../../components/web/common/Snackbar";
import DataTable from '../../../components/web/common/DataTable';


class ViewAnnotationJobs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showLoader: false,
            open: false,
            message: null,
            variantType: null
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
        if (prevProps.fetchuserjob.result.length > 0 && prevProps.fetchuserjob.result.length === this.props.fetchuserjob.result.length && this.state.showLoader) {
            this.setState({ showLoader: false })
        }
        if (this.props.fetchuserjob.result.length === 0 && this.state.showLoader && this.props.fetchuserjob.status === "COMPLETED") {
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
    handleUserViewClick = (taskId, save_count, total_count) => {
        if (save_count === total_count) {
            this.setState({ open: true, message: 'All sentences are saved...', variantType: 'info' })
            setTimeout(() => {
                this.handleClose()
            }, 3000)
        } else {
            history.push(`${process.env.PUBLIC_URL}/grading-sentence-card/${taskId}`)
        }
    }

    processUserView = (taskId, save_count, total_count) => {
        return (
            <Tooltip title="View Job Details" placement="right">
                <IconButton style={{ color: '#233466', padding: '5px' }}
                    component="a"
                    onClick={() => this.handleUserViewClick(taskId, save_count, total_count)}
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

    handleClose = () => {
        this.setState({ open: false, message: null, variantType: null })
    }

    processSnackBar = () => {
        return (
            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
                name: "source",
                label: 'Source',
                options: {
                    filter: false,
                    sort: true,
                }
            },
            {
                name: "target",
                label: 'Target',
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
                name: "saved_sentences",
                label: "Saved Sentence Count",
                options: {
                    filter: true,
                    sort: true,
                    display: 'excluded'
                }
            },
            {
                name: "total_sentences",
                label: "Total Sentence Count",
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
                                    {this.processUserView(tableMeta.rowData[7], tableMeta.rowData[8], tableMeta.rowData[9])}
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
        };
        return (
            <div style={{ height: window.innerHeight }}>
                <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
                    <Header />
                    {this.state.showLoader ?
                        <Spinner />
                        :
                        <MuiThemeProvider theme={this.getMuiTheme()}>
                            <DataTable title={"Job Details"}
                                columns={columns} options={options}
                                data={this.props.fetchuserjob.result} />
                        </MuiThemeProvider>
                    }
                </div>
                {this.state.open && this.processSnackBar()}
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