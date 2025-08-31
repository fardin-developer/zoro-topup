import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/features/userSlice";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const res = await axios.get("https://api.zorotopup.com/api/v1/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data && res.data._id) {
        setUserData(res.data);
      } else {
        message.error("Failed to fetch user data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="user-accout-details" style={{ minHeight: "300px" }}>
        <div className="row accountform">
          <h4>Your Profile</h4>

          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={user?.name || ""}
                readOnly
              />
            </div>
          </div>

          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Wallet Balance</label>
              <input
                type="text"
                className="form-control"
                value={user?.walletBalance !== undefined ? user.walletBalance : ""}
                readOnly
              />
            </div>
          </div>

          <div
            className="logout-container"
            onClick={() => {
              localStorage.removeItem("token");
              dispatch(setUser(null));
              navigate("/login");
            }}
          >
            <h5 className="m-0">Logout</h5>
            <LogoutIcon className="icon" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
