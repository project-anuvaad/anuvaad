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
import Header from './OrganizationGlossaryHeader';
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import DeleteIcon from "@material-ui/icons/Delete";
import ViewGlossary from '../../../../flux/actions/apis/organization/fetch_organization_glossary';
import Spinner from "../../../components/web/common/Spinner";
import Snackbar from "../../../components/web/common/Snackbar";
import DeleteOrgGlossary from "../../../../flux/actions/apis/organization/delete_org_glossary";
import clearOrgGlossary from "../../../../flux/actions/apis/organization/clearOrgGlossary";
import { Button } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteTmx from "../../../../flux/actions/apis/tmx/tmxDelete";
import DataTable from "../../../components/web/common/DataTable";
import ConfirmBox from "../../../components/web/common/ConfirmBox";
import { CustomTableFooter } from "../../../components/web/common/CustomTableFooter";

var delete_glossary = require("../../../../utils/deleteGlossary.operation");

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

class OrganizationGlossary extends React.Component {
  constructor(props) {
    super(props);
    this.orgID = this.props.match.params.orgId;
    this.userID = JSON.parse(localStorage.getItem("userProfile")).userID;
    this.tableRef = React.createRef();
    this.pageInputRef = React.createRef();
    this.state = {
      loading: false,
      open: false,
      message: "",
      variant: 'success',
      loadMsg: "",
      rowsToDelete: [],
      openConfirmDialog: false,
      openDeleteSelectedGlossaryConfirmDialogue: false,
      openSingleGlossaryDeleteConfirmBox: false,
      singleDeletionArr: [],
      isInputActive: false,
      inputPageNumber: 1,
      currentPageIndex: 0
    }
  }



  getOrganizationGlossary = () => {
    const { APITransport } = this.props

    let apiObj = new ViewGlossary(this.userID, this.orgID)
    APITransport(apiObj)
  }
  componentDidMount() {
    if (this.props.glossaryData.count === 0) {
    this.setState({ loading: true })
    this.getOrganizationGlossary();
    }
    // console.log("this.props.match.params.orgId", this.props.match.params.orgId)
  }
  componentDidUpdate(prevProps) {
    // console.log("prevProps.glossaryData ---------------- ", prevProps.glossaryData);
    // console.log("this.props.glossaryData ---------------- ", this.props.glossaryData);
    if (this.props.glossaryData.hasOwnProperty("deleted") && !this.props.glossaryData.delete && this.state.loading) {
      this.setState({ loading: false })
    }
    if (prevProps.glossaryData.count > this.props.glossaryData.count && this.props.glossaryData.deleted) {
      this.setState({ open: true, message: 'Glossary deleted successfully', variant: 'success' }, () => {
        setTimeout(() => this.setState({ open: false, message: "", variant: "info" }), 3000)
      })
    }
  }

  componentWillUnmount(){
    this.props.clearOrgGlossary();
  }

  makeDeleteGlossaryAPICall = (orgId, src, tgt, locale, reverseLocale, context, bulkDelete = false, deletionArray = []) => {
    this.setState({ open: true, message: 'Glossary deletion in progress...', variant: 'info', openConfirmDialog: false })
    let apiObj = new DeleteOrgGlossary(this.orgID, src, tgt, locale, reverseLocale, context, bulkDelete, deletionArray)
    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
      .then(async res => {
        if (res.ok) {
          this.setState({ open: false })
          let apiObj = new ViewGlossary(this.userID, this.orgID)
          let { APITransport } = this.props
          APITransport(apiObj)
          return true;
        } else {
          this.setState({ open: true, message: 'Glossary deletion failed', variant: 'error' })
          return false;
        }
      })
  }

  makeDeleteAllGlossaryAPICall = (userObj, context) => {
    this.setState({ open: true, message: 'Glossary deletion in progress...', variant: 'info' })
    this.handleCloseConfirmBox();
    let apiObj = new DeleteTmx(userObj, context)
    // console.log("apiObj.getBody()", apiObj.getBody());
    fetch(apiObj.apiEndPoint(), {
      method: 'post',
      headers: apiObj.getHeaders().headers,
      body: JSON.stringify(apiObj.getBody())
    })
      .then(async res => {
        if (res.ok) {
          this.setState({ open: false })
          let apiObj = new ViewGlossary(this.userID, this.orgID)
          let { APITransport } = this.props
          APITransport(apiObj)
          return true;
        } else {
          this.setState({ open: true, message: 'Glossary deletion failed', variant: 'error' })
          return false;
        }
      })
  }

