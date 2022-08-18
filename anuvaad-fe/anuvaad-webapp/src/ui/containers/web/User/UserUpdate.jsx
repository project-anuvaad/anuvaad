import React from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import SelectModel from "@material-ui/core/Select";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import Snackbar from "../../../components/web/common/Snackbar";
import { translate } from "../../../../assets/localisation";

import APITransport from "../../../../flux/actions/apitransport/apitransport";
import AddUser from "../../../flux/actions/apis/adduser";
import FetchCourtList from "../../../flux/actions/apis/fetchcourtlist";
import UserRolesList from "../../../../flux/actions/apis/userroles";
import Updatepassword from "../../../../flux/actions/apis/user/updateadminpassword";
import UserDirectoryList from "../../../../flux/actions/apis/userdirectory";

class UserUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userid: "",
      firstname: "",
      lastname: "",
      email: "",
      open: "",
      userDetails: [],
      userpassword: "",
      value: false,
      courtName: ""
    };
  }

  handleCancel = () => {
    this.setState({ open: false });
  };

  componentDidMount() {
    const { APITransport } = this.props;

    const apiObj = new UserRolesList();
    APITransport(apiObj);

    const apiObj1 = new FetchCourtList();
    APITransport(apiObj1);
    this.setState({ showLoader: true });
  }

  handleSubmit = () => {
    const { APITransport } = this.props;
    const apiObj = new AddUser(
      this.state.userid,
      this.state.firstname,
      this.state.lastname,
      this.state.userpassword,
      this.state.email,
      this.state.roles,
      this.state.high_court_code
    );
    APITransport(apiObj);
    this.setState({ showLoader: true });
  };

  handlePasswordSubmit = id => {
    const { APITransport } = this.props;
    const apiObj = new Updatepassword(id, this.state.userpassword, this.state.high_court_code);
    APITransport(apiObj);
    this.setState({ showLoader: true, open: true });

    setTimeout(() => {
      this.setState({ value: true });
    }, 1000);
  };

  componentDidUpdate(prevProps, nexpProps) {
    if (prevProps.userRoles !== this.props.userRoles) {
      this.setState({ userRoles: this.props.userRoles, value: false });
      setTimeout(() => {
        this.setState({ value: true });
      }, 1000);
    }

    if (prevProps.addUser !== this.props.addUser) {
      const { APITransport } = this.props;
      const apiObj = new UserDirectoryList();
      APITransport(apiObj);
      this.setState({ value: true, open: true, snackMessage: translate("userTranslate.page.message.newUserAdded") });
    }

    if (prevProps.updatePasswordstatus !== this.props.updatePasswordstatus) {
      const { APITransport } = this.props;
      const apiObj = new UserDirectoryList();
      APITransport(apiObj);
      this.setState({ value: true, open: true, snackMessage: translate("userTranslate.page.message.passwordpdatedSuccess") });
    }
    if (prevProps.courtList !== this.props.courtList) {
      this.setState({ courtList: this.props.courtList });
      setTimeout(() => {
        this.setState({ value: true });
      }, 1000);
    }
  }

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  handleSelectModelChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleSelectcourtChange(key, name, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  handleDelete = data => () => {
    this.setState(state => {
      const chipData = [...state.roles];
      const chipToDelete = chipData.indexOf(data);
      chipData.splice(chipToDelete, 1);
      this.setState({ roles: chipData });
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.userDetails && nextProps.userDetails && nextProps.userDetails !== prevState.userDetails) {
      return {
        userDetails: nextProps.userDetails,

        userid: nextProps.userDetails[1],
        firstname: nextProps.userDetails[2],
        lastname: nextProps.userDetails[3],
        email: nextProps.userDetails[4],
        roles: nextProps.userDetails[5],
        high_court_code: nextProps.userDetails[9],
        value: false
      };
    } return null;
  }

  handleTextChange(key, event) {
    this.setState({
      [key]: event.target.value
    });
  }

  render() {
    const { openValue, handleCancel, newUser, userDetails } = this.props;
    return (
      <div>
        {openValue && (
          <Paper style={{ marginTop: "10px", marginRight: "30px", marginLeft: "-20px" }}>
            <Typography
              gutterBottom
              variant="h5"
              component="h2"
              style={{ background: '#ECEFF1', paddingLeft: "35%", paddingTop: "13px", paddingBottom: "13px", width: "65%", marginBottom: "4%" }}
            >
              {newUser ? translate("userUpdate.page.label.addNewUser") : translate("userUpdate.page.label.passwordUpdated")}
            </Typography>
            <br />
            <form method="post">
              <FormControl fullWidth>
                <TextField
                  id="standard-name"
                  InputProps={{
                    readOnly: !!userDetails[1]
                  }}
                  label={translate("userUpdate.page.label.userId")}
                  value={this.state.userid ? this.state.userid : ""}
                  required
                  type="text"
                  onChange={event => {
                    this.handleTextChange("userid", event);
                  }}
                  margin="normal"
                  varient="outlined"
                  style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  id={this.state.firstname}
                  label={translate("common.page.label.firstName")}
                  InputProps={{ readOnly: !!userDetails[1] }}
                  placeholder="First Name"
                  required
                  value={this.state.firstname ? this.state.firstname : ""}
                  type="text"
                  onChange={event => {
                    this.handleTextChange("firstname", event);
                  }}
                  margin="normal"
                  varient="outlined"
                  style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label={translate("common.page.label.lastName")}
                  InputProps={{ readOnly: !!userDetails[1] }}
                  value={this.state.lastname ? this.state.lastname : ""}
                  required
                  id="outlined-required"
                  type="text"
                  onChange={event => {
                    this.handleTextChange("lastname", event);
                  }}
                  margin="normal"
                  varient="outlined"
                  style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}
                />{" "}
              </FormControl>
              <FormControl style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}>
                <InputLabel htmlFor="adornment-password">{translate("userUpdate.page.label.passwordAlert")}</InputLabel>
                <Input
                  id="adornment-password"
                  type={this.state.showPassword ? translate("common.page.label.text") : translate("common.page.label.password")}
                  value={this.state.userpassword}
                  onChange={event => {
                    this.handleTextChange("userpassword", event);
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  label={translate("common.page.label.email")}
                  value={this.state.email ? this.state.email : ""}
                  InputProps={{ readOnly: !!userDetails[1] }}
                  id="outlined-required"
                  type="text"
                  onChange={event => {
                    this.handleTextChange("email", event);
                  }}
                  margin="normal"
                  varient="outlined"
                  style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}
                />{" "}
              </FormControl>

              <Grid container spacing={8}>
                <Grid item xs={6} sm={6} lg={6} xl={6}>
                  <Typography value="" variant="h5" gutterBottom style={{ marginLeft: "12%", marginTop: "12px" }}>
                    {translate("userUpdate.page.label.selectRole")}{" "}
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <SelectModel
                    id="select-multiple-chip"
                    disabled={!!userDetails[1]}
                    multiple
                    style={{ minWidth: 160, align: "right", maxWidth: 160 }}
                    value={this.state.roles ? this.state.roles : []}
                    // onChange={this.handleSelectModelChange}
                    onChange={event => {
                      this.handleSelectModelChange("roles", event);
                    }}
                    renderValue={selected => selected.join(", ")}
                    input={<OutlinedInput name={this.state.roles} id="select-multiple-checkbox" />}
                  >
                    {this.state.userRoles
                      ? this.state.userRoles.map(item => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))
                      : []}
                    
                  </SelectModel>
                  <br />
                </Grid>

                {!userDetails[1] && (
                  <Grid item xs={12} sm={12} lg={12} xl={12} style={{ marginLeft: "5%", width: "90%", marginBottom: "4%" }}>
                    {this.state.roles && this.state.roles.map(value => <Chip key={value} label={value} onDelete={this.handleDelete(value)} />)}
                  </Grid>
                )}
              </Grid>

              <Grid container spacing={8}>
                <Grid item xs={6} sm={6} lg={6} xl={6}>
                  <Typography value="" variant="h5" gutterBottom style={{ marginLeft: "12%", marginTop: "12px" }}>
                    {translate("userUpdate.page.label.selectHighCourt")}{" "}
                  </Typography>
                </Grid>

                <Grid item xs={4} sm={4} lg={4} xl={4}>
                  <SelectModel
                    style={{ minWidth: 160, align: "right", maxWidth: 160 }}
                    value={this.state.high_court_code ? this.state.high_court_code : ""}
                    onChange={event => {
                      this.handleSelectcourtChange("high_court_code", "courtId", event);
                    }}
                    input={<OutlinedInput name={this.state.courtName} id="outlined-age-simple" />}
                  >
                    {this.state.courtList
                      ? this.state.courtList.map(item => (
                          <MenuItem key={item.high_court_code} value={item.high_court_code}>
                            {item.high_court_name}
                          </MenuItem>
                        ))
                      : []}
                    
                  </SelectModel>
                  <br />
                </Grid>
              </Grid>
              <span style={{ marginLeft: "20%", color: "red" }}>{this.state.message}</span>

              <Button
                variant="contained"
                onClick={() => {
                  handleCancel(false);
                }}
                color="primary"
                aria-label="edit"
                style={{ width: "40%", marginLeft: "-13%", marginBottom: "4%", marginTop: "4%" }}
              >
                {translate("common.page.button.cancel")}
              </Button>
              {userDetails[1] ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    this.handlePasswordSubmit(userDetails[0]);
                  }}
                  color="primary"
                  aria-label="edit"
                  style={{ width: "40%", marginBottom: "4%", marginTop: "4%", marginLeft: "5%" }}
                >
                  {translate("common.page.button.update")}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={
                    userDetails[1]
                      ? !(this.state.userpassword.length > 5)
                      : !(this.state.firstname && this.state.lastname && this.state.userid && this.state.email && this.state.high_court_code)
                  }
                  onClick={() => {
                    this.handleSubmit();
                  }}
                  color="primary"
                  aria-label="edit"
                  style={{ width: "40%", marginBottom: "4%", marginTop: "4%", marginLeft: "5%" }}
                >
                  {translate("common.page.button.add")}
                </Button>
              )}
            </form>
            {this.state.value ? handleCancel(false) : ""}
          </Paper>
        )}

        {this.state.open && this.state.snackMessage && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={this.state.open}
            autoHideDuration={4000}
            onClose={this.handleClose}
            variant="success"
            message={this.state.snackMessage}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus,
  userRoles: state.userRoles,
  addUser: state.addUser,
  courtList: state.courtList,
  updatePasswordstatus: state.updatePasswordstatus
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
      CreateCorpus: APITransport
    },
    dispatch
  );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserUpdate));
