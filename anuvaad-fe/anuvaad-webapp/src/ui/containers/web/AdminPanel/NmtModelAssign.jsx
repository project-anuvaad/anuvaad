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
import Toolbar from "../../web/AdminPanel/AssignNmtHeader";
import CreateUsers from "../../../../flux/actions/apis/user/createusers";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import history from "../../../../web.history";
import Alert from '@material-ui/lab/Alert';
import CircularProgress from "@material-ui/core/CircularProgress";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Autocomplete from '@material-ui/lab/Autocomplete';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import ADMINCONFIG from "../../../../configs/adminConfig";
import FetchUserDetails from "../../../../flux/actions/apis/user/userdetails";
import FetchOrganizationList from "../../../../flux/actions/apis/organization/organization-list";
import FetchModel from "../../../../flux/actions/apis/common/fetchmodel";
import modelUpdate from "../../../../flux/actions/apis/user/update_user";
import Chip from '@material-ui/core/Chip';
import profileDetails from '../../../../flux/actions/apis/user/profile_details';
const TELEMETRY = require("../../../../utils/TelemetryManager");
const LANG_MODEL = require('../../../../utils/language.model');
const roles = ADMINCONFIG.roles;



const theme = createMuiTheme({
  overrides: {
    MuiDropzoneArea: {
      root: {
        paddingTop: '15%',
        top: "auto",
        width: '100%',
        minHeight: '380px',
        height: "85%",
        borderColor: '#2C2799',
        backgroundColor: '#F5F9FA',
        border: '1px dashed #2C2799',
        fontColor: '#2C2799',
        marginTop: "3%",
        marginLeft: '1%',
        "& svg": { color: '#2C2799', },
        "& p": {
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          fontSize: "19px",
          color: '#2C2799',

        }
      },

    }
  }
});
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
      source_languages: [],
      target_languages: [],
      modelList: [],
      source_language_code: '',
      target_language_code: '',
      model_selected: '',
      array_of_users: [],
      selectedUsers: [],
      modelName: 'No model is currently assigned'
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

  processFetchBulkUserDetailAPI = (offset, limit, updateExisiting = false, updateUserDetail = false, userIDs = [], userNames = [], roleCodes = []) => {
    const token = localStorage.getItem("token");
    const userObj = new FetchUserDetails(offset, limit, token, updateExisiting, updateUserDetail, userIDs, userNames, roleCodes)
    this.props.APITransport(userObj)
  }

  processFetchBulkOrganizationAPI = () => {
    const userObj = new FetchOrganizationList()
    this.props.APITransport(userObj)
  }
  /**
   * life cycle methods
   */
  componentDidMount() {
    const roles = localStorage.getItem('roles')
    const { APITransport } = this.props;
    const apiModel = new FetchModel();
    APITransport(apiModel);
    this.setState({ showLoader: true });
    this.props.fetch_models.models.length == 0 && this.processFetchBulkUserDetailAPI(this.state.offset, this.state.limit)

  }

  componentDidUpdate(prevProps, prevState) {

    if (prevProps.fetch_models.models != this.props.fetch_models.models) {
      this.setState({
        source_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
        target_languages: LANG_MODEL.get_supported_languages(this.props.fetch_models.models, true),
        showLoader: false
      })
    }
    if ((this.state.target_language_code !== prevState.target_language_code ||
      this.state.source_language_code !== prevState.source_language_code)
      && (this.state.source_language_code && this.state.target_language_code)
    ) {
      this.getModelName()
    }
  }












  processClearButton = () => {
    this.setState({
      source_language_code: '',
      target_language_code: '',
      model_selected: [],
      array_of_users: []


    })
  }

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


  processSourceLanguageSelected = (event) => {
    this.setState({ source_language_code: event.target.value })

    const languages = LANG_MODEL.get_counterpart_languages(this.props.fetch_models.models, event.target.value, true)
    this.state.target_language_code && this.getModelIDS(event.target.value, this.state.target_language_code)
    this.setState({
      target_languages: languages
    })
  }

  processTargetLanguageSelected = (event) => {

    this.setState({ target_language_code: event.target.value, selectedUsers: [] })
    this.state.source_language_code && this.getModelIDS(this.state.source_language_code, event.target.value)
  }

  getModelIDS = (source_language_code, target_language_code) => {

    const models = LANG_MODEL.get_nmt_models(this.props.fetch_models.models, source_language_code, target_language_code)

    this.setState({
      modelList: models
    })
  }

  processModelSelected = (event) => {
    const selectedUsers = LANG_MODEL.get_selected_users(this.props.userinfo.data, event.target.value.uuid)
    this.setState({ model_selected: event.target.value, selectedUsers })



  }

  addUser = (e, value) => {

    this.setState({ array_of_users: value })
  }




  handleInputReceived = prop => event => this.setState({ [prop]: event.target.value });

  handleValidation(key) {
    if (!this.state[key] || this.state[key].length < 2) {
      return false
    }
    return true
  }

  renderSourceLanguagesItems = () => {
    const { classes } = this.props
    return (<Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
      <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label} style={{ marginTop: '2%' }}>
        <Typography
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            fontFamily: "Roboto",
            marginBottom: 2
          }}
        >
          {translate("common.page.label.sourceLang")}{" "}
        </Typography>
      </Grid>

      <Grid item xs={6} sm={6} lg={4} xl={4} >
        <Select
          labelId="demo-simple-select-outlined-label"
          id="source-lang"
          onChange={this.processSourceLanguageSelected}
          value={this.state.source_language_code}
          fullWidth
          className={classes.Select}
          style={{
            fullWidth: true,
            float: 'right',
            marginBottom: "15px"
          }}
          input={
            <OutlinedInput name="source" id="source" />
          }
        >
          {
            this.state.source_languages.map(lang =>
              <MenuItem id={lang.language_name} key={lang.language_code} style={{fontSize: "16px", fontFamily: "Roboto"}} value={lang.language_code + ''}>{lang.language_name}</MenuItem>)
          }
        </Select>
      </Grid>
    </Grid>
    )
  }

  renderTargetLanguagesItems = () => {
    const { classes } = this.props
    return (<Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
      <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label} style={{ marginTop: '2%' }}>
        <Typography
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              fontFamily: "Roboto",
              marginBottom: 2
            }}
          >
          {translate("common.page.label.targetLang")}{" "}
        </Typography>
      </Grid>

      <Grid item xs={6} sm={6} lg={4} xl={4} >
        <Select
          labelId="demo-simple-select-outlined-label"
          id="source-lang"
          onChange={this.processTargetLanguageSelected}
          value={this.state.target_language_code}
          fullWidth
          className={classes.Select}
          style={{
            fullWidth: true,
            float: 'right',
            marginBottom: "15px"
          }}
          input={
            <OutlinedInput name="source" id="source" />
          }
        >
          {
            this.state.target_languages.map(lang =>
              <MenuItem key={lang.language_code} value={lang.language_code} style={{fontSize: "16px", fontFamily: "Roboto"}}>{lang.language_name}</MenuItem>)
          }
        </Select>
      </Grid>
    </Grid>
    )
  }

  renderModelList = () => {
    const { classes } = this.props
    return (<Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
      <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label} style={{ marginTop: '2%' }}>
        <Typography
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            fontFamily: "Roboto",
            marginBottom: 2
          }}
        >
          Select model
        </Typography>
      </Grid>

      <Grid item xs={6} sm={6} lg={4} xl={4} >
        <Select
          labelId="demo-simple-select-outlined-label"
          id="source-lang"
          onChange={this.processModelSelected}
          value={this.state.model_selected}
          fullWidth
          className={classes.Select}
          style={{
            fullWidth: true,
            float: 'right',
            marginBottom: "15px"
          }}
          input={
            <OutlinedInput name="source" id="source" />
          }
        >
          {

            this.state.modelList.map(model =>
              <MenuItem key={model.uuid} value={model} style={{fontSize: "16px", fontFamily: "Roboto"}}>{model.model_name}</MenuItem>)
          }
        </Select>
      </Grid>
    </Grid>)
  }

  handleAssignModel = () => {
    let roles = localStorage.getItem('roles');
    let userID = JSON.parse(localStorage.getItem('userProfile'))
    let selected_users = roles === 'TRANSLATOR' ? [userID] : this.state.array_of_users;
    if (selected_users.length > 0 && this.state.source_language_code) {
      selected_users.map((user, i) => {

        let models = LANG_MODEL.get_model_list(user, this.state.modelList, this.state.model_selected)
        user.models = models
      })

      const apiObj = new modelUpdate(
        selected_users
      );
      this.informUserProgress('Adding nmt model to users')
      const apiReq = fetch(apiObj.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
        if (!response.ok) {
          if (Number(response.status) === 401) {
            this.handleRedirect()
          }
          else {
            this.informUserStatus(rsp_data.message ? "rsp_data.message" : rsp_data.why ? rsp_data.why : "Upload failed", false)
          }

          return Promise.reject('');
        } else {
          if (rsp_data.http.status == 200) {
            this.informUserStatus(rsp_data.message ? "rsp_data.message" : rsp_data.why ? rsp_data.why : "Assigned nmt models to selected users.", true)
            setTimeout(async () => {
              const token = localStorage.getItem('token')
              const apiObj = new profileDetails(token);
              const apiReq = fetch(apiObj.apiEndPoint(), {
                method: 'post',
                body: JSON.stringify(apiObj.getBody()),
                headers: apiObj.getHeaders().headers
              }).then(async response => {
                const rsp_data = await response.json();
                if (!response.ok) {
                  return Promise.reject('');
                } else {
                  let resData = rsp_data && rsp_data.data
                  localStorage.setItem("userProfile", JSON.stringify(resData));
                  if (roles.includes('ADMIN')) {
                    history.push(`${process.env.PUBLIC_URL}/user-details`);
                  } else if (roles.includes('TRANSLATOR')) {
                    history.push(`${process.env.PUBLIC_URL}/view-document`);
                  }
                  else {
                    history.push(`${process.env.PUBLIC_URL}/view-document`);
                  }
                }
              }).catch((error) => {
                console.log('api failed because of server or network')
              });
            }, 3000)
          }
          else {
            this.informUserStatus(rsp_data.message ? rsp_data.message : "Assigning nmt model to users failed.", false)
          }



        }
      }).catch((error) => {
        this.informUserStatus("Assigning nmt model to users failed", false)
      });


    } else {
      alert("Field should not be empty!");
    }

  }

  renderExistingUser = () => {
    return <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
      <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label} style={{ marginTop: '2%' }}>
        <Typography
          style={{
            fontSize: "0.9rem",
            fontWeight: "600",
            fontFamily: "Roboto",
            marginBottom: 2
          }}
        >
          Existing Users
        </Typography>
      </Grid>
      <Grid item xs={6} sm={6} lg={4} xl={4} >


        {this.state.selectedUsers.length > 0 && this.state.selectedUsers.map((value, i) =>
          <Chip key={i} label={value.email} style={{ margin: "1px" }} />
        )}
      </Grid>
    </Grid>

  }

  renderUserList = () => {
    const roles = localStorage.getItem('roles')
    return <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
      {
        roles !== 'TRANSLATOR' &&
        <>
          <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label} style={{ marginTop: '2%' }}>
            <Typography
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                fontFamily: "Roboto",
                marginBottom: 2
              }}
            >
              Assign Users
            </Typography>
          </Grid>
          <Grid item xs={6} sm={6} lg={4} xl={4} >
            <Autocomplete
              multiple
              id="tags-outlined"
              options={this.props.userinfo.data.filter(user => (user.is_active && (user.roles !== 'ADMIN')))}
              getOptionLabel={(option) => option.userName}
              filterSelectedOptions
              onChange={(e, value) => this.addUser(e, value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </>
      }
    </Grid>
  }


  getModelName = () => {
    let userProfile = JSON.parse(localStorage.getItem('userProfile'))
    if (userProfile.hasOwnProperty('models')) {
      let data = userProfile['models'].filter(model => model.src_lang === this.state.source_language_code && model.tgt_lang === this.state.target_language_code)
      if (data.length) {
        let model_info = this.props.fetch_models.models.filter(model => model.uuid === data[0]['uuid'])
        if (model_info.length) {
          this.setState({ modelName: model_info[0]['model_name'] })
        }
      } else {
        let model_info = this.props.fetch_models.models.filter(model => model.source_language_code === this.state.source_language_code && model.target_language_code === this.state.target_language_code && model.is_primary)
        if (model_info.length) {
          this.setState({ modelName: model_info[0]['model_name'] })
        }
      }
    } else {
      let model_info = this.props.fetch_models.models.filter(model => model.source_language_code === this.state.source_language_code && model.target_language_code === this.state.target_language_code && model.is_primary)
      if (model_info.length) {
        this.setState({ modelName: model_info[0]['model_name'] })
      }
    }
  }

  renderCurrentActiveModel = () => {
    const { classes } = this.props
    return (
      <Grid container style={{ marginTop: '4%' }}>
        <Grid item xs={6} sm={6} lg={8} xl={8} className={this.props.classes.label}>
          <Typography
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
              fontFamily: "Roboto",
              marginBottom: 2
            }}
          >
            {"Current Active Model"}{" "}
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4} >
          <Typography 
            style={{
              fontSize: "1rem",
              fontWeight: "700",
              fontFamily: "Roboto",
              marginBottom: 2
            }} 
            className={this.props.classes.label}
          >
            {this.state.modelName}
          </Typography>
        </Grid>
      </Grid>
    )
  }

  render() {
    const { classes } = this.props;
    let roles = localStorage.getItem('roles')
    return (
      <div className={classes.root}>
        <Toolbar />
        <Typography className={classes.typographyHeader} style={{paddingTop: "2%", fontSize: "19px", fontWeight: "500"}}>
          Assign NMT Model
        </Typography>
        <Paper className={classes.paper}>
          <Grid container>
            {this.renderSourceLanguagesItems()}

            {this.renderTargetLanguagesItems()}
            {this.renderModelList()}
            {roles !== 'TRANSLATOR' && this.state.selectedUsers.length > 0 && Object.keys(this.state.model_selected).length > 0 && this.renderExistingUser()}
            {roles !== 'TRANSLATOR' && this.renderUserList()}
            {
              roles === 'TRANSLATOR' && this.state.target_language_code && this.state.source_language_code ?
                this.renderCurrentActiveModel() :
                <div />
            }

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
                style={{ backgroundColor: '#2C2799' }}
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
                  onClick={this.handleAssignModel}
                  aria-label="edit"
                  className={classes.button1}
                  disabled={this.state.loading}
                  style={{
                    backgroundColor: this.state.loading ? 'grey' : '#2C2799',
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
        {this.state.apiInProgress ? this.renderProgressInformation() : <div />}
        {this.state.showStatus ? this.renderStatusInformation() : <div />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.createusers,
  fetch_models: state.fetch_models,
  userinfo: state.userinfo,
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
