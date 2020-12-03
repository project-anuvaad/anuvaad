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
import ToolBar from "../AdminPanel/AdminPanelHeader"
import FetchUserDetails from "../../../../flux/actions/apis/userdetails";
import ActivateUser from "../../../../flux/actions/apis/activate_exisiting_user";
import DeactivateUser from "../../../../flux/actions/apis/deactivate_exisiting_user";
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';



const TELEMETRY = require('../../../../utils/TelemetryManager')

class UserDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      role: localStorage.getItem("roles"),
      showInfo: false,
      offset: 0,
      limit: 10,
      currentPageIndex: 0,
      dialogMessage: null,
      timeOut: 3000,
      variant: "info",
      open: false,
      checked: false
    };

  }

  /**
   * life cycle methods
   */
  componentDidMount() {
    TELEMETRY.pageLoadCompleted('user-details');
    this.setState({ showLoader: true })
    const token = localStorage.getItem("token");
    const userObj = new FetchUserDetails(token);
    this.props.APITransport(userObj);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userinfo.data === undefined && this.props.userinfo.data !== undefined) {
      this.setState({ showLoader: false })
    }else if(prevProps.userinfo.data !== this.props.userinfo.data){
      this.setState({ showLoader: false })
    }
  }



  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          padding: '3px 10px 3px'
        }
      },
    }
  })


  getDateTimeFromTimestamp = (t) => {
    let date = new Date(t);
    return ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    TELEMETRY.pageLoadStarted('user-details')
    /**
     * getSnapshotBeforeUpdate() must return null
     */
    return null;
  }
  handleMessageClear = () => {
    this.setState({ open: true });
  }

  toggleChecked = (userID,userName,currentState) => {
    const {APITransport} = this.props;
    const token = localStorage.getItem("token");
    if(currentState){
      const deactivateObj = new DeactivateUser(userName,userID,token)
      APITransport(deactivateObj);
    }else{
      const activateObj = new ActivateUser(userName,userID,token)
      APITransport(activateObj);
    }
  };

  render() {
    const data = this.props.userinfo.data;
    const columns = [
      {
        name: "userID",
        label: "userID",
        options: {
          filter: false,
          sort: false,
        display:"exclude"
        }
      },
      {
        name: "name",
        label: 'Name',
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "email_id",
        label: translate("common.page.label.email"),
        options: {
          filter: false,
          sort: false,
        }
      },
      {
        name: "roles",
        label: translate("common.page.label.role"),
        options: {
          filter: false,
          sort: false,
        }
      },      
      {
        name: "is_verified",
        label: translate('common.page.table.status'),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              console.log(tableMeta.rowData);
              return (
                <div>
                  <Tooltip key={tableMeta.rowIndex} title="Active/Inactive" placement="left">
                    <IconButton style={{ color: '#233466', padding: '5px' }} component="a" >
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch checked={tableMeta.rowData[4]} onChange={this.toggleChecked(tableMeta.rowData[0],tableMeta.rowData[2],tableMeta.rowData[4])} />}
                        />
                      </FormGroup>
                    </IconButton>
                  </Tooltip>
                </div>
              );
            }
          }
        }
      },
    ];

    const options = {
      textLabels: {
        body: {
          noMatch: this.props.job_details.count > 0 && this.props.job_details.count > this.props.job_details.documents.length ? "Loading...." : translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
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

      count: this.props.job_details.count,
      filterType: "checkbox",
      download: false,
      print: false,
      fixedHeader: true,
      filter: false,
      selectableRows: "none",
      sortOrder: {
        name: 'timestamp',
        direction: 'desc'
      },
      page: this.state.currentPageIndex
    };

    return (
      <div style={{ height: window.innerHeight }}>

        <div style={{ margin: '0% 3% 3% 3%', paddingTop: "7%" }}>
          <ToolBar />
          {
            !this.state.showLoader &&
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable title={translate("common.page.title.userdetails")}
                columns={columns} options={options} data={this.props.userinfo.data} />
            </MuiThemeProvider>}
        </div>
        {(this.state.showLoader || this.state.loaderDelete) && < Spinner />}
      </div>

    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  userinfo: state.userinfo,
  apistatus: state.apistatus,
  job_details: state.job_details,
  async_job_status: state.async_job_status
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

export default withRouter(withStyles(NewCorpusStyle)(connect(mapStateToProps, mapDispatchToProps)(UserDetails)));
