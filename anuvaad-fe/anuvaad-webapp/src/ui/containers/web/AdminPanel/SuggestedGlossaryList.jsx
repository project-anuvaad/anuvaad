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
import Header from './SuggestedGlossaryListHeader';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import EditIcon from '@material-ui/icons/Edit';
import Spinner from "../../../components/web/common/Spinner";
import Snackbar from "../../../components/web/common/Snackbar";
import FetchSuggestions from "../../../../flux/actions/apis/organization/fetch_glossary_suggestions";
import DeleteSuggestedGlossary from "../../../../flux/actions/apis/organization/delete_glossary_suggestion";
import CreateOrgGlossary from "../../../../flux/actions/apis/organization/create_org_glossary";
import UpdateSuggestedGlossaryStatus from "../../../../flux/actions/apis/organization/update_glossary_suggestion_status";
import DataTable from "../../../components/web/common/DataTable";
import ConfirmBox from "../../../components/web/common/ConfirmBox";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { IndicTransliterate } from "@ai4bharat/indic-transliterate";

var delete_glossary = require("../../../../utils/deleteSuggestions.operation");

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

class SuggestedGlossaryList extends React.Component {
  constructor(props) {
    super(props);
    this.orgID = this.props.match.params.orgId;
    this.userID = JSON.parse(localStorage.getItem("userProfile")).userID;
    this.state = {
      loading: false,
      open: false,
      showMessage: false,
      message: "",
      variant: 'success',
      loadMsg: "",
      rowsToDelete: [],
      openConfirmDialog: false,
      openSingleSuggestionDeleteConfirmBox: false,
      singleDeletionArr: [],
      updateObj: [],
      showUpdateModal: false
    }
  }



  getSuggestedGlossary = () => {
    const { APITransport } = this.props

    let apiObj = new FetchSuggestions([], [], this.orgID ? [this.orgID] : [], [], false, 0, 0, [], [], ["Pending"]);
    APITransport(apiObj)
  }
  componentDidMount() {

    // if (this.props.glossaryData.count === 0) {
    this.setState({ loading: true })
    this.getSuggestedGlossary();
    // console.log("this.props.suggestedGlossaryData", this.props.suggestedGlossaryData)

    // }
    // console.log("this.props.match.params.orgId", this.props.match.params.orgId)
  }
  componentDidUpdate(prevProps) {
    if (this.props.suggestedGlossaryData.hasOwnProperty("deleted") && !this.props.suggestedGlossaryData.delete && this.state.loading) {
      this.setState({ loading: false })
    }
    if (prevProps.suggestedGlossaryData.count > this.props.suggestedGlossaryData.count && this.props.suggestedGlossaryData.deleted) {
      this.state.showMessage && this.setState({ open: true, message: 'Glossary suggestion deleted successfully', variant: 'success' }, () => {
        setTimeout(() => this.setState({ open: false, message: "", variant: "info" }), 3000)
      })
    }
  }

