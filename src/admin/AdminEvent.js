import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import "./AdminEvents.css";

const AdminEvent = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [event, setEvent] = useState({
    heading: "",
    name: "",
    date: "",
    time: "",
    display: "",
  });

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  function handleChange(e) {
    setEvent({ ...event, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("heading", event.heading);
      formData.append("name", event.name);
      formData.append("date", event.date);
      formData.append("time", event.time);
      formData.append("display", event.display);

      const res = await axios.post("/api/event/addevent", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get("/api/event/getevent", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setEvent(res.data.event);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEvent();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Countdown</h3>
        </div>
        <hr />
        <div className="gallery-container admin-event">
          <div className="form-fields mb-2 col-12 text-dark">
            <input
              className="w-100 form-control"
              aria-label="Select Image"
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              name="image"
              required
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <div className="form-fields mb-2 col-12 text-dark">
            <input
              className="w-100 form-control"
              placeholder="Enter heading"
              type="text"
              name="heading"
              required
              value={event?.heading}
              onChange={handleChange}
            />
          </div>
          <div className="form-fields mb-2 col-12 text-dark">
            <input
              className="w-100 form-control"
              placeholder="Enter event name"
              type="text"
              name="name"
              required
              value={event?.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-fields mb-2 col-12 text-dark">
            <input
              className="w-100 form-control"
              type="date"
              name="date"
              required
              value={event?.date}
              onChange={handleChange}
            />
          </div>
          <div className="form-fields mb-2 col-12 text-dark">
            <input
              className="w-100 form-control"
              type="time"
              name="time"
              required
              value={event?.time}
              onChange={handleChange}
            />
          </div>
          <div className="form-fields mb-2 col-12 text-dark">
            <select
              name="display"
              onChange={handleChange}
              className="form-select"
              value={event?.display}
            >
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <button onClick={handleSubmit} className="button">
            Save
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEvent;
