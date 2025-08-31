import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import DashboardLayout from "./components/DashboardLayout";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import TollIcon from "@mui/icons-material/Toll";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ListAltIcon from "@mui/icons-material/ListAlt";
import getUserData from "../utils/userDataService.js";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [allOrders, setAllOrders] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState("");

  useEffect(() => {
    getUserData(null, null, setBalance);
  }, []);

  const getAllUserOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/order/get-user-orders",
        { email: user?.email },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setAllOrders(res.data.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  async function getUserPayments() {
    try {
      const res = await axios.post(
        "/api/payment/get-user-payments",
        { email: user?.email },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user !== null) {
      getAllUserOrders();
      getUserPayments();
    }
  }, [user]);

  return (
    <Layout>
      <div className="user-dashboard">
        <h4>Welcome Back! User</h4>
        <div className="shadow dash-card" onClick={() => navigate("/orders")}>
          <div className="count">
            <span>Total Orders</span>
            <h1 className="m-0">
              <b>{allOrders?.length || 0}</b>
            </h1>
          </div>
        </div>
        <div className="shadow dash-card" onClick={() => navigate("/wallet")}>
          <div className="count">
            <span>Wallet Balance</span>
            <h1 className="m-0">
              <b>₹{balance}</b>
            </h1>
          </div>
        </div>
        <div className="shadow dash-card" onClick={() => navigate("/payments")}>
          <div className="count">
            <span>Payments</span>
            <h1 className="m-0">
              <b>{payments?.length || 0}</b>
            </h1>
          </div>
        </div>
        <div
          className="shadow dash-card"
          onClick={() => navigate("/my-account")}
        >
          <div className="count">
            <span>Account</span>
            <h1 className="m-0">01</h1>
          </div>
        </div>
        {/* <div className="shadow dash-card" onClick={() => navigate("/query")}>
          <div className="count">
            <span>Queries</span>
            <h1 className="m-0">--</h1>
          </div>
        </div> */}
        <h5>Quick Actions</h5>
        <div className="quickbuttons">
          <button onClick={() => navigate("/wallet")}>
            <AccountBalanceWalletIcon className="icon" />
            Add Money
          </button>
          <button onClick={() => navigate("/")}>
            <SportsEsportsIcon className="icon" />
            Recharge Games
          </button>
          <button onClick={() => navigate("/orders")}>
            <ListAltIcon className="icon" />
            View Orders
          </button>
          <button onClick={() => navigate("/referandearn")}>
            <GroupAddIcon className="icon" />
            Refer & Earn
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