  makeCreateGlossaryAPICall = (orgID, src, tgt, locale, uuId, createdOn) => {
    this.setState({ open: true, variant: 'info', message: "Suggestion accepting...", loading: true })
    let apiObj = new CreateOrgGlossary(orgID, src, tgt, locale, 'JUDICIARY')
    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    })
      .then(async res => {
        if (res.ok) {
          this.updateSuggestionStatusAPICall([], [uuId], false, [this.orgID], "Approved", false);
          this.setState({ open: true, variant: 'success', message: "Suggestion accepted Successfully...", loading: false })
        } else {
          this.setState({ open: true, variant: 'error', message: "Error in accepting suggestion...", loading: false })
        }
      })
  }

  updateSuggestionStatusAPICall = (userIds, uuIds, deleteAll, orgIds, status, showMessage, srcText, tgtText) => {
    this.setState({ open: true, message: 'Glossary suggestion deletion in progress...', variant: 'info', openConfirmDialog: false, showMessage })
    // console.log("userIds, uuIds, deleteAll, orgIds");
    // console.log(userIds, uuIds, deleteAll, orgIds);
    let apiObj = new UpdateSuggestedGlossaryStatus(uuIds, status, srcText, tgtText);
    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
      .then(async res => {
        if (res.ok) {
          this.getSuggestedGlossary();
          this.setState({ open: false })
        } else {
          this.setState({ open: true, message: 'Glossary deletion failed', variant: 'error' })
          return false;
        }
      })
  }

  handleAcceptSuggestion = (dataArray) => {
    console.log("dataArray", dataArray);
    // console.log("this.props.suggestedGlossaryData", this.props.suggestedGlossaryData)
    this.makeCreateGlossaryAPICall(dataArray[2], dataArray[0], dataArray[1], dataArray[4], dataArray[6], dataArray[5]);
  }

  handleDeleteSuggestion = (dataArray) => {
    // console.log("dataArray", dataArray);
    // let reverseLocale = dataArray[3].split("|").reverse().join("|");
    this.updateSuggestionStatusAPICall([], [dataArray[6]], false, [this.orgID], "Rejected", true);
    this.setState({ openSingleSuggestionDeleteConfirmBox: false, singleDeletionArr: [] })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  deleteMultipleRows = () => {
    // let isOrg = delete_glossary.isOrg(this.props.suggestedGlossaryData, this.state.rowsToDelete)
    let rowsToBeDeleted = delete_glossary.getBulkDeletionArray(this.props.suggestedGlossaryData, this.state.rowsToDelete)
    // console.log("rowsToBeDeleted", rowsToBeDeleted);
    let IdArrOfSelectedRows = rowsToBeDeleted?.map((el, index) => {
      return el.id
    });

    this.updateSuggestionStatusAPICall([], IdArrOfSelectedRows, false, [this.orgID], "Rejected", true);
  }

  renderSingleGlossaryConfirmBox = () => {
    return (
      <div style={{ textAlign: "end", marginBottom: "1rem" }}>
        <ConfirmBox
          open={this.state.openSingleSuggestionDeleteConfirmBox && this.state.singleDeletionArr.length > 0}
          onClose={() => this.setState({ openSingleSuggestionDeleteConfirmBox: false })}
          title="Delete glossary"
          contentText={"Are you sure you want to delete ` " + this.state.singleDeletionArr[0] + " - " + this.state.singleDeletionArr[1] + " ` glossary suggestion?"}
          onConfirm={() => this.handleDeleteSuggestion(this.state.singleDeletionArr)}
        />
      </div>
    )
  }

  handleUpdateModalToggle = (val) => {
    this.setState({ showUpdateModal: val });
  }

  onConfirmUpdateSuggestion = (obj) => {
    this.handleUpdateModalToggle(false);
    this.updateSuggestionStatusAPICall([], [this.state.updateObj[6]], false, [], "Modified", false, this.state.updateObj[0], this.state.updateObj[1]);
    setTimeout(() => {
      this.handleAcceptSuggestion(this.state.updateObj);
    }, 1500);
    
  }

  render() {
    const columns = [
      {
        name: "src",
        label: translate("common.page.label.source"),
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "tgt",
        label: translate("common.page.label.target"),
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "orgID",
        label: "orgID",
        options: {
          filter: false,
          sort: false,
          display: localStorage.getItem("roles").includes("SUPERADMIN") ? true : 'excluded',
        },
      },
      {
        name: "userID",
        label: "User ID",
        options: {
          filter: false,
          sort: false,
          display: 'excluded'
        },
      },
      {
        name: "locale",
        label: "Locale",
        options: {
          filter: false,
          sort: false,
          display: 'excluded'
        },
      },
      {
        name: "createdOn",
        label: "createdOn",
        options: {
          filter: false,
          sort: false,
          display: 'excluded'
        },
      },
      {
        name: "uuid",
        label: "uuid",
        options: {
          filter: false,
          sort: false,
          display: 'excluded'
        },
      },
      {
        name: "status",
        label: "Status",
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "context",
      //   label: "Context",
      //   options: {
      //     filter: false,
      //     sort: false,
      //     display: 'excluded'
      //   },
      // },
      // {
      //   name: "typeOfGlossary",
      //   label: "Glossary Type",
      //   option: {
      //     filter: false,
      //     sort: false
      //   }
      // },
      {
        name: "Action",
        label: translate("common.page.label.action"),
        filter: true,
        options: {
          sort: false,
          empty: true,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  <Tooltip title="Accept Glossary" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() => this.handleAcceptSuggestion(tableMeta.rowData)}
                    // disabled={tableMeta.rowData[5] === "Organization"}
                    >
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Suggestion" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() => {
                        console.log("tableMeta.rowData ---- ", tableMeta.rowData);
                        this.setState({ updateObj: tableMeta.rowData }, () => {
                          this.handleUpdateModalToggle(true);
                        })
                      }
                      }
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject Glossary" placement="left">
                    <IconButton
                      style={{ color: "#233466", padding: "5px" }}
                      component="a"
                      onClick={() => this.setState({ singleDeletionArr: tableMeta.rowData, openSingleSuggestionDeleteConfirmBox: true })}
                    // onClick={() => this.handleDeleteSuggestion(tableMeta.rowData)}
                    // disabled={tableMeta.rowData[5] === "Organization"}
                    >
                      <CloseIcon />
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
          noMatch: translate("gradeReport.page.muiNoTitle.sorryRecordNotFound"),
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
      count: this.props.suggestedGlossaryData.count,
      filterType: "checkbox",
      download: this.props.suggestedGlossaryData.result.length > 0 ? true : false,
      print: false,
      fixedHeader: true,
      filter: false,
      sortOrder: {
        name: "timestamp",
        direction: "desc",
      },
      onRowSelectionChange: (currentSelectedRows, allRowsSelected, rowsSelected) => {
        this.setState({ rowsToDelete: allRowsSelected })
      },
      onRowsDelete: () => {
        this.deleteMultipleRows()
      }
    };

    return (
      <div style={{}}>
        <div style={{ margin: "0% 3% 3% 3%", paddingTop: "2%" }}>
          <Header />
          {this.state.loading ?
            <Spinner />
            :
            <MuiThemeProvider theme={getMuiTheme()}>
              {/* {this.renderDeleteAllGlossaryButton()} */}
              <DataTable
                title={translate("common.page.title.suggestion")}
                columns={columns}
                options={options}
                data={this.props.suggestedGlossaryData.result}
              />
              {this.renderSingleGlossaryConfirmBox()}
            </MuiThemeProvider>
          }
        </div>
        {this.state.open &&
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            autoHideDuration={3000}
            onClose={this.handleClose}
            variant={this.state.variant}
          />
        }
        <Dialog
          open={this.state.showUpdateModal}
          onClose={() => this.handleUpdateModalToggle(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{ elevation: 0 }}
        >
          <DialogTitle id="alert-dialog-title">Update Suggestion</DialogTitle>

          <DialogContent>
            <div 
            style={{height: window.innerHeight*0.3}}
            >
              {
              this.state.updateObj[4]?.split("|")[0] === "en" ? 
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Source Text"
                type="text"
                fullWidth
                value={this.state.updateObj[0]}
                onChange={(e)=>{
                  let updatedArr = this.state.updateObj;
                  updatedArr[0] = e.target.value
                  this.setState({ updateObj: updatedArr })
                }}
              /> : 
              <IndicTransliterate
                renderComponent={(props) => {
                  const inputRef = props.ref;
                  delete props["ref"];
                  return (<TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Source Text"
                    type="text"
                    fullWidth
                    inputRef={inputRef}
                    {...props}
                  />)
                }
                }
                value={this.state.updateObj[0]}
                onChangeText={(text) => {
                  let updatedArr = this.state.updateObj;
                  updatedArr[0] = text
                  this.setState({ updateObj: updatedArr })
                  // this.setState({ text: text })
                }}
                lang={this.state.updateObj[4]?.split("|")[0]}
              />
            }

            <br />
            {
              this.state.updateObj[4]?.split("|")[1] === "en" ? <TextField
                margin="dense"
                id="name"
                label="Target Text"
                type="text"
                fullWidth
                value={this.state.updateObj[1]}
                onChange={(e)=>{
                  let updatedArr = this.state.updateObj;
                  updatedArr[1] = e.target.value
                  this.setState({ updateObj: updatedArr })
                }}
              /> : <IndicTransliterate
              renderComponent={(props) => {
                const inputRef = props.ref;
                delete props["ref"];
                return (<TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="Source Text"
                  type="text"
                  fullWidth
                  inputRef={inputRef}
                  {...props}
                />)
              }
              }
              value={this.state.updateObj[1]}
              onChangeText={(text) => {
                let updatedArr = this.state.updateObj;
                updatedArr[1] = text
                this.setState({ updateObj: updatedArr })
                // this.setState({ text: text })
              }}
              lang={this.state.updateObj[4]?.split("|")[1]}
            />
            }
            </div>
            

          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.onConfirmUpdateSuggestion()} style={{ textTransform: "none" }} color="primary">
              Update
            </Button>
            <Button onClick={() => this.handleUpdateModalToggle(false)} style={{ textTransform: "none" }} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  suggestedGlossaryData: state.fetchSuggestedGlossaryList,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(NewCorpusStyle)(
    connect(mapStateToProps, mapDispatchToProps)(SuggestedGlossaryList)
  )
);