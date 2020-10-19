import React from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "../../components/web/common/Header";
import GlobalStyles from "../../styles/web/styles";
import Spinner from "../../components/web/common/Spinner";
// import Theme from "../../theme/web/theme-red";
import Snackbars from '../../components/web/common/Snackbar'
import Theme from "../../theme/web/theme-anuvaad";
import APITransport from "../../../flux/actions/apitransport/apitransport";
import history from "../../../web.history";



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      tocken: false,
      matches: window.matchMedia("(max-width: 1120px)").matches
    };
  }

  renderSpinner() {
    if (this.props.apistatus.progress) {
      return <Spinner />;
    }
  }

  handlDrawerTocken = () => {
    this.setState({ tocken: true })
  }

  handleTockenChange() {
    this.setState({ tocken: !this.state.tocken })
  }


  renderMessage() {
    if (this.props.apistatus.message) {
      return <Snackbars message={this.props.apistatus.message} variant={this.props.apistatus.error ? 'error' : 'success'} />;
    }
  }

  componentDidMount() { }

  componentDidUpdate(prevProps) {
    if (prevProps.apistatus !== this.props.apistatus) {
      if (this.props.apistatus.unauthrized) {
        history.push(`${process.env.PUBLIC_URL}/logout`);
      }
    }
  }

  render() {
    const { classes, theme, title, drawer, showLogo, forDemo, dontShowLoader, dontShowHeader, currentMenu } = this.props;
    const Component = this.props.component; // eslint-disable-line
    return (
      <MuiThemeProvider theme={Theme}>
        <div className={classes.root} >
          {!dontShowLoader &&
            this.renderSpinner()
          }
          {!dontShowHeader &&
            <Header dontShowHeader={dontShowHeader} currentMenu={currentMenu} forDemo={forDemo || showLogo} classes={classes} theme={theme} title={title} drawer={drawer} tocken={this.state.tocken} handleTockenChange={this.handleTockenChange.bind(this)} />
          }
          <div style={dontShowHeader ? { width: '100%' } : {}} className={dontShowHeader ? '' : (forDemo ? classes.containerDemo : classes.container)} onClick={this.handlDrawerTocken.bind(this)}>
            {/* {forDemo &&
              <div style={{
                position: 'absolute',
                height: '100%',
                width: '44%',
                marginLeft: this.state.matches ? '23%' : '25%'
              }}>
                <img src={logo} style={{
                  width: '70%',
                  height: '80%',
                  opacity: '0.1',
                  display: 'block',
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }} />
              </div>
            } */}
            <Component />
          </div>
          {this.renderMessage()}
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
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
)(withStyles(GlobalStyles(Theme), { withTheme: true })(App));
