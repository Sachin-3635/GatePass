import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import type { IGatepassProps } from "../IGatepassProps";
import "../Pages/Css/Sidebars.scss";

const Sidebar: React.FC<IGatepassProps> = (props) => {

  const location = useLocation();

  return (
    <div className="sidebar">

      <div className="sidehead">
        <div className="logo">
          <img width="25" height="25"
          //  alt="logo"
          />
        </div>

        <div className="sidehead-right">
          {/* SONA COMSTAR */}
        </div>
      </div>


      <div className="sidehead-user">
        <img
          width={20}
          height={20}
          style={{ margin: "10px 20px" }}
        // alt="user"
        />

        {props.userDisplayName}
      </div>


      <ul className="nav">
        <li className="nav-item">
          <Link
            to="/"
            className={
              location.pathname === "/"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Requestor Dashboard
          </Link>
        </li>

        <li className="nav-item">
          <Link
            to="/ApproverDashboard"
            className={
              location.pathname === "/ApproverDashboard"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Approval Dashboard
          </Link>
        </li>




      </ul>

    </div>
  );
};

export default Sidebar;