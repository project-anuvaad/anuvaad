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
import ViewDocument from "./ui/containers/web/ViewDocument";
import DocumentEditor from './ui/containers/web/Interactive-Editor/DocumentEditor';
import FileUpload from './ui/containers/web/Interactive-Editor/FileUpload';
import Translate from "./ui/containers/web/Dashboard";



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

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/dashboard`}
              title={translate('dashboard.page.heading.title')}
              component={Translate}
              authenticate={this.authenticateUser}
              currentMenu="dashboard"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-upload`}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={FileUpload}
              title={translate('dashboard.page.heading.title')}
              authenticate={this.authenticateUser}
              currentMenu="texttranslate"
            />

            
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-document`}
              title={translate('common.page.title.document')}
              component={ViewDocument}
              userRoles={["editor", "user"]}
              authenticate={this.authenticateUser}
              currentMenu="viewdocument"
              dontShowLoader
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-document/:locale/:jobid/:inputfileid/:modelId`}
              // path={`${process.env.PUBLIC_URL}/interactive-document/:fileid/:inputfileid`}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={DocumentEditor}
              title={translate('dashboard.page.heading.title')}
              authenticate={this.authenticateUser}
              dontShowLoader
              currentMenu="texttranslate"
            />
            <PrivateRoute path={`${process.env.PUBLIC_URL}/*`} component={NotFound} authenticate={this.authenticateUser} />
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
