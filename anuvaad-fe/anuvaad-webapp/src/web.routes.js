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
import GradeDocument from './ui/containers/web/GradeDocument/SentenceCard';
import ViewAnnotationJob from './ui/containers/web/GradeDocument/ViewAnnotationJobs';
import ViewScheduledJobs from './ui/containers/web/AdminPanel/ScheduleAnnotationJob/ViewScheduledJobs';
import ScheduleJob from './ui/containers/web/AdminPanel/ScheduleAnnotationJob/ScheduleJob';
import ViewJobDetail from './ui/containers/web/AdminPanel/ScheduleAnnotationJob/ViewJobDetails';
import ViewAnnotatorJob from './ui/containers/web/AdminPanel/ScheduleAnnotationJob/ViewAnnotatorJob';
import NmtModelAssign from "./ui/containers/web/AdminPanel/NmtModelAssign";
import ViewUserGlossary from './ui/containers/web/UserGlossary/ViewUserGlossary';
import UserGlossaryUpload from './ui/containers/web/UserGlossary/UserGlossaryUpload';
import UservEventView from './ui/containers/web/AdminPanel/UserEventView';
import OrganizationGlossary from "./ui/containers/web/AdminPanel/OrganizationGlossary";
import SuggestedGlossaryList from "./ui/containers/web/AdminPanel/SuggestedGlossaryList";
import MySuggestedGlossary from "./ui/containers/web/UserGlossary/MySuggestedGlossary";
import UserManagement from "./ui/containers/web/User/UserManagement";

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
            {/* UserManagement */}
            <Route exact path={`${process.env.PUBLIC_URL}/user/:page`} component={UserManagement} />
            {/* <Route exact path={`${process.env.PUBLIC_URL}/user/:page`} component={Login} /> */}
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
              currentMenu="instant-translate"
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
              path={`${process.env.PUBLIC_URL}/interactive-document/:jobid/:inputfileid/:modelId/:filename/:workflow/:source_language_code/:target_language_code`}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={DocumentEditorV1}
              title="Translate file"
              authenticate={this.authenticateUser}
              dontShowLoader
              currentMenu="texttranslate"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/interactive-digitization/:jobId/:filename/:inputfileid/:og_fname`}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={DigitizedDocumentEditor}
              title="Digitized File"
              authenticate={this.authenticateUser}
              dontShowLoader
              currentMenu="texttranslate"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-upload/:type`}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={FileUpload}
              title="Start Translate"
              authenticate={this.authenticateUser}
              currentMenu="texttranslate"
              dontShowHeader={false}
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
              path={`${process.env.PUBLIC_URL}/glossary-upload`}
              dontShowLoader
              title={"Glossary Upload"}
              userRoles={["ADMIN", "SUPERADMIN"]}
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
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={ViewDocument}
              authenticate={this.authenticateUser}
              currentMenu="view-document"
              dontShowHeader={false}
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/grading-sentence-card/:taskId`}
              dontShowLoader
              title={"Grade Document"}
              userRoles={["ANNOTATOR"]}
              component={GradeDocument}
              authenticate={this.authenticateUser}
              currentMenu="grade-document"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-digitization`}
              dontShowLoader
              title={"Document Digitization"}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={ViewDocumentDigitization}
              authenticate={this.authenticateUser}
              currentMenu="document-digitization"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/digitize-document-upload`}
              dontShowLoader
              title={"Start Digitization"}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={DigitzeDocumentUpload}
              authenticate={this.authenticateUser}
              currentMenu="digitize-document-upload"

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/create-user`}
              title={translate('create.user.page.heading.title')}
              component={CreateUser}
              userRoles={["ADMIN", "SUPERADMIN"]}
              authenticate={this.authenticateUser}
              currentMenu="create-user"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/user-details`}
              dontShowLoader
              title={"User Details"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={UserDetails}
              authenticate={this.authenticateUser}
              currentMenu="user-details"
              dontShowHeader={false}
            />


            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/add-organization`}
              title={translate('Add Organization')}
              component={AddOrganization}
              userRoles={["ADMIN", "SUPERADMIN"]}
              authenticate={this.authenticateUser}
              currentMenu="add-organization"
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/organization-list`}
              dontShowLoader
              title={"Organization List"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={OrganizationList}
              authenticate={this.authenticateUser}
              currentMenu="organization-list"
              dontShowHeader={false}

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/organization-glossary/:orgId`}
              dontShowLoader
              title={"Organization Glossary"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={OrganizationGlossary}
              authenticate={this.authenticateUser}
              currentMenu="organization-glossary"
              dontShowHeader={false}

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/suggestion-list/:orgId`}
              dontShowLoader
              title={"Suggestion List"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={SuggestedGlossaryList}
              authenticate={this.authenticateUser}
              currentMenu="suggestion-list"
              dontShowHeader={false}

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/my-suggestions/:orgId`}
              dontShowLoader
              title={"My Suggestions"}
              userRoles={["TRANSLATOR"]}
              component={MySuggestedGlossary}
              authenticate={this.authenticateUser}
              currentMenu="my-suggestions"
              dontShowHeader={false}

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/user-report/:id/:name`}
              dontShowLoader
              title={"User Report"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={UserReport}
              authenticate={this.authenticateUser}
              currentMenu="user-report"
              dontShowHeader={false}
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/document-stats/:recordId/:fname`}
              dontShowLoader
              title={"Document Stats"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={DocumentStats}
              authenticate={this.authenticateUser}
              currentMenu="document-stats"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-scheduled-jobs`}
              dontShowLoader
              title={"View Job"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={ViewScheduledJobs}
              authenticate={this.authenticateUser}
              currentMenu="view-scheduled-jobs"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/schedule-annotation-job`}
              dontShowLoader
              title={"Create Annotation Job"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={ScheduleJob}
              authenticate={this.authenticateUser}
              currentMenu="schedule-annotation-job"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/assign-nmt-model`}
              dontShowLoader
              title={"Assign models"}
              userRoles={["ADMIN", "TRANSLATOR"]}
              component={NmtModelAssign}
              authenticate={this.authenticateUser}
              currentMenu="assign-nmt-model"
              dontShowHeader={false}
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-annotation-job`}
              dontShowLoader
              title={"View Annotation Job"}
              userRoles={["ANNOTATOR"]}
              component={ViewAnnotationJob}
              authenticate={this.authenticateUser}
              currentMenu="view-annotation-job"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-job-detail/:jobID`}
              dontShowLoader
              title={"View Annotation Job"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={ViewJobDetail}
              authenticate={this.authenticateUser}
              currentMenu="view-job-detail"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/view-annotator-job/:taskId`}
              dontShowLoader
              title={"View Annotator Job"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={ViewAnnotatorJob}
              authenticate={this.authenticateUser}
              currentMenu="view-job-detail"
              dontShowHeader={false}
            />
            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/my-glossary`}
              dontShowLoader
              title={"My Glossary"}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={ViewUserGlossary}
              authenticate={this.authenticateUser}
              currentMenu="my-glossary"
              dontShowHeader={false}
            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/user-glossary-upload`}
              dontShowLoader
              title={"User Glossary Upload"}
              userRoles={["TRANSLATOR", "ANNOTATOR"]}
              component={UserGlossaryUpload}
              authenticate={this.authenticateUser}
              currentMenu="user-glossary-upload"

            />

            <PrivateRoute
              path={`${process.env.PUBLIC_URL}/user-event-view/:jobId/:uid`}
              dontShowLoader
              title={"User Event View"}
              userRoles={["ADMIN", "SUPERADMIN"]}
              component={UservEventView}
              authenticate={this.authenticateUser}
              currentMenu="user-event-view"

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
