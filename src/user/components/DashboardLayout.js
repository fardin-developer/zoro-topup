import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import axios from "axios";
import { message } from "antd";
import { setQuery } from "../../redux/features/querySlice";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { query } = useSelector((state) => state.query);
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.clear("token");
    dispatch(setUser(null));
    navigate("/login");
  };

  async function getQueryStatus() {
    try {
      const res = await axios.post("/api/contact/get-user-query", {
        email: user?.email,
      });
      if (res.data.success) {
        const hasUnseen = res.data.data.some((item) => item.seen === false);
        if (hasUnseen) {
          dispatch(setQuery(false));
        } else {
          dispatch(setQuery(true));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getQueryStatus();
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-menu d-none d-lg-block">
        <h4>Menu</h4>
        <hr />
        <ul>
          <li
            onClick={() => navigate("/user-dashboard")}
            className={`${location.pathname === "/user-dashboard" && "active"}`}
          >
            Dashboard
          </li>
          <li
            onClick={() => navigate("/wallet")}
            className={`${location.pathname === "/wallet" && "active"}`}
          >
            Wallet
          </li>
          <li
            onClick={() => navigate("/orders")}
            className={`${location.pathname === "/orders" && "active"}`}
          >
            Orders
          </li>
          <li
            onClick={() => navigate("/payments")}
            className={`${location.pathname === "/payments" && "active"}`}
          >
            Payments
          </li>
          <li
            onClick={() => navigate("/my-account")}
            className={`${location.pathname === "/my-account" && "active"}`}
          >
            Account
          </li>
          <li
            onClick={() => navigate("/query")}
            className={`tp ${location.pathname === "/query" && "active"}`}
          >
            Queries
            {!query && <span>new</span>}
          </li>
          <li style={{ cursor: "pointer" }} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      </div>
      <div className="dashboard-content">{children}</div>
    </div>
  );
};

export default DashboardLayout;
