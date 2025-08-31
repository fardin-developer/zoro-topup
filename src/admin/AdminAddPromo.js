import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./AdminAddPromo.css";
import { useNavigate } from "react-router-dom";

const AdminAddPromoTEST = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    image: null,
    title: "",
    date: "",
    category: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promoData = new FormData();
    promoData.append("image", formData.image);
    promoData.append("title", formData.title);
    promoData.append("date", formData.date);
    promoData.append("category", formData.category);
    promoData.append("description", formData.description);

    try {
      await axios.post("/api/promo/add-promo", promoData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      message.success("Promo added successfully!");
      navigate("/admin-promo");
      // Clear the form
      setFormData({
        image: null,
        title: "",
        date: "",
        category: "",
        description: "",
      });
    } catch (error) {
      message.error("Failed to add promo.");
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users admin-promo-container">
        <div className="page-title">
          <h3 className="m-0">Promo & Events</h3>
        </div>
        <hr />
        <form
          className="form"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="form-fields mb-3">
            <label className="form-label">Image:</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-fields mb-3">
            <label className="form-label">Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-fields mb-3">
            <label className="form-label">Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-fields mb-3">
            <label className="form-label">Category:</label>
            <select
              onChange={handleInputChange}
              name="category"
              className="form-select"
            >
              <option value="">Select Category</option>
              <option value="Promo">Promo</option>
              <option value="Events">Event</option>
              <option value="Esports">Esports</option>
            </select>
          </div>
          <div className="form-fields mb-3">
            <label className="form-label">Description:</label>
            {/* <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-control"
              rows={10}
              required
            /> */}
            <ReactQuill
              value={formData.description}
              onChange={handleDescriptionChange}
            />
          </div>
          <button className="w-100 py-3" type="submit">
            Add Promo
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminAddPromoTEST;
