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
import { Button } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteTmx from "../../../../flux/actions/apis/tmx/tmxDelete";

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
    this.state = {
      loading: false,
      open: false,
      message: "",
      variant: 'success',
      loadMsg: "",
      rowsToDelete: [],
      openConfirmDialog: false
    }
  }



  getOrganizationGlossary = () => {
    const { APITransport } = this.props

    let apiObj = new ViewGlossary(this.userID, this.orgID)
    APITransport(apiObj)
  }
  componentDidMount() {
    // if (this.props.glossaryData.count === 0) {
    this.setState({ loading: true })
    this.getOrganizationGlossary();
    // }
    // console.log("this.props.match.params.orgId", this.props.match.params.orgId)
  }
  componentDidUpdate(prevProps) {
    if (this.props.glossaryData.hasOwnProperty("deleted") && !this.props.glossaryData.delete && this.state.loading) {
      this.setState({ loading: false })
    }
    if (prevProps.glossaryData.count > this.props.glossaryData.count && this.props.glossaryData.deleted) {
      this.setState({ open: true, message: 'Glossary deleted successfully', variant: 'success' }, () => {
        setTimeout(() => this.setState({ open: false, message: "", variant: "info" }), 3000)
      })
    }
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
    this.setState({ open: true, message: 'Glossary deletion in progress...', variant: 'info'})
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
    let reverseLocale = dataArray[3].split("|").reverse().join("|");
    this.makeDeleteGlossaryAPICall(dataArray[2], dataArray[0], dataArray[1], dataArray[3], reverseLocale, dataArray[4])
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  handleDeleteAllGlossary = () => {
    console.log("handleDeleteAllGlossary")
    this.setState({openConfirmDialog : true})
  }

  deleteMultipleRows = () => {
    let isOrg = delete_glossary.isOrg(this.props.glossaryData, this.state.rowsToDelete)
    if (!isOrg) {
      let userId = JSON.parse(localStorage.getItem("userProfile")).userID
      let rowsToBeDeleted = delete_glossary.getBulkDeletionArray(this.props.glossaryData, this.state.rowsToDelete)
      this.makeDeleteGlossaryAPICall(this.orgID, "", "", "", "", "JUDICIARY", true, rowsToBeDeleted)
    } else {
      this.setState({ open: true, message: "Cannot delete glossary of type Organization..", variant: "error" })
    }
    setTimeout(() => {
      this.setState({ open: false, message: "", variant: "" })
    }, 2000)
  }

  handleCloseConfirmBox = () => {
    this.setState({openConfirmDialog : false})
  }

  renderDeleteAllGlossaryButton = () => {
    return (
      <div style={{ textAlign: "end" }}>
        <Button
          onClick={() => this.handleDeleteAllGlossary()}
          sx={{}}
        >
          Delete All Glossary
        </Button>
        <Dialog
          open={this.state.openConfirmDialog}
          onClose={()=>this.handleCloseConfirmBox()}
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
            <Button onClick={()=>this.makeDeleteAllGlossaryAPICall({orgID : this.orgID},"JUDICIARY")} color="primary">
              Confirm
            </Button>
            <Button onClick={()=>this.handleCloseConfirmBox()} color="primary" autoFocus>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
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
          sort: false
        }
      },
      {
        name: "Action",
        label: translate("common.page.label.action"),
        filter: true,
        options: {
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  <Tooltip title="Delete Glossary" placement="left">
                    <IconButton
                      style={{ color: tableMeta.rowData[5] === "Organization" ? "grey" : "#233466", padding: "5px" }}
                      component="a"
                      onClick={() => this.handleDeleteGlossary(tableMeta.rowData)}
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
      download: true,
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
      <div style={{ maxHeight: window.innerHeight, height: window.innerHeight, overflow: "auto" }}>
        <div style={{ margin: "0% 3% 3% 3%", paddingTop: "7%" }}>
          <Header />
          {this.state.loading ?
            <Spinner />
            :
            <MuiThemeProvider theme={getMuiTheme()}>
              {this.renderDeleteAllGlossaryButton()}
              <MUIDataTable
                title={translate("common.page.title.glossary")}
                columns={columns}
                options={options}
                data={this.props.glossaryData.result}
              />
            </MuiThemeProvider>
          }
        </div>
        {this.state.open &&
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
      APITransport
    },
    dispatch
  );

export default withRouter(
  withStyles(NewCorpusStyle)(
    connect(mapStateToProps, mapDispatchToProps)(OrganizationGlossary)
  )
);