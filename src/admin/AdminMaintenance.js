import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import "./AdminMaintenance.css";

const AdminNotification = () => {
  const [pass, setPass] = useState(false);
  const [mainBtn, setMainBtn] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [loading, setLoading] = useState(false);

  function checkPass() {
    if (pass === "ashir@#$123") {
      setMainBtn(true);
    } else {
      setMainBtn(false);
    }
  }

  async function handleMaintenance() {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/admin/update-website",
        { email: "admin@gmail.com" },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        setToggle(true);
        setLoading(false);
        getWebsite();
      } else {
        message.error(res.data.message);
        setLoading(false);
        setToggle(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToggle(false);
    }
  }
  async function getWebsite() {
    try {
      const res = await axios.get("/api/admin/get-website");
      if (res.data.success) {
        setToggle(res.data.data.website);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getWebsite();
  }, []);

  return (
    <div className="maintenance">
      {mainBtn ? (
        <div className={`toggle-icon`} onClick={handleMaintenance}>
          <div className={`circlee ${toggle && "active"}`}>
            {loading && (
              <div className="spinner-grow spinner-grow-sm" role="status">
                <span className="sr-only"></span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setPass(e.target.value)}
          />
          <button onClick={checkPass}>Submit</button>
        </>
      )}
    </div>
  );
};

export default AdminNotification;
