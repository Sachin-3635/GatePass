import * as React from "react";
import { HashRouter, Switch, Route, useLocation } from "react-router-dom";

import type { IGatepassProps } from "./IGatepassProps";

import Sidebar from "./Pages/Sidebar";
import ApproverDashboard from "./Pages/ApproverDashboard";
import RequesterDashboard from "./Pages/RequesterDashboard";
import NewRequest from "./Pages/NewRequest";
import ApproverForm from "./Pages/ApproverForm";
import EditForm from "./Pages/EditForm";
import ViewForm from "./Pages/ViewForm";
const GatepassLayout: React.FC<IGatepassProps> = (props) => {
  const location = useLocation();

  // Hide sidebar only for New Request page
  //  const hideSidebar =
  //  location.pathname === "/NewRequest" ||
  // location.pathname === "/ApproverForm";
  const hideSidebar =
    location.pathname === "/NewRequest" ||
    location.pathname.startsWith("/ApproverForm") ||
    location.pathname.startsWith("/EditForm") ||
    location.pathname.startsWith("/ViewForm");

  return (
    <div
      className="container-fluid"
      style={{
        display: "flex",
        width: "100%",
      }}
    >
      {!hideSidebar && <Sidebar {...props} />}

      <div
        className="main"
        style={{
          width: hideSidebar ? "100%" : "calc(100% - 200px)",
          transition: "width 0.3s ease", margin: "0px 8px"
        }}
      >
        <Switch>
          <Route
            exact
            path="/ApproverDashboard"
            render={() => <ApproverDashboard {...props} />}
          />
          <Route exact path="/" render={() => <RequesterDashboard {...props} />} />
          <Route exact path="/NewRequest" render={() => <NewRequest {...props} />} />
          <Route exact path="/ApproverForm/:id" render={() => <ApproverForm {...props} />} />
          <Route exact path="/EditForm/:id" render={() => <EditForm {...props} />} />
          <Route exact path="/ViewForm/:id" render={() => <ViewForm {...props} />} />

          {/* <Route path="/ApproverForm/:id" component={ApproverForm} /> */}
        </Switch>
      </div>
    </div>
  );
};

export default class Gatepass extends React.Component<IGatepassProps> {
  public render(): React.ReactElement<IGatepassProps> {
    return (
      <HashRouter>
        <GatepassLayout {...this.props} />
      </HashRouter>
    );
  }
}
