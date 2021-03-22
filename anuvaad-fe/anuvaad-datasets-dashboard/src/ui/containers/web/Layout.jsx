import React from "react";
import { withStyles, MuiThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Header from "../../components/web/common/Header";
import GlobalStyles from "../../styles/web/styles";
import Theme from "../../theme/web/theme-red";
// import Theme from '../../theme/web/theme-default';
import APITransport from "../../../flux/actions/apitransport/apitransport";

class App extends React.Component {
  render() {
    const { classes, theme } = this.props;
    const Component = this.props.component; // eslint-disable-line
    return (
      <MuiThemeProvider theme={Theme}>
        <div className={classes.root}>
          <Header classes={classes} theme={theme} />
          <div className={classes.container}>
            <Component />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus
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