  handleDeleteGlossary = (dataArray) => {
    this.setState({ openSingleGlossaryDeleteConfirmBox: false, singleDeletionArr: [] })
    let reverseLocale = dataArray[3].split("|").reverse().join("|");
    this.makeDeleteGlossaryAPICall(dataArray[2], dataArray[0], dataArray[1], dataArray[3], reverseLocale, dataArray[4])
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleDeleteAllGlossary = () => {
    // console.log("handleDeleteAllGlossary")
    this.setState({ openConfirmDialog: true })
  }

  deleteMultipleRows = () => {
    this.setState({ openDeleteSelectedGlossaryConfirmDialogue: false });
    let isOrg = delete_glossary.isOrg(this.props.glossaryData, this.state.rowsToDelete)
    // if (!isOrg) {
    let userId = JSON.parse(localStorage.getItem("userProfile")).userID
    let rowsToBeDeleted = delete_glossary.getBulkDeletionArray(this.props.glossaryData, this.state.rowsToDelete)
    this.makeDeleteGlossaryAPICall(this.orgID, "", "", "", "", "JUDICIARY", true, rowsToBeDeleted)
    // } else {
    //   this.setState({ open: true, message: "Cannot delete glossary of type Organization..", variant: "error" })
    // }
    setTimeout(() => {
      this.setState({ open: false, message: "", variant: "" })
    }, 2000)
  }

  handleCloseConfirmBox = () => {
    this.setState({ openConfirmDialog: false })
  }

  renderDeleteAllGlossaryButton = () => {
    return (
      <div style={{ textAlign: "end" }}>
        <Button
          onClick={() => this.handleDeleteAllGlossary()}
          variant="contained"
          color="primary"
          style={{
            borderRadius: "10px",
            color: "#FFFFFF",
            backgroundColor: "#D32F2F",
            height: "35px",
            fontSize: "16px",
            textTransform: "none",
          }}
          size="small"
        >
          Delete All Glossary
        </Button>
        <ConfirmBox
            open={this.state.openConfirmDialog}
            onClose={() => this.handleCloseConfirmBox()}
            title="Delete all glossary"
            contentText="Are you sure you want to delete all glossary for this organization?"
            onConfirm={() => this.makeDeleteAllGlossaryAPICall({ orgID: this.orgID }, "JUDICIARY")}
        />
        {/* <Dialog
          open={this.state.openConfirmDialog}
          onClose={() => this.handleCloseConfirmBox()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete all glossary"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete all glossary for this organization?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.makeDeleteAllGlossaryAPICall({ orgID: this.orgID }, "JUDICIARY")} color="primary">
              Confirm
            </Button>
            <Button onClick={() => this.handleCloseConfirmBox()} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog> */}
      </div>
    )
  }

  handleDeleteSelectedGlossaryBox = () => {
    this.setState({ openDeleteSelectedGlossaryConfirmDialogue: false })
  }

  renderDeleteSelectedGlossaryConfirmBox = () => {
    return (
      <div style={{ textAlign: "end", marginBottom: "1rem" }}>
        <ConfirmBox
            open={this.state.openDeleteSelectedGlossaryConfirmDialogue}
            onClose={() => this.handleDeleteSelectedGlossaryBox()}
            title="Delete Selected glossary"
            contentText="Are you sure you want to delete selected glossary?"
            onConfirm={() => this.deleteMultipleRows()}
        />
        {/* <Dialog
          open={this.state.openDeleteSelectedGlossaryConfirmDialogue}
          onClose={() => this.handleDeleteSelectedGlossaryBox()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete Selected glossary"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete selected glossary?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.deleteMultipleRows()} color="primary">
              Confirm
            </Button>
            <Button onClick={() => this.handleDeleteSelectedGlossaryBox()} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog> */}
      </div>
    )
  }

  renderSingleGlossaryConfirmBox = () => {
    return (
      <div style={{ textAlign: "end", marginBottom: "1rem" }}>
        <ConfirmBox
            open={this.state.openSingleGlossaryDeleteConfirmBox && this.state.singleDeletionArr.length > 0}
            onClose={() => this.setState({ openSingleGlossaryDeleteConfirmBox: false })}
            title="Delete glossary"
            contentText={"Are you sure you want to delete " + this.state.singleDeletionArr[0] + " - " + this.state.singleDeletionArr[1] + " glossary?"}
            onConfirm={() => this.handleDeleteGlossary(this.state.singleDeletionArr)}
        />
        {/* <Dialog
          open={this.state.openSingleGlossaryDeleteConfirmBox && this.state.singleDeletionArr.length > 0}
          onClose={() => this.setState({ openSingleGlossaryDeleteConfirmBox: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete glossary"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete {this.state.singleDeletionArr[0]} - {this.state.singleDeletionArr[1]} glossary?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {
              this.handleDeleteGlossary(this.state.singleDeletionArr)
            }
            }
              color="primary">
              Confirm
            </Button>
            <Button onClick={() => this.setState({ openSingleGlossaryDeleteConfirmBox: false })} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog> */}
      </div>
    )
  }

  handleInputPageChange = (event, totalPageCount) => {
    if (event.target.value <= totalPageCount) {
      this.setState({ inputPageNumber: event.target.value })
    } else if (event.target.value > totalPageCount) {
      this.setState({ inputPageNumber: totalPageCount })
    } else if (event.target.value == 0) {
      this.setState({ inputPageNumber: 1 })
    } else if (event.target.value < 0) {
      this.setState({ inputPageNumber: 1 })
    }
  }

  onChangePageMAnually = () => {
    // console.log("offset", 0);
    // console.log("limit (Number(this.state.inputPageNumber)-1)*10 ---> ", this.props.job_details.count);
    // this.makeAPICallJobsBulkSearch(0, (Number(this.state.inputPageNumber)-1)*10, false, false, true)
    this.tableRef.current.changePage(Number(this.state.inputPageNumber) - 1);
    // this.setState({ currentPageIndex: this.state.inputPageNumber - 1 }, () => {
    //   this.makeAPICallDocumentsTranslationProgress();
    // });
  }

  render() {
    const columns = [
      {
        name: "src",
        label: translate("common.page.label.source"),
        options: {
          filter: false,
          sort: false,
          viewColumns: false,
        },
      },
      {
        name: "tgt",
        label: translate("common.page.label.target"),
        options: {
          filter: false,
          sort: false,
          viewColumns: false,
        },
      },
      {
        name: "userID",
        label: "User ID",
        options: {
          filter: false,
          sort: false,
          display: 'excluded',
          download: false
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
        name: "context",
        label: "Context",
        options: {
          filter: false,
          sort: false,
          display: 'excluded'
        },
      },
      {
        name: "typeOfGlossary",
        label: "Glossary Type",
        option: {
          filter: false,
          sort: false,
          viewColumns: false,
        }
      },
      {
        name: "Action",
        label: translate("common.page.label.action"),
        filter: true,
        options: {
          sort: false,
          empty: true,
          download: false,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  <Tooltip title="Delete Glossary" placement="left">
                    <IconButton
                      style={{ color: tableMeta.rowData[5] === "Organization" ? "grey" : "#233466", padding: "5px" }}
                      component="a"
                      onClick={() => {
                        this.setState({ singleDeletionArr: tableMeta.rowData, openSingleGlossaryDeleteConfirmBox: true })
                        // this.handleDeleteGlossary(tableMeta.rowData)
                      }}
                    // disabled={tableMeta.rowData[5] === "Organization"}
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
      count: this.props.glossaryData.count,
      filterType: "checkbox",
      download: this.props.glossaryData.result.length > 0 ? true : false,
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
        this.setState({ openDeleteSelectedGlossaryConfirmDialogue: true });
      },
      page: this.state.currentPageIndex,
      customFooter: (
        count,
        page,
        rowsPerPage,
        changeRowsPerPage,
        changePage
      ) => {
        const startIndex = page * rowsPerPage;
        const endIndex = (page + 1) * rowsPerPage;
        const totalPageCount = Math.ceil(this.props.glossaryData.count / 10);
        return (
          <CustomTableFooter
            renderCondition={totalPageCount > 0}
            countLabel={"Total Glossary"}
            totalCount={this.props.glossaryData.count}
            pageInputRef={this.pageInputRef}
            inputValue={this.state.inputPageNumber}
            onInputFocus={()=>this.setState({ isInputActive: true })}
            onInputBlur={()=>this.setState({ isInputActive: false })}
            handleInputChange={this.handleInputPageChange}
            totalPageCount={totalPageCount}
            onGoToPageClick={this.onChangePageMAnually}
            onBackArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex - 1 })
              this.tableRef.current.changePage(Number(this.state.currentPageIndex - 1))
            }
            }
            onRightArrowClick={() => {
              this.setState({ currentPageIndex: this.state.currentPageIndex + 1 })
              this.tableRef.current.changePage(Number(this.state.currentPageIndex + 1))
            }
            }
            backArrowTabIndex={this.state.currentPageIndex - 1}
            backArrowDisable={this.state.currentPageIndex == 0}
            rightArrowTabIndex={this.state.currentPageIndex + 1}
            rightArrowDisable={this.state.currentPageIndex == (totalPageCount-1)}
            pageTextInfo={`Page ${parseInt(this.state.currentPageIndex + 1)} of ${parseInt(totalPageCount)}`}
          />
        );
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
              {this.renderDeleteAllGlossaryButton()}
              {this.renderDeleteSelectedGlossaryConfirmBox()}
              {this.renderSingleGlossaryConfirmBox()}
              <DataTable
                title={translate("common.page.title.glossary")}
                columns={columns}
                options={options}
                data={this.props.glossaryData.result}
                innerRef={this.tableRef}
              />
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
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  glossaryData: state.fetchOrgGlossary,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport,
      clearOrgGlossary
    },
    dispatch
  );

export default withRouter(
  withStyles(NewCorpusStyle)(
    connect(mapStateToProps, mapDispatchToProps)(OrganizationGlossary)
  )
);