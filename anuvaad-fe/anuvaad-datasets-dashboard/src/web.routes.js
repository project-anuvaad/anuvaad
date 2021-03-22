import React from "react";
import { Route, Redirect, Switch, Router } from "react-router-dom";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import Login from "./ui/containers/web/Login";
import Layout from "./ui/containers/web/Layout";

import NotFound from "./ui/containers/web/NotFound";
import history from "./web.history";

const PrivateRoute = ({ component: Component, authenticate, ...rest }) => (
  <Route {...rest} render={props => (authenticate ? <Layout component={Component} {...props} /> : <Redirect to={{ pathname: "/" }} />)} />
);

class AppRoutes extends React.Component {
  authenticateUser = () => {
    const { user } = this.props;
    const token = localStorage.getItem("token");
    if (user.token || token) {
      return true;
    }
    return false;
  };

  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path="/" component={Login} />
            <PrivateRoute path="/*" component={NotFound} authenticate={this.authenticateUser()} />
          </Switch>
        </div>
      </Router>
    );
  }
}

AppRoutes.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.login,
  apistatus: state.apistatus
});

export default connect(
  mapStateToProps,
  null
)(AppRoutes);
