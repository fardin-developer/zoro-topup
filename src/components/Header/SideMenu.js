import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./SideMenu.css";
import { message } from "antd";
import IMAGES from "../../img/image";

const SideMenu = ({ sideMenu, setSideMenu }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const [submenu, setSubmenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successful");
    navigate("/login");
  };
  return (
    <div
      className={`sidemenu-container d-block d-md-block d-lg-none ${
        sideMenu ? "active" : ""
      }`}
    >
      <div className="sidemenu">
        <HighlightOffIcon
          onClick={() => setSideMenu(!sideMenu)}
          className="close-icon"
        />
        <ul className="p-0">
          <li
            className={`${location.pathname === "/" && "active"}`}
            onClick={() => setSideMenu(!sideMenu)}
          >
            <Link to="/">Home</Link>
          </li>
          {user && (
            <li
              className={`${
                location.pathname === "/user-dashboard" && "active"
              }`}
              onClick={() => setSideMenu(!sideMenu)}
            >
              <Link to="/user-dashboard">Dashboard</Link>
            </li>
          )}
          {user && (
            <li
              className={`${location.pathname === "/my-account" && "active"}`}
              onClick={() => setSideMenu(!sideMenu)}
            >
              <Link to="/my-account">Account</Link>
            </li>
          )}
          {user && (
            <li
              className={`${location.pathname === "/orders" && "active"}`}
              onClick={() => setSideMenu(!sideMenu)}
            >
              <Link to="/orders">Orders</Link>
            </li>
          )}
          {user && (
            <li
              className={`${location.pathname === "/query" && "active"}`}
              onClick={() => setSideMenu(!sideMenu)}
            >
              <Link to="/query">Queries</Link>
            </li>
          )}
          {user && (
            <li
              className={`${location.pathname === "/wallet" && "active"}`}
              onClick={() => setSideMenu(!sideMenu)}
            >
              <Link to="/wallet">Wallet</Link>
            </li>
          )}
          <li
            className={`${location.pathname === "/games" && "active"}`}
            onClick={() => setSideMenu(!sideMenu)}
          >
            <Link onClick={() => setSideMenu(!sideMenu)} to="/games">
              Games
            </Link>
          </li>
          <li
            className={`${location.pathname === "/leaderboard" && "active"}`}
            onClick={() => setSideMenu(!sideMenu)}
          >
            <Link onClick={() => setSideMenu(!sideMenu)} to="/leaderboard">
              Leaderboard
            </Link>
          </li>
          <li
            className={`${location.pathname === "/support" && "active"}`}
            onClick={() => setSideMenu(!sideMenu)}
          >
            <Link onClick={() => setSideMenu(!sideMenu)} to="/support">
              Support
            </Link>
          </li>
          {!user && (
            <div
              className="sidemenu-action-btn"
              onClick={() => setSideMenu(!sideMenu)}
            >
              <Link to="/login">Login</Link>
            </div>
          )}
          {user && (
            <div className="logout" onClick={handleLogout}>
              Logout
              <LogoutIcon className="icon" />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
