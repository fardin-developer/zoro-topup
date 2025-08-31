import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import "./AdminNotification.css";

const AdminNotification = () => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [display, setDisplay] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (display === "") {
      return message.error("Please select display");
    }
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("link", link);
      formData.append("display", display);
      const res = await axios.post("/api/noti/update-noti", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getNoti();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getNoti() {
    try {
      const res = await axios.get("/api/noti/get-noti");
      if (res.data.success) {
        setLink(res.data.data[0].link);
        setDisplay(res.data.data[0].display);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getNoti();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-title">
          <h3 className="m-0">Notification</h3>
        </div>
        <hr />
        <div className="noti-container">
          <div className="form-fields">
            <input
              type="file"
              name="image"
              className="form-control mb-3"
              onChange={(e) => setFile(e.target.files[0])}
              ref={imageRef}
            />
            <input
              placeholder="Enter Link"
              type="text"
              name="link"
              className="form-control mb-3"
              onChange={(e) => setLink(e.target.value)}
              value={link}
            />
            <label className="text-dark">Display</label>
            <select
              name="display"
              className="form-select mb-2"
              onChange={(e) => setDisplay(e.target.value)}
              value={display}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotification;
