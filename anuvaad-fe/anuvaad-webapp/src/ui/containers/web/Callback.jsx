import React from "react";
import history from "../../../web.history";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import UserAuth from "../../../flux/actions/apis/userprofile";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {  MuiThemeProvider } from "@material-ui/core/styles";
import Theme from "../../theme/web/theme-anuvaad";

class Callback extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true
    }
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.userProfile !== this.props.userProfile && localStorage.getItem("lang" + this.props.userProfile.id)) {
      if (this.props.userProfile.isActive) {
        localStorage.setItem("userDetails", this.props.userProfile.firstname + " " + this.props.userProfile.lastname);
        localStorage.setItem("userProfile", JSON.stringify(this.props.userProfile));
        
          // history.push(`${process.env.PUBLIC_URL}/dashboard`);
        history.push(`${process.env.PUBLIC_URL}/view-document`);

        
      }
    }else if(this.state.loading && this.props.userProfile && this.props.userProfile.id && !localStorage.getItem("lang" + this.props.userProfile.id)){
      this.setState({
        loading: false
      })
    }
  }

  componentDidMount() {
    let hash = this.props.location.hash.split("&");
    hash.map(h => {
      if (h.indexOf("access_token") > 0) {
        localStorage.setItem("token", h.split("access_token=")[1]);
        let api = new UserAuth();
        this.props.APITransport(api);
        // history.push(`${process.env.PUBLIC_URL}/corpus`)
      } else if (h.indexOf("error") > 0) {
        localStorage.removeItem("token");
        history.push(`${process.env.PUBLIC_URL}/logout`);
      }
      return true;
    });
  }
  handleButtonClick(lang) {

    if (this.props.userProfile.isActive) {
      localStorage.setItem("userDetails", this.props.userProfile.firstname + " " + this.props.userProfile.lastname);
      localStorage.setItem("lang" + this.props.userProfile.id, lang)
      localStorage.setItem("userProfile", JSON.stringify(this.props.userProfile));
      
        // history.push(`${process.env.PUBLIC_URL}/dashboard`);
        history.push(`${process.env.PUBLIC_URL}/view-document`);
      
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={Theme}>
        {!this.state.loading ?
          <Paper style={{ marginLeft: "30%", width: "30%", marginTop: "8%", textAlign: 'center', padding: '5%' }} >
            <Grid container spacing={8} style={{ paddingBottom:'4%' }}>
              <Grid item xs={12} sm={12} lg={12} xl={12}  >
                <Typography variant="title">
                  Select Your Preferred Language{" "}
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={8} style={{ marginTop: '4%' }}>
              <Grid item xs={12} sm={12} lg={12} xl={12}>

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{borderRadius:'20px',height: '46px'}}
                  onClick={event => {
                    this.handleButtonClick('en');
                  }}
                >
                  English
    </Button>

              </Grid>
            </Grid>
            <Grid container spacing={8} style={{ marginTop: '4%' }}>
              <Grid item xs={12} sm={12} lg={12} xl={12}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{borderRadius:'20px',height: '46px'}}
                  fullWidth
                  onClick={event => {
                    this.handleButtonClick('hi');
                  }}
                >
                  हिन्दी
      </Button>
              </Grid>
            </Grid>
          </Paper>
          :
          <div>{'Loading Please wait..'}</div>
        }
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  apistatus: state.apistatus,
  userProfile: state.userProfile
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      APITransport
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Callback);
