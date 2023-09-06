import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import NewCorpusStyle from "../../../styles/web/Newcorpus";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../assets/localisation";
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Spinner from "../../../components/web/common/Spinner";
import { clearJobEntry } from '../../../../flux/actions/users/async_job_management';
import ToolBar from "../AdminPanel/OrganizationHeader"
import FetchOrganizationList from "../../../../flux/actions/apis/organization/organization-list";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddOrg from "../../../../flux/actions/apis/organization/addOrganization";
import Visibility from "@material-ui/icons/Visibility";
import history from "../../../../web.history";
import DataTable from "../../../components/web/common/DataTable";
import { CustomTableFooter } from "../../../components/web/common/CustomTableFooter";


const TELEMETRY = require('../../../../utils/TelemetryManager')

class OrganizationList extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.pageInputRef = React.createRef();
    this.state = {


      offset: 0,
      limit: 10,
      currentPageIndex: 0,

      showLoader: false,
      status: false,
      isInputActive: false,
      inputPageNumber: 1,
      currentPageIndex: 0
    };

  }

  deleteOrg = (orgId) => {
    return (
      <Tooltip title="Deactivate" placement="right">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.handleDeleteOrg(orgId)} >
          <DeleteForeverIcon />
        </IconButton>
      </Tooltip>
    );
  }

  viewOrgGlossaries = (orgId) => {
    return (
      <Tooltip title="View Org Glossaries" placement="right">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.onViewGlossaryClick(orgId)}>
          <Visibility />
        </IconButton>
      </Tooltip>
    )
  }

  viewOrgGlossarySuggestion = (orgId) => {
    return (
      <Tooltip title="View Org Glossaries" placement="right">
        <IconButton style={{ color: '#233466', padding: '5px' }} component="a" onClick={() => this.onViewGlossarySuggestionClick(orgId)}>
          <Visibility />
        </IconButton>
      </Tooltip>
    )
  }

  /**
 * progress information for user from API
 */
  informUserProgress = (message) => {
    this.setState({
      apiInProgress: true,
      showStatus: false,
      snackBarMessage: message
    })
  }
  informUserStatus = (message, isSuccess) => {
    this.setState({
      apiInProgress: false,
      showStatus: true,
      snackBarMessage: message,
      snackBarVariant: isSuccess ? "success" : "error"
    })
  }

  async handleDeleteOrg(orgId) {

    // TELEMETRY.addOrganization(this.state.name, this.state.description)
    let apiObj = new AddOrg(orgId, "", false)
    this.informUserProgress("Deactivating organization");
    const apiReq = fetch(apiObj.apiEndPoint(), {
      method: 'post',
      body: JSON.stringify(apiObj.getBody()),
      headers: apiObj.getHeaders().headers
    }).then(async response => {
      const rsp_data = await response.json();
      if (!response.ok) {
        TELEMETRY.log("delete-organization", JSON.stringify(rsp_data))
        if (Number(response.status) === 401) {
          this.handleRedirect()
        }
        else {
          this.informUserStatus(rsp_data.message ? rsp_data.message : rsp_data.why ? rsp_data.why : "failed", false)
        }

        return Promise.reject('');
      } else {
        if (rsp_data.http.status == 200) {
          this.informUserStatus(rsp_data.why ? rsp_data.why : orgId + "Deactivated", true)
          this.processFetchBulkOrganizationAPI()

        }
        else {
          this.informUserStatus(rsp_data.why ? rsp_data.why : "Deactivation Failed.", false)
        }



      }
    })
  };

  onViewGlossaryClick = (orgId) => {
    history.push(`${process.env.PUBLIC_URL}/organization-glossary/${orgId}`);
  }

  onViewGlossarySuggestionClick = (orgId) => {
    history.push(`${process.env.PUBLIC_URL}/suggestion-list/${orgId}`);
  }

  renderProgressInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={this.state.apiInProgress}
        message={this.state.snackBarMessage}
      >
        <Alert elevation={6} variant="filled" severity="info">{this.state.snackBarMessage}</Alert>
      </Snackbar>
    )
  }

  renderStatusInformation = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={this.state.showStatus}
        onClose={(e, r) => {
          this.setState({ showStatus: false })
        }}
      >
        <Alert elevation={6} variant="filled" severity={this.state.snackBarVariant}>{this.state.snackBarMessage}</Alert>
      </Snackbar>
    )
  }


  processFetchBulkOrganizationAPI = (offset, limit) => {
    const token = localStorage.getItem("token");
    const userObj = new FetchOrganizationList(offset, limit, token)
    this.props.APITransport(userObj)
  }
  /**
   * life cycle methods
   */
  componentDidMount() {
    // TELEMETRY.pageLoadCompleted('');
    this.setState({ showLoader: true })
    this.processFetchBulkOrganizationAPI(this.state.offset, this.state.limit)
  }

  componentDidUpdate(prevProps) {

    if (prevProps.organizationList !== this.props.organizationList) {
      this.setState({ showLoader: false, status: false })
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
        name: "code",
        label: "Organization Name",
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: "description",
        label: 'Description',
        options: {
          filter: false,
          sort: true,
        }
      },
      {
        name: "active",
        label: 'Status',
        options: {
          filter: false,
          sort: false,
          display: "exclude"

        }
      },
      {
        name: "view-glossary",
        label: "View Glossary",
        options: {
          filter: true,
          sort: true,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                this.viewOrgGlossaries(tableMeta.rowData[0]) //userId, userName, roleCodes, isactive
              );
            }
          }
        }
      },
      {
        name: "view-suggestions",
        label: "View Suggestions",
        options: {
          filter: true,
          sort: true,
          empty: true,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                this.viewOrgGlossarySuggestion(tableMeta.rowData[0]) //userId, userName, roleCodes, isactive
              );
            }
          }
        }
      },
      {
        name: "reset-password",
        label: "Deactivate",
        options: {
          filter: true,
          sort: true,
          empty: true,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                this.deleteOrg(tableMeta.rowData[0]) //userId, userName, roleCodes, isactive
              );
            }
          }
        }
      },
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
        // options: { sortDirection: 'asc' }
      },

      count: this.props.organizationList?.length,
      rowsPerPageOptions: [10, 20, 50],
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
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
        const totalPageCount = Math.ceil(this.props.organizationList?.length / 10);
        return (
          <CustomTableFooter
            renderCondition={totalPageCount > 0}
            countLabel={"Total Glossary"}
            totalCount={this.props.organizationList?.length}
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
      <div style={{ }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "2%" }}>
          <ToolBar />
          {
            (!this.state.showLoader || this.props.count) &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <DataTable title={translate("common.page.title.orgList")}
                columns={columns} options={options} data={this.props.organizationList} innerRef={this.tableRef} />
            </MuiThemeProvider>
          }
          {(this.state.showLoader) && <Spinner />}
          {this.state.apiInProgress ? this.renderProgressInformation() : <div />}
          {this.state.showStatus ? this.renderStatusInformation() : <div />}
        </div>
      </div >
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  userinfo: state.userinfo,
  organizationList: state.organizationList.data,
  job_details: state.job_details,
  activateuser: state.activateuser,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearJobEntry,
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(OrganizationList)));
