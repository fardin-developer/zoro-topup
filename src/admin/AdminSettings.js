import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import "./AdminSettings.css";

const AdminSettings = () => {
  const imageRef = useRef();
  const [mode, setMode] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/logo/add-logo",
        { mode: mode },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to upload banner");
    }
  };

  const addMode = async (e) => {
    e.preventDefault();
    if (!mode || mode === "") {
      return message.error("Please select mode first");
    }
    try {
      const res = await axios.post(
        "/api/settings/setmode",
        { mode: mode },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getMode();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getMode() {
    try {
      const res = await axios.get("/api/settings/getmode", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setMode(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getMode();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-title">
          <h3 className="m-0">Gateway Settings</h3>
        </div>
        <hr />
        <div className="setting-container">
          <select
            value={mode?.upi}
            onChange={(e) => setMode(e.target.value)}
            name="mode"
            className="form-select"
          >
            <option value="">Select</option>
            <option value="cashpe">Cash Pe</option>
            {/* <option value="dgateway">Dgateway</option> */}
          </select>
          <button onClick={addMode} className="btn btn-success mt-3">
            Update Payment
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
