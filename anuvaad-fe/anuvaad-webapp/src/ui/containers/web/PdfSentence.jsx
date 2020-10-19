import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import FetchPdfSentence from "../../../flux/actions/apis/fetchpdfsentence";
import { withStyles } from "@material-ui/core/styles";
import NewCorpusStyle from "../../styles/web/Newcorpus";
import Typography from "@material-ui/core/Typography";
import MUIDataTable from "mui-datatables";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import { translate } from '../../../assets/localisation';
import Input from "@material-ui/core/Input";
import Paper from '@material-ui/core/Paper';

class PdfUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
      role: JSON.parse(localStorage.getItem("roles"))
    };
  }

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new FetchPdfSentence(this.props.match.params.session_id);
    APITransport(apiObj);
    this.setState({ showLoader: true });
  }

  handleClick = () => {
    
    this.setState({dialog: true})
    
  };
  handleDialogClose = () => {
    // let sentences = this.state.sentences
    // sentences[index].isdialog = false
    this.setState({ dialog: false, sourceTranslate: '' });
   
};

handleSaveButton() {
    
    this.setState({
       
        dialog: false
    })
    
}

  handleTextChange(event) {
    this.setState({text: event.target.value})
}

handleRowClick = rowData => {
    this.setState({text:rowData[1]})
    
  };

  componentDidUpdate(prevProps) {
    if (prevProps.fetchPdfSentence !== this.props.fetchPdfSentence) {
      this.setState({ sentences: this.props.fetchPdfSentence });
    }
  }

  render() {
    const columns = [
      {
        name: "_id",
        label: translate('common.page.label.basename'),
        options: {
          display: "excluded"
        }
      },
      {
        name: "text",
        label: translate('common.page.label.sentence'),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "page_no",
        label: translate('common.page.label.page_no'),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "status",
        label: translate("common.page.table.status"),
        options: {
          filter: true,
          sort: true
        }
       },
    //   {
    //     name: "Action",
    //     label: translate('common.page.label.action'),
    //     options: {
    //         filter: true,
    //         sort: false,
    //         empty: true,

    //         customBodyRender: (value, tableMeta, updateValue) => {
    //             if (tableMeta.rowData) {
    //                 return (
    //                     <div style={{ width: '240px', marginLeft: '-20px' }}>

    //                         { <Tooltip title={"Edit"}><IconButton color="primary" component="a" onClick={(event) => { this.handleClick() }}><EditIcon /></IconButton></Tooltip> }
    //                         {/* {<Tooltip title={translate('viewTranslate.page.title.downloadTranslate')}><IconButton color="primary" component="a"><DeleteOutlinedIcon /></IconButton></Tooltip> }
    //                          {<Tooltip title="View"><IconButton style={{ width: "24", height: "24",cursor:'pointer', marginLeft:'10%',marginRight:'8%' }} onClick={()=>{history.push('/view-doc/'+tableMeta.rowData[0])} } > </IconButton></Tooltip>}
    //                         {<Tooltip title={translate('common.page.label.delete')}><IconButton color="primary" component="span" onClick={(event) => { this.handleSubmit() }} ><DeleteIcon> </DeleteIcon></IconButton></Tooltip>}
    //                          */}
    //                     </div>
    //                 );
    //             }

    //         }
    //     }
    // }


      
    ];

    const options = {
      textLabels: {
        body: {
          noMatch: translate('gradeReport.page.muiNoTitle.sorryRecordNotFound')
        },
        toolbar: {
          search: translate('graderReport.page.muiTable.search'),
          viewColumns: translate('graderReport.page.muiTable.viewColumns')
        },
        pagination: {
          rowsPerPage: translate('graderReport.page.muiTable.rowsPerPages'),
        }
      },
      filterType: "checkbox",
      onRowClick: rowData => this.handleRowClick(rowData),
      download: false,
      
      print: false,
      
      filter: false,
      selectableRows: "none"
    };

    return (
      <div>
       
        <div style={{ marginLeft: "-4%", marginRight: "3%", marginTop: "40px" }}>
          <MUIDataTable title={translate('common.page.title.document')} data={this.state.sentences} columns={columns} options={options} />
        </div>
{this.state.dialog &&
        <Dialog
                                    open={this.state.dialog}
                                    onClose={this.handleClose}
                                    disableBackdropClick
                                    disableEscapeKeyDown
                                    fullWidth
                                    aria-labelledby="form-dialog-title">
                                    <Typography variant="h5" style={{ color: '#000000', background: '#ECEFF1', paddingLeft: '12%', paddingBottom: '12px', paddingTop: '8px' }} >Source Sentence</Typography>

                                    <DialogContent>
                                        <DialogContentText /><br />
                                        

                                        <Paper style={{ paddingTop: '12px', paddingLeft: '5px' }}>
                                            <div style={{ color: "blue" }}>
                                                <Input id="email" style={{ width: '100%' }} multiline floatingLabelText="E-mail" value={this.state.text} onChange={(event) => { this.handleTextChange(event) }} /></div></Paper><br />
                                        <div style={{ marginLeft: '63%' }}>
                                        <DialogActions style={{ marginRight: '22px' }}>
                                        <Button onClick={() => { this.handleDialogClose() }} variant="contained" color="primary">
                                            {translate('common.page.button.cancel')}
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={() => { this.handleSaveButton() }}>
                                            {translate('common.page.button.save')}
                                        </Button>
                                    </DialogActions>
                                        </div>
                            </DialogContent>
                </Dialog>
  }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  fetchPdfSentence: state.fetchPdfSentence
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(NewCorpusStyle)(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(PdfUpload)
  )
);
