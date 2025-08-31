import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import LoginIcon from "@mui/icons-material/Login";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import "./StickyFooter.css";

const StickyFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [menu, setMenu] = useState(false);

  function handleMenu() {
    setMenu(!menu);
  }

  function handleClose(e) {
    e.stopPropagation();
    setMenu(!menu);
  }

  function handleLogout() {
    dispatch(setUser(null));
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="sticky-footer d-block d-lg-none">
      <div className="footer-tabs">
        <div
          onClick={() => navigate("/")}
          className={`footer-icon ${location.pathname === "/" && "active"}`}
        >
          <HomeIcon className="icon" />
          <span>Home</span>
        </div>
        {user && (
          <>
            <div
              onClick={() => navigate("/orders")}
              className={`footer-icon ${
                location.pathname === "/orders" && "active"
              }`}
            >
              <ShoppingBagIcon className="icon" />
              <span>Orders</span>
            </div>
            <div
              onClick={() => navigate("/user-dashboard")}
              className={`footer-icon ${
                location.pathname === "/user-dashboard" && "active"
              }`}
            >
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </div>
          </>
        )}

        <div
          onClick={() => navigate("/leaderboard")}
          className={`footer-icon ${
            location.pathname === "/leaderboard" && "active"
          }`}
        >
          <LeaderboardIcon className="icon" />
          <span>Leaderboard</span>
        </div>

        <div
          onClick={() => navigate("/support")}
          className={`footer-icon ${
            location.pathname === "/support" && "active"
          }`}
        >
          <SupportAgentIcon className="icon" />
          <span>Support</span>
        </div>
        {!user && (
          <div
            onClick={() => navigate("/login")}
            className={`footer-icon ${
              location.pathname === "/login" && "active"
            }`}
          >
            <LoginIcon className="icon" />
            <span>Login</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyFooter;
