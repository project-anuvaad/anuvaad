import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../assets/localisation";
import { withStyles } from "@material-ui/core/styles";
import DashboardStyles from "../../../styles/web/DashboardStyles";
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Toolbar from "../../web/AdminPanel/CreateUserHeader";
import CreateUsers from "../../../../flux/actions/apis/user/createusers";
import Snackbar from "../../../components/web/common/Snackbar";
import history from "../../../../web.history";
import CircularProgress from "@material-ui/core/CircularProgress";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ADMINCONFIG from "../../../../configs/adminConfig";
import FetchOrganizationList from "../../../../flux/actions/apis/organization/organization-list";
const TELEMETRY = require("../../../../utils/TelemetryManager");

const roles = ADMINCONFIG.roles;


class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      emailid: '',
      password: '',
      roleCode: '',
      roleInfo: '',
      isenabled: false,
      variantType: '',
      message: '',
      loading: false,
      showPassword: false,
      orgName: ''
    };
  }


  renderNameItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ marginTop: '0%' }}>
        <Grid item xs={6} sm={6} lg={8} xl={8} style={{ textAlign: 'left', marginTop: 'auto', marginBottom: '0' }}>
          <Typography value="" variant="h5">
            {translate("common.page.label.name")}{" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <FormControl variant="outlined" style={{
            width: '92%',
            fullWidth: true,
            display: "flex",
            wrap: "nowrap",
            height: '40px',
            magin: 'dense',
            marginLeft: '4.3%',
            marginBottom: '4%'
          }}>
            <TextField id="name" type="text" onChange={this.handleInputReceived('name')} value={this.state.name} variant="outlined">

            </TextField>
          </FormControl>
        </Grid>
      </Grid>
    )

  }

  processFetchBulkOrganizationAPI = () => {
    const userObj = new FetchOrganizationList()
    this.props.APITransport(userObj)
  }
  /**
   * life cycle methods
   */
  componentDidMount() {
    // TELEMETRY.pageLoadCompleted('');
    this.setState({ showLoader: true })
    this.props.organizationList.length<1 && this.processFetchBulkOrganizationAPI()
  }

  renderEmaiIdItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label} style={{ marginTop: '2%' }}>
          <Typography value="" variant="h5">
            {translate("common.page.label.email")}{" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <FormControl variant="outlined" style={{
            width: '92%',
            fullWidth: true,
            display: "flex",
            wrap: "nowrap",
            height: '40px',
            magin: 'dense',
            marginLeft: '4.3%',
            marginBottom: '11.5%'
          }}>
            <TextField id="email" type="email" onChange={this.handleInputReceived('emailid')} value={this.state.emailid} variant="outlined">

            </TextField>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword })
  }
  renderPasswordItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData} style={{ marginTop: "0%" }}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography value="" variant="h5">
            {translate("common.page.label.password")}{" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <FormControl variant="outlined" style={{
            width: '92%',
            fullWidth: true,
            display: "flex",
            wrap: "nowrap",
            height: '40px',
            magin: 'dense',
            marginLeft: '4.3%',
            marginBottom: '4%'
          }}>
            <OutlinedInput id="password" type={this.state.showPassword ? 'text' : 'password'} onChange={this.handleInputReceived('password')} value={this.state.password} variant="outlined"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    id="hide-show"
                    aria-label="toggle password visibility"
                    onClick={this.handleClickShowPassword}
                    edge="end"
                  >
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  renderRoleItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography variant="h5">
            {translate("common.page.label.role")}{" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <FormControl variant="outlined" style={{
            width: '92%',
            fullWidth: true,
            display: "flex",
            wrap: "nowrap",
            height: '40px',
            magin: 'dense',
            marginLeft: '4.3%',
            marginBottom: '5%'
          }}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="roles"
              onChange={this.processOnSelect}
              value={this.state.roleCode}
              style={{
                fullWidth: true,
              }}
            >
              {
                roles.map((role, i) => <MenuItem id={role.roleCode} key={role.roleCode} value={role.roleCode}>{role.roleCode}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }
  renderOrgItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography value="" variant="h5">
            Organization
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <FormControl variant="outlined" style={{
            width: '92%',
            fullWidth: true,
            display: "flex",
            wrap: "nowrap",
            height: '40px',
            magin: 'dense',
            marginLeft: '4.3%',
            marginBottom: '5%'
          }}>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="roles"
              onChange={this.handleOrg}
              value={this.state.orgName}
              style={{
                fullWidth: true,
              }}
            >
              {
                this.props.organizationList.map((id, i) => <MenuItem id={i} key={i} value={id}>{id}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    )
  }

  handleOrg = (e) => {
    this.setState({ orgName: e.target.value })
  }


  processOnSelect = (e) => {
    const roleInfo = roles.filter(role => {
      return role["roleCode"].includes(e.target.value)
    });
    this.setState({ roleCode: e.target.value, roleInfo: roleInfo })
  }


  processClearButton = () => {
    this.setState({
      name: '',
      emailid: '',
      password: '',
      roleCode: '',
      roleInfo: ''
    })
  }

  processCreateUser = () => {
    if (this.handleValidation('name') && this.handleValidation('emailid') && this.handleValidation('password') && this.handleValidation('roleCode')) {
      var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var passwordFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
      if (this.state.emailid.match(mailFormat)) {
        if (this.state.password.match(passwordFormat)) {
          const token = localStorage.getItem("token");
          const { emailid, name, password, roleInfo, orgName } = this.state
          const createUserObj = new CreateUsers(emailid, name, password, roleInfo, token, orgName);
          try {
            this.setState({
              loading: true,
            })
            fetch(createUserObj.apiEndPoint(), {
              method: 'post',
              body: JSON.stringify(createUserObj.getBody()),
              headers: createUserObj.getHeaders().headers
            })
              .then(async res => {
                if (res.ok) {
                  TELEMETRY.createUserEvent(name, emailid, "admin")

                  await res.json().then(obj => {
                    this.setState({
                      loading: false,
                      isenabled: true,
                      variantType: "success",
                      message: obj.why
                    });
                  })
                  setTimeout(async () => {
                    history.push(`${process.env.PUBLIC_URL}/user-details`);
                  }, 3000)
                } else {
                  if (res.status === 400) {
                    await res.json().then(obj => {
                      TELEMETRY.log("admin-create-user", JSON.stringify(obj))

                      this.setState({
                        loading: false,
                        isenabled: true,
                        variantType: "error",
                        message: obj.message
                      });
                    })
                  }
                }
              })
          } catch (error) {
            this.setState({
              name: '',
              emailid: '',
              password: '',
              roleCode: '',
              roleInfo: '',
              isenabled: true,
              loading: false,
              variantType: "error",
              message: "Oops! Something went wrong, please try again later"
            });
          }
        } else {
          alert("Please provide password with minimum 6 character, 1 number, 1 uppercase, 1 lower case and 1 special character.")
        }
      } else {
        alert(translate('common.page.alert.validEmail'))
      }

    } else {
      alert(translate('common.page.alert.provideValidDetails'))
    }
    setTimeout(() => {
      this.setState({ isenabled: false })
    }, 5000)
  }

  handleInputReceived = prop => event => this.setState({ [prop]: event.target.value });

  handleValidation(key) {
    if (!this.state[key] || this.state[key].length < 2) {
      return false
    }
    return true
  }


  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Toolbar />
        <Typography variant="h4" className={classes.typographyHeader}>
          {translate("create.user.page.heading.title")}
        </Typography>
        <Paper className={classes.paper}>
          <Grid container>

            {this.renderNameItems()}
            {this.renderEmaiIdItems()}
            {this.renderPasswordItems()}
            {this.renderRoleItems()}
            {this.renderOrgItems()}

            <Grid item xs={12} sm={12} lg={12} xl={12} className={classes.grid}>
            </Grid>

            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Button
                id="reset"
                variant="contained"
                color="primary"
                onClick={this.processClearButton}
                aria-label="edit"
                className={classes.button1}
                style={{ backgroundColor: '#1ca9c9' }}
              >
                {translate("common.page.button.reset")}
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <div style={{
                spacing: 1,
                position: 'relative'
              }}>
                <Button
                  id="save"
                  color="primary"
                  variant="contained"
                  onClick={this.processCreateUser}
                  aria-label="edit"
                  className={classes.button1}
                  disabled={this.state.loading}
                  style={{
                    backgroundColor: this.state.loading ? 'grey' : '#1ca9c9',
                  }}
                >
                  {this.state.loading && <CircularProgress size={24} className={'success'} style={{
                    color: 'green[500]',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: -12,
                    marginLeft: -12,
                  }} />}
                  {translate("common.page.button.save")}
                </Button>
              </div>
            </Grid>
          </Grid>
        </Paper>
        {this.state.isenabled &&
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            open={this.state.isenabled}
            autoHideDuration={3000}
            onClose={this.handleClose}
            variant={this.state.variantType}
            message={this.state.message}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.createusers,
  organizationList: state.organizationList.orgList,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport,
    },
    dispatch
  );
export default withRouter(
  withStyles(DashboardStyles)(
    connect(mapStateToProps, mapDispatchToProps)(CreateUser)));
