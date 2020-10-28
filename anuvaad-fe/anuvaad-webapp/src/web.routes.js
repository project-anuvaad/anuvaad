import React from "react";
import { Route, Redirect, Switch, Router } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Logout from "./ui/containers/web/Logout";
import Layout from "./ui/containers/web/Layout";
import Callback from "./ui/containers/web/Callback";
import NotFound from "./ui/containers/web/NotFound";

import history from "./web.history";
import Home from "./ui/containers/web/Home";
import Translate from "./ui/containers/web/Translate";
import UserProfile from "./ui/containers/web/UserProfile";

import UserDirectory from "./ui/containers/web/UserDirectory";
import InstantTranslate from "./ui/containers/web/Dashboard";

import Signup from "./ui/containers/web/SignUp";
import Activate from "./ui/containers/web/Activate";
import IntractiveTranslate from "./ui/containers/web/IntractiveTranslation";
import InteractiveEditor from "./ui/containers/web/Interactive-Editor/InteractiveEditor";

import InteractivePreview from "./ui/containers/web/Interactive-Editor/Preview"
import { translate } from '../src/assets/localisation';
import UpdatePassword from './ui/containers/web/UpdatePassword';
import SetPassword from './ui/containers/web/SetPassword';
import pdfFileEditor from './ui/containers/web/Interactive-Editor/PdfFileEditor';
import InteractivePdfFile from './ui/containers/web/Interactive-Editor/InteractivePdfFile';
import DocumentEditor from './ui/containers/web/Interactive-Editor/DocumentEditor';
import FileUpload from './ui/containers/web/Interactive-Editor/FileUpload';
import ViewDocument from './ui/containers/web/ViewDocument';


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
    // const roles = localStorage.getItem("roles");
    return (
      <Router history={history} basename="/dev">
        <div>
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Home} />
            <Route exact path={`${process.env.PUBLIC_URL}/callback`} component={Callback} />
            <Route exact path={`${process.env.PUBLIC_URL}/logout`} component={Logout} />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/profile`}
              title={translate('webroutes.page.title.profile')}
              component={UserProfile}
              authenticate={this.authenticateUser}
              currentMenu="profile"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/instant-translate`}
              title={translate('dashboard.page.heading.title')}
              component={InstantTranslate}
              authenticate={this.authenticateUser}
              currentMenu="dashboard"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/activate/:uid/:rid`}
              title="Activate"
              authenticate={() => true}
              component={Activate}
              drawer
              dontShowHeader={true}
              currentMenu="activate"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-pdf`}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={InteractivePdfFile}
              title={translate('dashboard.page.heading.title')}
              authenticate={this.authenticateUser}
              currentMenu="texttranslate"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-document/:locale/:tgt_locale/:targetlang/:jobid/:inputfileid/:modelId`}
              // path={`${process.env.PUBLIC_URL}/interactive-document/:fileid/:inputfileid`}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={DocumentEditor}
              title={translate('dashboard.page.heading.title')}
              authenticate={this.authenticateUser}
              dontShowLoader
              currentMenu="texttranslate"
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
              path={`${process.env.PUBLIC_URL}/translate-v1`}
              component={Translate}
              authenticate={this.authenticateUser}
              currentMenu="translate-v1"
            />
            
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/signup`}
              title="Sign up"
              authenticate={() => true}
              component={Signup}
              drawer
              dontShowHeader={true}
              currentMenu="signup"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/forgot-password`}
              title="Forgot Password"
              authenticate={() => true}
              component={UpdatePassword}
              drawer
              dontShowHeader={true}
              currentMenu="forgot-password"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/set-password/:uid/:rid`}
              title="Set Password"
              authenticate={() => true}
              component={SetPassword}
              drawer
              dontShowHeader={true}
              currentMenu="set-password"
            />
            
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/userdirectory`}
              title={translate('webroutes.page.title.userDirectory')}
              component={UserDirectory}
              userRoles={["admin"]}
              authenticate={this.authenticateUser}
              currentMenu="userdirectory"
            />
            
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-translate`}
              title={translate('webroutes.page.title.anuvaadEditor')}
              userRoles={["editor", "dev", "interactive-editor", "grader"]}
              component={IntractiveTranslate}
              authenticate={this.authenticateUser}
              currentMenu="interactive-translate"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-editor/:fileid`}
              title={"Document Translate"}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={InteractiveEditor}
              authenticate={this.authenticateUser}
              currentMenu="view-pdf"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-preview/:fileid`}
              title={translate('webroutes.page.title.anuvaadEditor')}
              userRoles={["editor", "dev", "interactive-editor"]}
              component={InteractivePreview}
              authenticate={this.authenticateUser}
              currentMenu="view-pdf"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/pdf-file-editor`}
              title={translate('webroutes.page.title.anuvaadEditor')}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={pdfFileEditor}
              authenticate={this.authenticateUser}
              currentMenu="view-pdf"
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-document`}
              dontShowLoader
              title={"Document Translate"}
              userRoles={["editor", "dev", "grader", "interactive-editor"]}
              component={ViewDocument}
              authenticate={this.authenticateUser}
              currentMenu="view-document"
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
