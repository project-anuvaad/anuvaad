import React from "react";
import { withRouter } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import APITransport from "../../../../flux/actions/apitransport/apitransport";
import { translate } from "../../../../assets/localisation";
import { withStyles } from "@material-ui/core/styles";
import DashboardStyles from "../../../styles/web/DashboardStyles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Toolbar from "../../web/AdminPanel/AddOrganizationHeader";
import AddOrg from "../../../../flux/actions/apis/organization/addOrganization";
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import history from "../../../../web.history";
import CircularProgress from "@material-ui/core/CircularProgress";
import ADMINCONFIG from "../../../../configs/adminConfig";
import TextareaAutosize from "react-autosize-textarea";

const TELEMETRY = require("../../../../utils/TelemetryManager");

const roles = ADMINCONFIG.roles;
const orgID = ADMINCONFIG.orgID;

class CreateUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      variantType: "",
      message: "",
      loading: false,
    };
  }

  renderOrgName = () => {
    return (
      <Grid
        item
        xs={12}
        sm={12}
        lg={12}
        xl={12}
        className={this.props.classes.rowData}
        style={{ marginTop: "0%" }}
      >
        <Grid
          item
          xs={6}
          sm={6}
          lg={8}
          xl={8}
          style={{ textAlign: "left", marginTop: "auto", marginBottom: "0" }}
        >
          <Typography value="" variant="h5">
            Organization Name
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4}>
          <FormControl
            variant="outlined"
            style={{
              width: "92%",
              fullWidth: true,
              display: "flex",
              wrap: "nowrap",
              height: "40px",
              magin: "dense",
              marginLeft: "4.3%",
              marginBottom: "4%",
            }}
          >
            <TextField
              id="name"
              type="text"
              onChange={this.handleInputReceived("name")}
              value={this.state.name}
              variant="outlined"
            ></TextField>
          </FormControl>
        </Grid>
      </Grid>
    );
  };

  renderDescription = () => {
    return (
      <Grid
        item
        xs={12}
        sm={12}
        lg={12}
        xl={12}
        className={this.props.classes.rowData}
      >
        <Grid
          item
          xs={6}
          sm={6}
          lg={8}
          xl={8}
          className={this.props.classes.label}
          style={{ marginTop: "2%" }}
        >
          <Typography value="" variant="h5">
            Description
          </Typography>
        </Grid>

        <Grid item xs={6} sm={6} lg={4} xl={4}>
          <TextareaAutosize
             onChange={this.handleInputReceived("description")}
             value={this.state.description}
            rows={3}
            style={{
              width: "82%",
              fullWidth: true,
              borderColor: "#BEBEBE",
              padding: "5%",
              display: "flex",
              wrap: "nowrap",
              height: "40px",
              outlineColor: "rgb(28, 154, 183)",
              magin: "dense",
              marginLeft: "4.3%",
              fontSize: "1rem",
              marginBottom: "4%",
              fontFamily: '"Source Sans Pro","Regular","Arial", "sans-serif"',
            }}
          />
        </Grid>
      </Grid>
    );
  };

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

  handleRedirect = () =>{
    this.informUserStatus(translate('common.page.label.TOKEN_EXPIRED'), false)
    setTimeout(() => { history.push(`${process.env.PUBLIC_URL}/`);}, 3000)
  }

 

  handleReset = () => {this.setState({name:'', description:''})};

 
    async handleAddOrg() {
    
      // TELEMETRY.addOrganization(this.state.name, this.state.description)
      if(this.state.name && this.state.description){
        let apiObj = new AddOrg(this.state.name, this.state.description, true)
      this.informUserProgress("Adding new organization")
      const apiReq = fetch(apiObj.apiEndPoint(), {
        method: 'post',
        body: JSON.stringify(apiObj.getBody()),
        headers: apiObj.getHeaders().headers
      }).then(async response => {
        const rsp_data = await response.json();
        if (!response.ok) {
          TELEMETRY.log("add-organization", JSON.stringify(rsp_data))
          if(Number(response.status)===401){
            this.handleRedirect()
          }
          else{
            this.informUserStatus(rsp_data.message ? "rsp_data.message": rsp_data.why ? rsp_data.why : "Upload failed", false)
          }
          
          return Promise.reject('');
        } else {
          this.setState({name:'', description:'' })
          if(rsp_data.http.status== 200){
              this.informUserStatus(rsp_data.message ? "rsp_data.message": rsp_data.why ? rsp_data.why :"New organization added.", true)
              setTimeout(async () => {
                history.push(`${process.env.PUBLIC_URL}/organization-list`);
              }, 2000)
          }
          else{
              this.informUserStatus(rsp_data.why ? rsp_data.why : "Adding organization Failed.", false)
          }
          
          
  
        }
      }).catch((error) => {
        this.informUserStatus("Organization add failed", false)
      });
      }
      else{
        alert("Fields should not be empty")
      }
      
    
  

  };

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

  handleInputReceived = (prop) => (event) =>
    this.setState({ [prop]: event.target.value });

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Toolbar />
        <Typography variant="h4" className={classes.typographyHeader}>
          Add Organization
        </Typography>
        <Paper className={classes.paper}>
          <Grid container>
            {this.renderOrgName()}
            {this.renderDescription()}

            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              xl={12}
              className={classes.grid}
            ></Grid>

            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <Button
                id="reset"
                variant="contained"
                color="primary"
                onClick={this.handleReset}
                aria-label="edit"
                className={classes.button1}
                style={{ backgroundColor: "#2C2799" }}
              >
                {translate("common.page.button.reset")}
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} lg={6} xl={6}>
              <div
                style={{
                  spacing: 1,
                  position: "relative",
                }}
              >
                <Button
                  id="save"
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    this.handleAddOrg();
                  }}
                  
                  aria-label="edit"
                  className={classes.button1}
                  disabled={this.state.loading}
                  style={{
                    backgroundColor: this.state.loading ? "grey" : "#2C2799",
                  }}
                >
                  {this.state.loading && (
                    <CircularProgress
                      size={24}
                      className={"success"}
                      style={{
                        color: "green[500]",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        marginTop: -12,
                        marginLeft: -12,
                      }}
                    />
                  )}
                  Add
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

const mapStateToProps = (state) => ({
  user: state.createusers,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      APITransport,
    },
    dispatch
  );
export default withRouter(
  withStyles(DashboardStyles)(
    connect(mapStateToProps, mapDispatchToProps)(CreateUser)
  )
);
