import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
// import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Translate';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteOutlinedIcon from '@material-ui/icons/VerticalAlignBottom';
import UploadIcon from '@material-ui/icons/VerticalAlignTop';
import MUIDataTable from "mui-datatables";
import FileUpload from "../../components/web/common/FileUploadWithIcon";
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import DeleteFile from "../../../flux/actions/apis/deletefile";
import UploadTranslatedFile from "../../../flux/actions/apis/uploadTranslatedFile";
import FetchTranslations from "../../../flux/actions/apis/fetchtranslation";
import APITransport from '../../../flux/actions/apitransport/apitransport';
import history from "../../../web.history";
import Timer from "../../components/web/common/CountDown";
import ProgressBar from "../../components/web/common/ProgressBar";
import Fab from '@material-ui/core/Fab';
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Snackbar from "../../components/web/common/Snackbar";
import FetchFeedbackPending from "../../../flux/actions/apis/fetchfeedbackpending";
import { translate } from '../../../assets/localisation';

var file = "";
class ViewTranslate extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fetchtranslation: [],
            apiCalled: false,
            hindi: [],
            english: [],
            hindi_score: [],
            english_score: [],
            file: {},
            corpus_type: 'single',
            hindiFile: {},
            englishFile: {},
            open: false,
            value: '',
            filename: '',
            snack: false,
            message: '',
            //value: false

        }
        this.handleTranslatedUpload = this.handleTranslatedUpload.bind(this)
    }

    componentDidMount() {
        const { APITransport } = this.props;
        const api = new FetchFeedbackPending();
        APITransport(api);
        const apiObj = new FetchTranslations();
        APITransport(apiObj);
        this.setState({ showLoader: true })

    }

    handleSubmit = (value, filename) => {
        file = value;
        this.setState({
            open: true,
            value, filename
        });
    }

    handleRefresh() {
        const { APITransport } = this.props;
        const apiObj = new FetchTranslations();
        APITransport(apiObj);
        this.setState({ showLoader: true })
    }

    handleClickOpen = (basename) => {
        const { APITransport } = this.props;
        const apiObj = new DeleteFile(basename);
        APITransport(apiObj);
        this.setState({ open: false, showLoader: true })

        this.setState({ showLoader: true, message: this.state.filename + translate('viewTranslate.page.label.FileDeleteMessage') })
        setTimeout(() => { this.setState({ snack: true }) }, 700)
        return false;
    };

    handleClose = () => {
        this.setState({ open: false, snack: false });
    };


    handleTranslatedUpload(event, basename) {
        const { APITransport } = this.props;
        const api = new UploadTranslatedFile(basename, event.target.files[0])
        APITransport(api);
        if (Object.getOwnPropertyNames(this.state.feedbackQuestions).length !== 0) {
            history.push("/feedback-form/upload")
        }
    }

    componentDidUpdate(prevProps, nexpProps) {
        if (prevProps.fetchtranslation !== this.props.fetchtranslation) {
            this.setState({ fetchtranslation: this.props.fetchtranslation })
        }
        if (prevProps.uploadTranslated !== this.props.uploadTranslated) {
            this.componentDidMount()
        }
        if (prevProps.deletefile !== this.props.deletefile) {
            this.setState({ snack: true })
            const apiObj1 = new FetchTranslations();
            this.props.APITransport(apiObj1)
            setTimeout(() => { this.setState({ snack: false }) }, 700)
        }

        if (prevProps.feedbackQuestions !== this.props.feedbackQuestions) {

            this.setState({ feedbackQuestions: this.props.feedbackQuestions })
            if (Object.getOwnPropertyNames(this.props.feedbackQuestions).length !== 0) {
                this.setState({ value: true })
            }
        }

    }

    render() {


        const columns = [
            {
                name: "basename",
                label: translate('common.page.label.basename'),
                options: {
                    display: 'excluded',
                }
            },
            {
                name: "name",
                label: translate('common.page.label.transferFiles'),
                options: {
                    filter: true,
                    sort: true,
                }
            },
            {
                name: "created_on",
                label: translate('common.page.label.timeStamp'),
                options: {
                    filter: true,
                    sort: true,
                    sortDirection: 'asc'
                }
            },

            {
                name: "sourceLang",
                label: translate('common.page.label.sourceLanguage'),
                options: {
                    filter: true,
                    sort: true,
                }
            },

            {
                name: "targetLang",
                label: translate('common.page.label.targetLanguage'),
                options: {
                    filter: true,
                    sort: true,
                }
            },

            {
                name: "status",
                options: {
                    display: 'excluded',
                }
            },

            {
                name: "eta",
                label: translate('viewTranslate.page.label.eta'),
                options: {
                    display: 'excluded',
                }
            }, {
                name: "translate_uploaded",
                label: translate('viewTranslate.page.label.translateUpLoaded'),
                options: {
                    display: 'excluded',
                }
            },



            {
                name: "Status",
                label: translate('common.page.table.status'),
                options: {
                    filter: true,
                    sort: false,
                    empty: true,

                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            const result = tableMeta.rowData[6] * 1000 - (Date.now() - new Date(tableMeta.rowData[2]));
                            return (

                                <div style={{ width: '120px' }}>
                                    {(tableMeta.rowData[5] !== 'COMPLETED' &&tableMeta.rowData[5] !== 'FAILED' &&  tableMeta.rowData[6]) ? (result > 0 ? <div> <ProgressBar val={result} eta={tableMeta.rowData[6] * 1000} handleRefresh={this.handleRefresh.bind(this)}></ProgressBar> <Timer val={result} handleRefresh={this.handleRefresh.bind(this)} /> </div> : tableMeta.rowData[5]) : tableMeta.rowData[5]}

                                </div>
                            );
                        }

                    }
                }
            },
            {
                name: "Action",
                label: translate('common.page.label.action'),
                options: {
                    filter: true,
                    sort: false,
                    empty: true,

                    customBodyRender: (value, tableMeta, updateValue) => {
                        if (tableMeta.rowData) {
                            return (
                                <div style={{ width: '240px', marginLeft: '-20px' }}>
                                    {tableMeta.rowData[5] === 'COMPLETED' ? <Tooltip title={translate('viewTranslate.page.title.downloadSource')}><IconButton style={{color:'#233466'}} component="a" href={(process.env.REACT_APP_DOWNLOAD_URL ? process.env.REACT_APP_DOWNLOAD_URL : 'http://auth.anuvaad.org') + "/download-docx?filename=" + tableMeta.rowData[0] + '.docx'}><DeleteOutlinedIcon /></IconButton></Tooltip> : ''}
                                    {tableMeta.rowData[5] === 'COMPLETED' ? <Tooltip title={translate('viewTranslate.page.title.downloadTranslate')}><IconButton style={{color:'#233466'}} component="a" href={(process.env.REACT_APP_DOWNLOAD_URL ? process.env.REACT_APP_DOWNLOAD_URL : 'http://auth.anuvaad.org') + "/download-docx?filename=" + tableMeta.rowData[0] + '_t.docx'}><DeleteOutlinedIcon /></IconButton></Tooltip> : ''}
                                   


                                    {/* {tableMeta.rowData[5] === 'COMPLETED' ? <Tooltip title={translate('common.page.label.Edit')}><IconButton color="primary" component="span" onClick={(event) => {history.push('/interactive-editor/'+tableMeta.rowData[0])}} ><AddIcon/></IconButton></Tooltip> : ''} */}
                                    {tableMeta.rowData[5] === 'COMPLETED' ? <Tooltip title={translate('common.page.label.delete')}><IconButton style={{color:'#233466'}} component="span" onClick={(event) => { this.handleSubmit(tableMeta.rowData[0], tableMeta.rowData[1]) }} ><DeleteIcon> </DeleteIcon></IconButton></Tooltip> : ''}
                                    {tableMeta.rowData[5] === 'COMPLETED' ? <Tooltip title={translate('common.page.button.upload')}><FileUpload id={tableMeta.rowData[0]} icon={<UploadIcon style={{color:'#233466'}}/>} iconStyle={tableMeta.rowData[7] ? { color: 'green' } : null} accept=".docx" value={this.state.value} handleChange={(name, event) => this.handleTranslatedUpload(event, tableMeta.rowData[0])} /></Tooltip> : ''}

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
                    noMatch: translate('gradeReport.page.muiNoTitle.sorryRecordNotFound')
                },
                toolbar: {
                    search: translate('graderReport.page.muiTable.search'),
                    viewColumns: translate('graderReport.page.muiTable.viewColumns'),
                    filterTable: translate('graderReport.page.muiTable.filterTable'),
                },
                pagination: {
                    rowsPerPage: translate('graderReport.page.muiTable.rowsPerPages'),
                }
            },
            filterType: 'checkbox',
            download: false,
            print: false,
            filter: false,
            selectableRows: 'none',
            customSort: (data, colIndex, order) => {
                return data.sort((a, b) => { if (colIndex === 2) { return (new Date(a.data[colIndex]) < new Date(b.data[colIndex]) ? -1 : 1) * (order === 'desc' ? 1 : -1); } else { return (a.data[colIndex] < b.data[colIndex] ? -1 : 1) * (order === 'desc' ? 1 : -1); } });
            },


        };

        return (
            <div >
                <Toolbar style={{ marginLeft: "-5.4%", marginRight: "1.5%", marginTop: "20px",marginBottom:'2%' }}>
                    <Typography variant="title" color="inherit" style={{ flex: 1 }}></Typography>
                    <Fab variant="extended"  aria-label="Add" color='primary' style={{ marginLeft: '-4%', marginTop: '1%' }} onClick={() => { history.push("/doctranslate") }}>
                        <AddIcon />&nbsp;{translate('dashboard.page.heading.title')}
                    </Fab>
                </Toolbar>

                <div style={{ marginLeft: '3%', marginRight: '3%', marginTop: '1%',marginBottom:'2%' }}>
                    <MUIDataTable title={translate('common.page.title.document')} data={this.state.fetchtranslation} columns={columns} options={options} />
                </div>

                {this.state.open &&
                    <Dialog
                        open={this.state.open}
                        keepMounted
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-slide-title"
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogTitle id="alert-dialog-slide-title">
                            {translate('common.page.label.delete')}
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                {translate('viewTranslate.page.label.deleteRequest')} {this.state.filename}  {translate('viewTranslate.page.label.file')}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary">{translate('common.page.label.no')}</Button>
                            <Button onClick={(event) => { this.handleClickOpen(file) }} color="primary">{translate('common.page.label.yes')}</Button>
                        </DialogActions>
                    </Dialog>
                }


                {this.state.snack && (
                    <Snackbar
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                        open={this.state.open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        variant="success"
                        message={this.state.message}
                    />
                )}

            </div>

        );
    }
}

const mapStateToProps = state => ({
    user: state.login,
    apistatus: state.apistatus,
    fetchtranslation: state.fetchtranslation,
    uploadTranslated: state.uploadTranslated,
    deletefile: state.deletefile,
    feedbackQuestions: state.feedbackQuestions
});

const mapDispatchToProps = dispatch => bindActionCreators({
    APITransport,
    CreateCorpus: APITransport,
}, dispatch);


export default withRouter((connect(mapStateToProps, mapDispatchToProps)(ViewTranslate)));
