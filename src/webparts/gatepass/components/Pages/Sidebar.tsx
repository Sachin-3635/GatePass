import * as React from "react";
import { Link, useLocation } from "react-router-dom";

import type { IGatepassProps } from "../IGatepassProps";
import "../Pages/Css/Sidebars.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';

import logo from "../../assets/Logosec.png";
// import LogoText from "../../assets/LogoText.png";

const Sidebar: React.FC<IGatepassProps> = (props) => {

  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidehead">
        <div className="logo">
          <img src={logo}/>
        </div>
        {/* <div className="sidehead-right">
          <img src={LogoText} alt="" />
        </div> */}
      </div>
      <div className="sidehead-user">
        <i className="fas fa-user" style={{ marginLeft: "20px", marginRight: "15px" }}></i>
        {props.userDisplayName}
      </div>
  
      <ul className="nav">
        <li className="nav-item">
          <Link to="/" className={ location.pathname === "/" ? "nav-link active" : "nav-link"}>
            Requestor Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/ApproverDashboard" className={ location.pathname === "/ApproverDashboard" ? "nav-link active" : "nav-link"}>
            Approval Dashboard
          </Link>
        </li>
      </ul>

    </div>
  );
};

export default Sidebar;