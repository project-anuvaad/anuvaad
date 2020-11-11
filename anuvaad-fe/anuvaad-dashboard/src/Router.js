import React from "react";
import loadable from "@loadable/component";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import Auth from "./helpers/auth";
import HelpPage from "./components/dashboard/HelpPage";
import ListReports from "./components/report/ListReports";
import Forms from "./components/form/Forms";
import ListDashboards from "./components/admin/dashboard/ListDashboards";
import DashboardLayout from "./components/admin/dashboard/DashboardLayout";
import DashboardAccess from "./components/admin/dashboard/DashboardAccess";
import DashboardFilters from "./components/admin/dashboard/DashboardFilters";
import DashboardWidgets from "./components/admin/dashboard/DashboardWidgets";
import AddRole from "./components/admin/role/AddRole";
import ListRoles from "./components/admin/role/ListRoles";
import AddUser from "./components/admin/user/AddUser";
import ListUsers from "./components/admin/user/ListUsers";
import ListVisualizations from "./components/admin/visualization/ListVisualizations";
import VisualizationAccess from "./components/admin/visualization/VisualizationAccess";
import VisualizationData from "./components/admin/visualization/VisualizationData";
import ListFilters from "./components/admin/filter/ListFilters";
import FilterDetails from "./components/admin/filter/FilterDetails";
import ListForms from "./components/admin/form/ListForms";
import FormAccess from "./components/admin/form/FormAccess";
import FormLayout from "./components/admin/form/FormLayout";
import AddForm from "./components/admin/form/AddForm";
import ListAdminReports from "./components/admin/report/ListReports";
import ReportAccess from "./components/admin/report/ReportAccess";
import ReportDetails from "./components/admin/report/ReportDetails";
import ReportFilters from "./components/admin/report/ReportFilters";

// Code splitting using loadable components
const Login = loadable(() => import("./components/login/Login"));
const Dashboard = loadable(() => import("./components/dashboard/Dashboard"));

/* Router function to enable routing between the various components
 * in the project with authentication as well as authorization
 */

const Router = props => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Login} />
      <Route path="/login" component={Login} />
      <PrivateRoute exact path="/home" component={Dashboard} />
      <PrivateRoute exact path="/dashboards" component={Dashboard} />
      <PrivateRoute exact path="/reports" component={ListReports} />
      <PrivateRoute exact path="/reports/:id/details" component={ListReports} />
      <PrivateRoute exact path="/forms" component={Forms} />
      <PrivateRoute exact path="/forms/:id/details" component={Forms} />
      <PrivateRoute exact path="/forms/add" component={Forms} />
      <PrivateRoute exact path="/forms/:id/edit" component={Forms} />
      <PrivateRoute exact path="/forms/:id/uploads" component={Forms} />
      <PrivateRoute exact path="/forms/:id/records" component={Forms} />
      <PrivateRoute exact path="/admin/dashboards" component={ListDashboards} />
      <PrivateRoute
        exact
        path="/admin/dashboards/:id/layout"
        component={DashboardLayout}
      />
      <PrivateRoute
        exact
        path="/admin/dashboards/:id/access"
        component={DashboardAccess}
      />
      <PrivateRoute
        exact
        path="/admin/dashboards/:id/filters"
        component={DashboardFilters}
      />
      <PrivateRoute
        exact
        path="/admin/dashboards/:id/widgets"
        component={DashboardWidgets}
      />
      <PrivateRoute exact path="/admin/roles" component={ListRoles} />
      <PrivateRoute exact path="/admin/roles/:id/edit" component={AddRole} />
      <PrivateRoute exact path="/admin/roles/add" component={AddRole} />
      <PrivateRoute exact path="/admin/users" component={ListUsers} />
      <PrivateRoute exact path="/admin/users/add" component={AddUser} />
      <PrivateRoute exact path="/helpPage" component={HelpPage} />
      <PrivateRoute
        exact
        path="/admin/visualizations"
        component={ListVisualizations}
      />
      <PrivateRoute
        exact
        path="/admin/visualizations/:id/access"
        component={VisualizationAccess}
      />
      <PrivateRoute
        exact
        path="/admin/visualizations/:id/data"
        component={VisualizationData}
      />
      <PrivateRoute exact path="/admin/filters" component={ListFilters} />
      <PrivateRoute
        exact
        path="/admin/filters/:id/details"
        component={FilterDetails}
      />
      <PrivateRoute exact path="/admin/forms" component={ListForms} />
      <PrivateRoute
        exact
        path="/admin/forms/:id/access"
        component={FormAccess}
      />
      <PrivateRoute
        exact
        path="/admin/forms/:id/layout"
        component={FormLayout}
      />
      <PrivateRoute exact path="/admin/forms/:id/edit" component={AddForm} />
      <PrivateRoute exact path="/admin/forms/add" component={AddForm} />
      <PrivateRoute exact path="/admin/reports" component={ListAdminReports} />
      <PrivateRoute
        exact
        path="/admin/reports/:id/details"
        component={ReportDetails}
      />
      <PrivateRoute
        exact
        path="/admin/reports/:id/access"
        component={ReportAccess}
      />
      <PrivateRoute
        exact
        path="/admin/reports/:id/filters"
        component={ReportFilters}
      />
    </Switch>
  </BrowserRouter>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      Auth.isLoggedIn() ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/" }} />
      )
    }
  />
);

export default Router;
