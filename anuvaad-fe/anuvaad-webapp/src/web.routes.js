import React from "react";
import { Route, Redirect, Switch, Router } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Logout from "./ui/containers/web/User/Logout";
import Layout from "./ui/containers/web/common/Layout";
import NotFound from "./ui/containers/web/common/NotFound";

import history from "./web.history";
import Login from "./ui/containers/web/User/Login";
import UserProfile from "./ui/containers/web/User/UserProfile";

import InstantTranslate from "./ui/containers/web/TranslateSentence/Dashboard";

import Signup from "./ui/containers/web/User/SignUp";
import Activate from "./ui/containers/web/User/Activate";
// import IntractiveTranslate from "./ui/containers/web/IntractiveTranslation";
import { translate } from '../src/assets/localisation';
import UpdatePassword from './ui/containers/web/User/UpdatePassword';
import SetPassword from './ui/containers/web/User/SetPassword';
import DocumentEditorV1 from './ui/containers/web/DocumentEditor/DocumentEditor.v1';

import FileUpload from './ui/containers/web/DocumentUpload/FileUpload';
import ViewDocument from './ui/containers/web/DocumentTranslate/ViewDocument';
import UserDetails from "./ui/containers/web/AdminPanel/UserDetails";
import CreateUser from "./ui/containers/web/AdminPanel/CreateUser";
import TmxUpload from "./ui/containers/web/AdminPanel/TmxUpload";
import UserReport from './ui/containers/web/AdminPanel/UserReport';
import DocumentStats from './ui/containers/web/AdminPanel/DocumentStats';
import OrganizationList from './ui/containers/web/AdminPanel/OrganizatonList';
import AddOrganization from "./ui/containers/web/AdminPanel/AddOrganization";
import ViewDocumentDigitization from './ui/containers/web/DocumentDigitization/ViewDocumentDigitization';
import DigitzeDocumentUpload from './ui/containers/web/DocumentDigitization/DocumentDigitizationUpload/StartDigitizationUpload';
import DigitizedDocumentEditor from './ui/containers/web/DocumentDigitization/DigitizedDocumentEditor';

const PrivateRoute = ({ headerAttribute: headerAttribute, component: Component, userRoles, title, drawer, showLogo, forDemo, dontShowLoader, dontShowHeader, currentMenu, authenticate, ...rest }) => (
  <Route
    {...rest}
    render={props =>

      authenticate(userRoles) ? (

        <Layout
          dontShowLoader={dontShowLoader}
          currentMenu={currentMenu}
          showLogo={showLogo}
          component={Component}
          headerAttribute={headerAttribute}
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
      const userRoles = [localStorage.getItem("roles")] //JSON.parse(localStorage.getItem("roles"));
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
    return false;
  };

  render() {
    // const roles = localStorage.getItem("roles");
    return (
      <Router history={history} basename="/dev">
        <div>
          <Switch>
            <Route exact path={`${process.env.PUBLIC_URL}/`} component={Login} />
            {/* <Route exact path={`${process.env.PUBLIC_URL}/callback`} component={Callback} /> */}
            <Route exact path={`${process.env.PUBLIC_URL}/logout`} component={Logout} />
            {/* <Route
            exact
              path={`${process.env.PUBLIC_URL}/signup`}
              title="Sign up"
              component={Signup}
              dontShowHeader={true}
              currentMenu="signup"
            /> */}

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
              path={`${process.env.PUBLIC_URL}/interactive-document/:jobid/:inputfileid/:modelId/:filename`}
              userRoles={["TRANSLATOR"]}
              component={DocumentEditorV1}
              title="Translate file"
              authenticate={this.authenticateUser}
              dontShowLoader
              currentMenu="texttranslate"
              dontShowHeader={true}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-digitization/:jobId/:filename/:inputfileid/:og_fname`}
              userRoles={["TRANSLATOR"]}
              component={DigitizedDocumentEditor}
              title="Digitized File"
              authenticate={this.authenticateUser}
              dontShowLoader
              currentMenu="texttranslate"
              dontShowHeader={true}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-upload`}
              userRoles={["TRANSLATOR"]}
              component={FileUpload}
              title="Start Translate"
              authenticate={this.authenticateUser}
              currentMenu="texttranslate"
              dontShowHeader={true}
            />

          
            {/* <PrivateRoute
              path={`${process.env.PUBLIC_URL}/forgot-password`}
              title="Forgot Password"
              authenticate={() => true}
              component={UpdatePassword}
              drawer
              dontShowHeader={true}
              currentMenu="forgot-password"
            /> */}

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/glossary-upload`}
              dontShowLoader
              title={"Glossary Upload"}
              userRoles={["ADMIN"]}
              component={TmxUpload}
              authenticate={this.authenticateUser}
              currentMenu="glossary-upload"

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

            {/* <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-translate`}
              title={translate('webroutes.page.title.anuvaadEditor')}
              userRoles={["TRANSLATOR"]}
              component={IntractiveTranslate}
              authenticate={this.authenticateUser}
              currentMenu="interactive-translate"
            /> */}

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-document`}
              dontShowLoader
              title={"Document Translate"}
              userRoles={["TRANSLATOR"]}
              component={ViewDocument}
              authenticate={this.authenticateUser}
              currentMenu="view-document"
              dontShowHeader={true}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-digitization`}
              dontShowLoader
              title={"Document Digitization"}
              userRoles={["TRANSLATOR"]}
              component={ViewDocumentDigitization}
              authenticate={this.authenticateUser}
              currentMenu="document-digitization"
              dontShowHeader={true}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/digitize-document-upload`}
              dontShowLoader
              title={"Start Digitization"}
              userRoles={["TRANSLATOR"]}
              component={DigitzeDocumentUpload}
              authenticate={this.authenticateUser}
              currentMenu="digitize-document-upload"

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/create-user`}
              title={translate('create.user.page.heading.title')}
              component={CreateUser}
              userRoles={["ADMIN"]}
              authenticate={this.authenticateUser}
              currentMenu="create-user"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/user-details/:pageno`}
              dontShowLoader
              title={"User Details"}
              userRoles={["ADMIN"]}
              component={UserDetails}
              authenticate={this.authenticateUser}
              currentMenu="user-details"
              dontShowHeader={true}
            />


            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/add-organization`}
              title={translate('Add Organization')}
              component={AddOrganization}
              userRoles={["ADMIN"]}
              authenticate={this.authenticateUser}
              currentMenu="add-organization"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/organization-list`}
              dontShowLoader
              title={"Organization List"}
              userRoles={["ADMIN"]}
              component={OrganizationList}
              authenticate={this.authenticateUser}
              currentMenu="organization-list"
              dontShowHeader={true}

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/user-report/:id/:name`}
              dontShowLoader
              title={"User Report"}
              userRoles={["ADMIN"]}
              component={UserReport}
              authenticate={this.authenticateUser}
              currentMenu="user-report"
              dontShowHeader={true}
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-stats/:recordId/:fname`}
              dontShowLoader
              title={"Document Stats"}
              userRoles={["ADMIN"]}
              component={DocumentStats}
              authenticate={this.authenticateUser}
              currentMenu="document-stats"
              dontShowHeader={true}
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
