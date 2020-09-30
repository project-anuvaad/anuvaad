import React from "react";
import { Route, Redirect, Switch, Router } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import history from "./web.history";

/**
 * app localization
 */
import { translate } from '../src/assets/localisation';


/**
 * view container to cater to
 *  - translator
 *  - admin
 */
import Home from "./ui/containers/web/Home";
import Logout from "./ui/containers/web/Logout";
import Layout from "./ui/containers/web/Layout";
import Callback from "./ui/containers/web/Callback";
import NotFound from "./ui/containers/web/NotFound";

import ViewTranslate from "./ui/containers/web/ViewTranslate";



const PrivateRoute = ({ component: Component, userRoles, title, drawer, showLogo, forDemo, dontShowLoader, dontShowHeader, currentMenu, authenticate, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      authenticate(userRoles) ? (
        <Layout
          dontShowLoader={dontShowLoader}
          currentMenu={currentMenu}
          showLogo={showLogo}
          component={Component}
          title={title}
          forDemo={forDemo}
          drawer={drawer}
          dontShowHeader={dontShowHeader}
          {...props}
        />
      ) : (
          <Redirect to={`${process.env.PUBLIC_URL}/logout`} />
        )
    }
  />
);

class AppRoutes extends React.Component {

  authenticateUser = allowedRoles => {
    let count = 0;
    const token = localStorage.getItem("token");
    if (localStorage.getItem("roles")) {
      const userRoles = JSON.parse(localStorage.getItem("roles"));
      if (token) {
        if (allowedRoles && Array.isArray(allowedRoles)) {
          allowedRoles.map(allowedRole => {
            userRoles.map(userRole => {
              if (userRole === allowedRole) {
                count += 1;
              }
              return true;
            });
            return true;
          });
          if (count > 0) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    }
    alert(translate('webroutes.page.alert.somethingWentWrongTryAgain'));
  };

  render() {
    return (
      <Router history={history} basename="/dev">
        <div>
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
            <Route exact path={`${process.env.PUBLIC_URL}/callback`} component={Callback} />
            <Route exact path={`${process.env.PUBLIC_URL}/logout`} component={Logout} />


            <PrivateRoute path={`${process.env.PUBLIC_URL}/*`} component={NotFound} authenticate={this.authenticateUser} />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/viewtranslate`}
              title={translate('common.page.title.document')}
              component={ViewTranslate}
              userRoles={["editor", "user"]}
              authenticate={this.authenticateUser}
              currentMenu="viewtranslate"
            />
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

export default connect(mapStateToProps, null)(AppRoutes);
