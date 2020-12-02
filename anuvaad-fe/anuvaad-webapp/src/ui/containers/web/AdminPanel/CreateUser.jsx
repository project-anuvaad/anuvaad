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
import CreateUsers from "../../../../flux/actions/apis/createusers";
import Snackbar from "../../../components/web/common/Snackbar";
import history from "../../../../web.history";
import CircularProgress from "@material-ui/core/CircularProgress"

const roles = require('./roles.json')

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      emailid: '',
      password: '',
      roleCode: '',
      roleInfo:'',
      isenabled: false,
      variantType: '',
      message: '',
      loading:false,
    };
  }
  renderItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'row' }}>
        <Grid item xs={6} sm={6} lg={7} xl={4} style={{ textAlign: 'left' }}>
          <Typography value="" variant="h5" style={{ marginLeft: '25%', marginTop: '2vh'}}>
            {translate("common.page.label.name")}&nbsp;
          </Typography>
          <Typography value="" variant="h5" style={{ marginLeft: '25%', marginTop: '3vh'}}>
            {translate("common.page.label.email")}&nbsp;
          </Typography>
          <Typography value="" variant="h5" style={{ marginLeft: '25%', marginTop: '3vh'}}>
            {translate("common.page.label.password")}&nbsp;
          </Typography>
        </Grid>
          <FormControl variant="outlined" >
            <TextField variant="outlined" value={this.state.name} onChange={this.handleInputReceived('name')} style={{ marginBottom: '1vh' ,width:'12.5vw'}}></TextField>
            <TextField variant="outlined" value={this.state.emailid} onChange={this.handleInputReceived('emailid')} type="email-username" style={{ marginBottom: '1vh',width:'12.5vw' }}></TextField>
            <TextField variant="outlined" value={this.state.password} onChange={this.handleInputReceived('password')} type="password" style={{ marginBottom: '1vh',width:'12.5vw' }}></TextField>
          </FormControl>
      </Grid>
    )

  }
  renderRoleItems = () => {
    return (
      <Grid item xs={12} sm={12} lg={12} xl={12} className={this.props.classes.rowData}>
        <Grid item xs={6} sm={6} lg={7} xl={6} className={this.props.classes.label}>
          <Typography value="" variant="h5" style={{ marginLeft: '25%', marginTop: '1vh'}}>
            {translate("common.page.roles")}&nbsp;
          </Typography>
        </Grid>
          <FormControl variant="outlined">
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={this.state.roleCode}
              onChange={this.processOnSelect}
              style={
              {
                width:'12.5vw'
              }
              }
            >
              {
                roles.map((role, i) => <MenuItem key={role.roleCode} value={role.roleCode}>{role.roleCode}</MenuItem>)
              }
            </Select>
          </FormControl>
      </Grid>
    )
  }


  processOnSelect = (e) => {
    const roleInfo = roles.filter(role=>{
      return role["roleCode"].includes(e.target.value)
    });
    this.setState({roleCode:e.target.value,roleInfo:roleInfo})
  }


  processClearButton = () => {
    this.setState({
      name: '',
      emailid: '',
      password: '',
      roleCode: '',
      roleInfo:''
    })
  }

  processCreateUser = () => {
    if (this.handleValidation('name') && this.handleValidation('emailid') && this.handleValidation('password')  && this.handleValidation('roleCode'))  {
      var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var passwordFormat = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})");
      if (this.state.emailid.match(mailFormat)) {
        if (this.state.password.match(passwordFormat)) {
          const token = localStorage.getItem("token");
          const { emailid, name, password, roleInfo } = this.state
          const createUserObj = new CreateUsers(emailid, name, password, roleInfo, token);
          try {
            this.setState({
              name: '',
              emailid: '',
              password: '',
              roleCode: '',
              roleInfo:'',
              loading:true,
            })
            fetch(createUserObj.apiEndPoint(), {
              method: 'post',
              body: JSON.stringify(createUserObj.getBody()),
              headers: createUserObj.getHeaders().headers
            })
              .then(async res => {
                if (res.ok) {
                  res.json().then(obj => {
                    this.setState({
                      loading:false,
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
                    res.json().then(obj => {
                      this.setState({
                        loading:false,
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
              roleInfo:'',
              isenabled: true,
              loading:false,
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
    this.setState({isenabled:false})
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
        <Paper className={classes.userdetailspaper}>
          <Grid container>
            <Grid item xs={12} sm={12} lg={12} xl={12} style={{ display: 'flex', flexDirection: 'column' }}>
            {this.renderItems()}
            {this.renderRoleItems()}
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{ marginTop: '3%' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.processClearButton}
                aria-label="edit"
                className={classes.button1}
                style={{marginLeft:'27%'}}
              >
                {translate("common.page.button.reset")}
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6} style={{ marginTop: '3%'}}>
              <Button
                color="primary"
                variant="contained"
                onClick={this.processCreateUser}
                aria-label="edit"
                className={classes.button1}
                style={{backgroundColor: this.state.loading && "grey",marginRight:'19%',marginLeft:'5%'}}
              >
                {this.state.loading && <CircularProgress size={24} className={'success'} className={classes.buttonProgress} />}
                {translate("common.page.button.save")}
              </Button>
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
