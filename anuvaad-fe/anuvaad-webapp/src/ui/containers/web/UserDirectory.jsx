import Snackbar from "@material-ui/core/Snackbar";
import AddIcon from "@material-ui/icons/Add";
import MUIDataTable from "mui-datatables";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import UserDirectoryList from "../../../flux/actions/apis/userdirectory";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import UserDelete from "../../../flux/actions/apis/userdelete";
import MySnackbarContentWrapper from "../../components/web/common/Snackbar";
import DeleteUser from "../../components/web/common/DeleteUser";
import UserUpdate from "./UserUpdate";
import { translate } from "../../../assets/localisation";

class UserDirectory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      apiCalled: false,
      hindi: [],
      english: [],
      hindi_score: [],
      english_score: [],
      file: {},
      corpus_type: "single",
      hindiFile: {},
      englishFile: {},
      open: false,
      value: "",
      filename: "",
      snack: false,
      message: "",
      user: {},
      openValue: false,
      openDialog: false,
      newUser: false,
      loginUser: localStorage.getItem("userDetails").split(" ")[0]
    };
  }

  handleCancel = () => {
    this.setState({ openValue: false });
  };

  handleClickOpen = (name, status) => {
    const { APITransport } = this.props;
    const apiObj = new UserDelete(name, status);
    APITransport(apiObj);
    this.setState({ open: false, openDialog: false, showLoader: true, openValue: false });
    const apiObj1 = new UserDirectoryList();
    APITransport(apiObj1);
    // var a =
    //     this.setState({ showLoader: true, message: this.state.name + (this.state.status === "DELETE" ? translate('userDirectory.page.message.deactivated') : translate('userDirectory.page.message.activated')) })

    return false;
  };

  componentDidMount() {
    const { APITransport } = this.props;
    const apiObj = new UserDirectoryList();
    APITransport(apiObj);
    this.setState({ showLoader: true });
  }

  componentDidUpdate(prevProps, nexpProps) {
    if (prevProps.userList !== this.props.userList) {
      this.setState({
        userList: this.props.userList,
        count: this.props.count
      });
    }
  }

  handleClick = rowData => {
    rowData[1] !== this.state.loginUser && this.setState({ openValue: true, user: rowData, newUser: !rowData[0] });
  };

  handleSubmit = (value, name, status) => {
    this.setState({
      openDialog: true,
      open: true,
      openValue: false,
      value,
      name,
      status
    });
  };

  handleClose = () => {
    this.setState({ open: false, snack: false, openValue: false, openDialog: false });
  };

  render() {
    const columns = [
      {
        name: "id",
        label: translate("common.page.label.id"),
        options: {
          display: "excluded"
        }
      },
      {
        name: "username",
        label: translate("common.page.label.userName"),
        options: {
          filter: true,
          sort: true,
          
        }
      },
      {
        name: "firstname",
        label: translate("common.page.label.firstName"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "lastname",
        options: {
          display: "excluded"
        }
      },

      {
        name: "email",
        label: translate("common.page.label.email"),
        options: {
          filter: true,
          sort: true
        }
      },
      {
        name: "roles",

        options: {
          display: "excluded"
        }
      },

      {
        name: "Roles",
        label: translate("common.page.label.role"),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return <div style={{ width: "120px" }}>{tableMeta.rowData[5] ? tableMeta.rowData[5].join(", ") : ""} </div>;
            }
          }
        }
      },
      {
        name: "isActive",
        options: {
          display: "excluded"
        }
      },
      {
        name: "createdAt",
        label: "Created At",
        options: {
          filter: true,
          sortDirection: "asc"
          
        }
      },
      {
        name: "document_count",
        label: translate("common.page.label.document_count"),
        options: {
          filter: true,
          sort: true
        }
      },

      {
        name: "Action",
        label: translate("common.page.label.action"),
        options: {
          filter: true,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (tableMeta.rowData) {
              return (
                <div>
                  {tableMeta.rowData[1] !== this.state.loginUser ? (
                    <Button
                      variant="contained"
                      onClick={event => {
                        this.handleSubmit(tableMeta.rowData[0], tableMeta.rowData[1], tableMeta.rowData[7] ? "DELETE" : "ACTIVE");
                      }}
                      color={tableMeta.rowData[7] ? "" : "primary"}
                      aria-label="edit"
                      style={{ width: "170px", marginLeft: "-13%", marginBottom: "4%", marginTop: "4%" }}
                    >
                      {tableMeta.rowData[7] ? translate("userDirectory.page.label.deactivated") : translate("userDirectory.page.label.activated")}
                    </Button>
                  ) : (
                      ""
                    )}
                </div>
              );
            }
          }
        }
      },
      {
        name: "high_court_code",
        label: translate("userDirectory.page.label.courtName"),
        options: {
          display: "excluded"
        }
      }
    ];

    const options = {
      textLabels: {
        body: {
          noMatch: translate("gradeReport.page.muiNoTitle.sorryRecordNotFound")
        },
        toolbar: {
          search: translate("graderReport.page.muiTable.search"),
          viewColumns: translate("graderReport.page.muiTable.viewColumns")
        },
        pagination: {
          rowsPerPage: translate("graderReport.page.muiTable.rowsPerPages")
        }
      },
      filterType: "checkbox",
      download: false,
      print: false,
      filter: false,
      selectableRows: "none",
      rowsPerPage: 10,
      customSort: (data, dataIndex, rowIndex) => {
        if (dataIndex === 8) {
          return data.sort((a, b) => {
            const dateA = new Date(a.data[dataIndex]).getTime();
            const dateB = new Date(b.data[dataIndex]).getTime();
            return (dateA < dateB ? -1 : 1) * (rowIndex === "desc" ? 1 : -1);
          });
        } else {
          return data.sort((a, b) => {
            return (
              (a.data[dataIndex].length < b.data[dataIndex].length ? -1 : 1) *
              (rowIndex === "desc" ? 1 : -1)
            );
          });
        }
      },
      onRowClick: rowData => this.handleClick(rowData)
    };

    const val = this.state.openValue ? 8 : 12;
    return (
      <div>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={12} lg={12} xl={12} style={{textAlign: 'right',marginLeft: "3%", marginRight: "3%", }}>
            <Fab
              variant="extended"
              color="primary"
              aria-label="Add"
              style={{ marginTop: "1%", textAlign: 'right' }}
              onClick={() => this.handleClick([])}
            >
              <AddIcon />
              {translate("userDirectory.page.label.addUser")}
            </Fab>
          </Grid>
          <Grid item xs={val} sm={val} lg={val} xl={val}>
            <div style={{ marginLeft: "3%", marginRight: "3%", marginTop: "10px" }}>
              <MUIDataTable
                title={translate("userDirectory.page.label.userManagement")}
                data={this.state.userList}
                columns={columns}
                options={options}
              />
            </div>
          </Grid>
          <Grid item xs={4} sm={4} lg={4} xl={4}>
            <UserUpdate
              userDetails={this.state.user}
              openValue={this.state.openValue}
              handleCancel={this.handleCancel}
              newUser={this.state.newUser}
            />
          </Grid>
        </Grid>

        {this.state.openDialog && (
          <DeleteUser
            value={this.state.value}
            name={this.state.name}
            handleClickOpen={this.handleClickOpen}
            open={this.state.open}
            status={this.state.status}
            handleClose={this.handleClose.bind(this)}
          />
        )}

        {this.state.snack && this.state.message && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={this.state.snack}
            onClose={this.handleClose}
            autoHideDuration={3000}
          >
            <MySnackbarContentWrapper onClose={this.handleClose} variant="success" message={this.state.message} />
          </Snackbar>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  userList: state.userList
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDirectory));
