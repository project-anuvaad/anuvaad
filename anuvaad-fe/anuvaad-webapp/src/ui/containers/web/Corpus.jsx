import React from 'react';
import { withRouter } from 'react-router-dom';
import ReadMoreAndLess from 'react-read-more-less';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import APITransport from '../../../flux/actions/apitransport/apitransport';
import Filter from "@material-ui/icons/FilterList";
import FetchSentences from "../../../flux/actions/apis/sentences";
import UpdateSentences from "../../../flux/actions/apis/update_sentences";
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Accept from '@material-ui/icons/Spellcheck';
import Close from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import Input from "@material-ui/core/Input";
import Tooltip from '@material-ui/core/Tooltip';
import UpdateSentencesStatus from "../../../flux/actions/apis/update-sentenses-status";
import SourceTranslate from "../../../flux/actions/apis/source-translate";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { blueGrey50, darkBlack } from "material-ui/styles/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Collapse from '@material-ui/core/Collapse';
import Button from "@material-ui/core/Button";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Pagination from "material-ui-flat-pagination";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Select from '@material-ui/core/Select';
import Toolbar from '@material-ui/core/Toolbar';
import { translate } from '../../../assets/localisation';

const theme = createMuiTheme();
class Corpus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '',
            apiCalled: false,
            hindi: [],
            english: [],
            hindi_score: [],
            english_score: [],
            file: {},
            corpus_type: 'single',
            hindiFile: {},
            englishFile: {},
            sentences: [],
            download: false,
            downloadData: [],
            pageCount: 5,
            status: '',
            AcceptColor: 'blue',
            EditColor: 'blue',
            CloseColor: 'blue',
            offset: 0,
            stat: 'PENDING',
            lock: false,
            anchorEl: '',
            inputStatus: 'ALL',
            backColor: 'Grey',
            edited: true,
            MenuItemValues: ['ALL', 'ACCEPTED', "REJECTED", "EDITED", "PENDING", "PROCESSING"],
            MenuFilterValues: ['ALL', 'RED', 'YELLOW', 'GREEN'],
            openDialog: false,
            openExpand: false,
            sourceTranslate: '',
            filterSelect: null,
            accuracy: 'ALL'
        }
    }

    componentDidMount() {

        if (this.props.match.params.basename) {
            let api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, 1)
            this.props.APITransport(api);
        }


    }

    handleChangePage = (event, offset) => {
        this.setState({ offset, lock: false });
        if (this.props.match.params.basename) {
            let api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, offset + 1, this.state.inputStatus)
            this.props.APITransport(api);

        }

    };

    handleFilter = (inputStatus) => {

        let accuracy = inputStatus.item === 'RED' ? 'bad' : inputStatus.item === 'YELLOW' ? 'medium' : inputStatus.item === 'GREEN' ? 'good' : inputStatus
        if (accuracy === inputStatus) {
            this.setState({
                inputStatus,
                anchorEl: null,
                filterSelect: null
            })
            if (this.props.match.params.basename) {


                let api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, 1, inputStatus, this.state.accuracy)
                this.props.APITransport(api);
            }
        } else {
            this.setState({
                accuracy,
                filterSelect: null
            })
            if (this.props.match.params.basename) {
                let api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, 1, this.state.inputStatus, accuracy)
                this.props.APITransport(api);
            }
        }
    };


    handleActionButton(index, action) {
        let sentences = this.state.sentences;

        sentences[index].isEditable = false
        sentences[index].status = action === "ACCEPTED" ? 'ACCEPTED' : (action === 'REJECTED' ? 'REJECTED' : '')
        this.setState({ backColor: 'green' })
        this.setState({
            sentences: sentences,
            status: action,
            download: false,
            lock: false
        })
        if (!action) {
            let api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, this.state.offset + 1, this.state.inputStatus)
            this.props.APITransport(api);
        }
        else {
            let api = new UpdateSentencesStatus(sentences[index])
            this.props.APITransport(api);
        }
    }

    handleSaveButton(index) {
        let sentences = this.state.sentences
        sentences[index].isdialog = false
        sentences[index].isEditable = false
        sentences[index].status = "EDITED"
        this.setState({
            openExpand: false,
            openDialog: false,
            lock: false,
            sentences: sentences,

            download: false
        })
        let api = new UpdateSentences(sentences[index])
        this.props.APITransport(api);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.corpus !== this.props.corpus) {
            this.setState({
                hindi: this.props.corpus.hindi,
                english: this.props.corpus.english
            })
        }
        if (prevProps.sentences !== this.props.sentences) {
            this.setState({

                sentences: this.props.sentences.data,
                sentenceCancel: this.props.sentences.data,
                count: this.props.sentences.count
            })
        }
        if (prevProps.sourceTranslate !== this.props.sourceTranslate) {
            this.setState({
                sourceTranslate: this.props.sourceTranslate.data[0]
            })
        }
    }

    handleSelectChange = event => {
        this.setState({ pageCount: event.target.value, offset: 0 });
        let api = new FetchSentences(this.props.match.params.basename, event.target.value, 1, this.state.inputStatus)
        this.props.APITransport(api);
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleFileChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                file: e.target.files[0],
            });
        }
    }

    handleMultiFileChange = (e) => {
        if (e.target.files[0]) {
            this.setState({
                [e.target.name]: e.target.files[0],
            });
        }
    }

    handleEditButton(index) {
        let sentences = this.state.sentences
        sentences[index].isEditable = true
        this.setState({
            sentences: sentences,
            lock: true
        })
    }

    handleTextChange(value, index, key) {
        let sentences = this.state.sentences
        sentences[index][key] = value
        this.setState({
            sentences: sentences
        })
    }

    handleSelect(event) {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleAlignSelect(event) {

        this.setState({ filterSelect: event.currentTarget });
    };

    handleClose = () => {

        this.setState({ anchorEl: null, openDialog: false, filterSelect: null });
    };

    handleDialogClose = (index) => {
        let sentences = this.state.sentences
        sentences[index].isdialog = false
        this.setState({ openDialog: false, openExpand: false, sourceTranslate: '' });
        let api = new FetchSentences(this.props.match.params.basename, this.state.pageCount, this.state.offset + 1, this.state.inputStatus)
        this.props.APITransport(api);
    };

    handleOpen = (index) => {

        let sentences = this.state.sentences
        sentences[index].isdialog = true
        this.setState({ openDialog: true });
    };

    handleSourceTranslate = (source) => {
        this.setState({
            openExpand: true
        })
        let api = new SourceTranslate(this.props.match.params.basename, source)
        this.props.APITransport(api);
    };
    handleColor(color) {
        //let color1 = 'grey'
        return color === 'ACCEPTED' ? 'green' : (color === 'EDITED' ? '#2c6b96' : (color === "REJECTED" ? "red" : (color === "PROCESSING" ? '#f1de7f' : (color === "PENDING" ? 'grey' : ''))))
    }

    colorValidate = (e, ocrValue, status) => {
        let splitRow;
        let word;
        let colorWord = [];
        if (ocrValue && ocrValue.length > 0 && (status !== "EDITED") && (status !== "ACCEPTED")) {
            splitRow = e.split(' ')
            for (word in ocrValue) {
                if (ocrValue[word] >= 70) {
                    colorWord.push(<span><span>{splitRow[word]}</span><span>{" "}</span></span>)
                }

                else {
                    colorWord.push(<span><span style={{ textDecoration: 'Underline', textDecorationColor: 'red', textDecorationStyle: 'wavy' }}>{splitRow[word]}</span><span>{" "}</span></span>)
                }
            }
            return colorWord;
        }
        return e;

    }

    handleClickExpand(event, value) {
        this.setState({ openExpand: event })
        if (this.state.sourceTranslate === "") {
            this.setState({
                sourceTranslate: value
            })
        }
    }


    render() {

        const CorpusDetails = <TableBody>
            {this.state.sentences && Array.isArray(this.state.sentences) && this.state.sentences.map((row, index) => (
                <TableRow key={index} hover={true} >
                    <TableCell component="th" scope="row" whiteSpace='nowrap' width="35%">
                        {row.isEditable ? <Input id="email" style={{ width: '100%' }} multiline rowsMax="4" floatingLabelText="E-mail" value={row.source} onChange={(event) => { this.handleTextChange(event.target.value, index, 'source') }} /> : <ReadMoreAndLess
                            ref={this.ReadMore}
                            className="read-more-content"
                            charLimit={145}
                            readMoreText={translate('commonCorpus.page.text.readMore')}
                            readLessText=""
                        >
                            {this.colorValidate(row.source, row.source_ocr_words, row.status)}
                        </ReadMoreAndLess>}
                    </TableCell>
                    <TableCell width="35%">
                        {row.isEditable ? <Input id="email" style={{ width: '100%' }} multiline rowsMax="4" floatingLabelText="E-mail" value={row.target} onChange={(event) => { this.handleTextChange(event.target.value, index, 'target') }} /> : <ReadMoreAndLess
                            ref={this.ReadMore}
                            className="read-more-content"
                            charLimit={130}
                            readMoreText={translate('commonCorpus.page.text.readMore')}
                            readLessText=""
                        >
                            {this.colorValidate(row.target, row.target_ocr_words, row.status)}
                        </ReadMoreAndLess>}
                    </TableCell>

                    {/* <TableCell align="right" width="10%">
                        {row.alignment_accuracy === 'GAPFILLER\n' || row.alignment_accuracy === 'GALECHURCH\n' ?
                            <span variant="fab" style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'inline-block', backgroundColor: 'red', marginRight: '50px' }} />
                            : (row.alignment_accuracy === 'BLEU\n' ? <span style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'inline-block', marginRight: '50px', backgroundColor: 'yellow' }}>    </span>
                                : <span style={{ width: '35px', height: '35px', borderRadius: '50%', display: 'inline-block', backgroundColor: 'green', marginRight: '50px' }}>    </span>)}
                    </TableCell> */}

                    <TableCell width="10%">

                        <div style={{ width: '95px' }}>

                            <Tooltip title={translate('common.page.title.accept')} disableTriggerFocus={true}><Accept style={{ cursor: 'pointer', marginRight: '5px', color: "green" }} onClick={() => {
                                !this.state.lock && this.handleActionButton(index, "ACCEPTED")

                            }} />
                            </Tooltip>
                            <Tooltip title={translate('common.page.title.edit')} disableTriggerFocus={true}><EditIcon style={{ cursor: 'pointer', marginRight: '5px', color: '#335995', fontSize: '30px' }} onClick={() => {
                                this.handleOpen(index)
                            }}
                            /></Tooltip>
                            {row.isdialog ?
                                <Dialog
                                    open={this.state.openDialog}
                                    onClose={this.handleClose}
                                    disableBackdropClick
                                    disableEscapeKeyDown
                                    fullWidth
                                    aria-labelledby="form-dialog-title">
                                    <Typography variant="h5" style={{ color: darkBlack, background: blueGrey50, paddingLeft: '12%', paddingBottom: '12px', paddingTop: '8px' }} >{translate("parallel_corpus.page.dialog.message")}</Typography>

                                    <DialogContent>
                                        <DialogContentText /><br />
                                        <Typography variant="h6" gutterBottom>
                                            {translate('commonCorpus.page.text.sourceSentence')}
                                        </Typography>

                                        <Paper style={{ paddingTop: '12px', paddingLeft: '5px' }}>
                                            <div style={{ color: "blue" }}>
                                                <Input id="email" style={{ width: '100%' }} multiline floatingLabelText="E-mail" value={row.source} onChange={(event) => { this.handleTextChange(event.target.value, index, 'source') }} /></div></Paper><br />
                                        <div style={{ marginLeft: '63%' }}>
                                            <Button onClick={() => { this.handleSourceTranslate(row.source) }} variant="contained" color="primary">
                                                {translate('commonCorpus.page.button.machineTranslate')}
                                            </Button>
                                        </div>
                                        <Typography variant="h6" gutterBottom>
                                            {translate('commonCorpus.page.text.targetSentence')}
                                        </Typography>

                                        <Paper style={{ paddingTop: '12px', paddingLeft: '5px' }}>
                                            <Input id="email" style={{ width: '100%' }} multiline floatingLabelText="E-mail" value={row.target} onChange={(event) => { this.handleTextChange(event.target.value, index, 'target') }} />
                                        </Paper><br />
                                        <Paper>
                                            <div style={{ background: "#D3D3D3", paddingBottom: '15px', paddingTop: '12px', paddingLeft: '5px' }}>
                                                <div>
                                                    <Typography variant="h6" gutterBottom style={{}}>
                                                        {translate('commonCorpus.page.text.machineTranslatedReference')} &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                                                {this.state.openExpand ? <Tooltip title={translate('corpus.page.title.expand')} disableTriggerFocus={true}><ExpandMore style={{ color: 'blue' }} onClick={() => {
                                                            this.handleClickExpand(false)
                                                        }} /></Tooltip> : <Tooltip title={translate('corpus.page.title.expand')} disableTriggerFocus={true}><ExpandLess style={{ color: 'blue' }} onClick={() => {
                                                            this.handleClickExpand(true, row.translation)
                                                        }} /></Tooltip>}
                                                    </Typography> </div>

                                                <Collapse in={this.state.openExpand} timeout="auto" unmountOnExit>
                                                    <span style={{ fontFamily: '"Source Sans Pro", "Arial", sans-serif' }}>{this.state.sourceTranslate}</span>
                                                </Collapse>


                                            </div>
                                        </Paper>
                                    </DialogContent>
                                    <DialogActions style={{ marginRight: '22px' }}>
                                        <Button onClick={() => { this.handleDialogClose(index) }} variant="contained" color="primary">
                                            {translate('common.page.button.cancel')}
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={() => { this.handleSaveButton(index) }}>
                                            {translate('common.page.button.save')}
                                        </Button>
                                    </DialogActions>
                                </Dialog> : ''
                            }

                            <Tooltip title={translate('corpus.page.title.reject')} disableTriggerFocus={true}><Close style={{ cursor: 'pointer', marginRight: '5px', color: "red" }} onClick={() => {
                                !this.state.lock && this.handleActionButton(index, "REJECTED")
                            }} /></Tooltip>
                        </div>

                    </TableCell>


                    <TableCell width="10%">
                        <div style={{ backgroundColor: this.handleColor(row.status), width: '105px', paddingTop: '7px', textAlign: 'center', paddingBottom: '7px', color: 'white' }}>{row.status}</div>
                    </TableCell>

                </TableRow>
            ))}
        </TableBody>

        return (

            <div>

                <Menu
                    id="simple-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(this.state.anchorEl)}
                    onClose={this.handleClose}>
                    {this.state.MenuItemValues.map((item) => (
                        <MenuItem value={item} onClick={() => { this.handleFilter({ item }) }}>{item}</MenuItem>
                    ))}
                </Menu>
                <Menu
                    id="simple-menu"
                    anchorEl={this.state.filterSelect}
                    open={Boolean(this.state.filterSelect)}
                    onClose={this.handleClose}>
                    {this.state.MenuFilterValues.map((item) => (
                        <MenuItem value={item} onClick={() => { this.handleFilter({ item }) }}>{item}</MenuItem>
                    ))}
                </Menu>

                <Grid container spacing={24} style={{ padding: 5 }}>
                    <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginTop: '20px', margin: '0% 3%' }}>

                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="right"
                        >

                        </Grid>
                    </Grid>


                    <Grid item xs={12} sm={12} lg={12} xl={12} style={{ margin: '3%', padding: '0px' }}>
                        <Toolbar style={{ marginRight: '-1.2%' }}>


                            <Typography variant="title" color="inherit" style={{ flex: 1 }}>

                            </Typography>
                            <Typography variant="h8" gutterBottom>
                                {translate('common.page.text.rowsPerPage')}

                                &nbsp;&nbsp;&nbsp;&nbsp;
          <Select
                                    width="50%"
                                    value={this.state.pageCount}
                                    onChange={this.handleSelectChange}
                                    displayEmpty
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={100}>100</MenuItem>
                                </Select>
                            </Typography>


                        </Toolbar>
                        <Paper >

                            <MuiThemeProvider theme={theme}>
                                <CssBaseline />
                                {/* <CsvDownloader
                                    filename="myfile"
                                    separator=";"

                                    datas={this.state.sentences}
                                    text={translate('common.page.text.download')} /> */}
                                <Pagination
                                    align='right'
                                    limit={1}
                                    offset={this.state.offset}
                                    total={this.state.count / this.state.pageCount}
                                    onClick={(event, offset) => { this.handleChangePage(event, offset) }}
                                />
                            </MuiThemeProvider>

                            <Divider />
                            <Table >
                                <TableHead>
                                    <TableRow>


                                        <TableCell width="35%">{translate('commonCorpus.page.text.sourceSentence')}</TableCell>
                                        <TableCell width="35%">{translate('commonCorpus.page.text.targetSentence')}</TableCell>
                                        {/* <TableCell width="27%">Machine translated reference </TableCell> */}
                                        {/* <TableCell width='10%' align="left" >
                                            <Grid container spacing={24} style={{ padding: 5 }}>
                                                <Grid item xs={8} sm={9} lg={9} xl={9}>
                                                    {translate('corpus.page.text.alignmentAccuracy')}
                                                </Grid>
                                                <Grid item xs={4} sm={3} lg={3} xl={3} >
                                                    <Filter onClick={(event) => {
                                                        this.handleAlignSelect(event)
                                                    }} />
                                                </Grid>
                                            </Grid>
                                        </TableCell> */}
                                        <TableCell width="10%">{translate('common.page.label.action')}</TableCell>
                                        <TableCell width="10%"><div>
                                            <Grid container spacing={24} >
                                                <Grid item xs={6} sm={6} lg={6} xl={6} style={{ paddingTop: '17px' }}>

                                                    {translate("common.page.table.status")}
                                                </Grid>
                                                <Grid item xs={6} sm={6} lg={6} xl={6}>
                                                    <Filter onClick={(event) => {
                                                        this.handleSelect(event)
                                                    }} />
                                                </Grid></Grid>
                                        </div></TableCell>
                                    </TableRow>
                                </TableHead>
                                {CorpusDetails}
                            </Table>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.login,
    apistatus: state.apistatus,
    corpus: state.corpus,
    sentences: state.sentences,
    sourceTranslate: state.source_translate
});

const mapDispatchToProps = dispatch => bindActionCreators({
    APITransport,
    CreateCorpus: APITransport,
}, dispatch);


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Corpus));
