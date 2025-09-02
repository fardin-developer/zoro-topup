import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import website from "../website/data";
import "./AdminNotification.css";

const AdminBanners = () => {
  const imageRef = useRef();
  const [file, setFile] = useState(null);
  const [link, setLink] = useState("");
  const [banners, setBanners] = useState(null);
  //!
  const [sliderText, setSliderText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      return message.error("Please select an image");
    }
    if (!link) {
      return message.error("Please enter a link");
    }
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("link", link);

      const res = await axios.post("/api/banner/add-banner", formData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getBanners();
        setFile(null);
        setLink("");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to upload banner");
    }
  };

  async function getBanners() {
    try {
      const res = await axios.get("/api/banner/get-banners", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setBanners(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteBanner(id) {
    try {
      const res = await axios.post(
        "/api/banner/delete-banner",
        { id: id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getBanners();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // slider text
  async function handleSaveSliderText() {
    try {
      const res = await axios.post(
        "/api/banner/slide-text",
        { text: sliderText },
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
    }
  }
  async function getSliderText() {
    try {
      const res = await axios.get("/api/banner/get-slide-text", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setSliderText(res.data.data.text);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // getSliderText();
    getBanners();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-title">
          <h3 className="m-0">Banners</h3>
        </div>
        <hr />
        <div className="table-container">
          <div className="tools">
            <input
              type="file"
              name="image"
              className="form-control mb-3"
              onChange={(e) => setFile(e.target.files[0])}
              ref={imageRef}
            />
            <input
              type="text"
              name="link"
              className="form-control mb-3"
              placeholder="Enter link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
          <table className="table table-dark">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Banner</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {banners?.map((item, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        width="80px"
                        src={`${website.link}/${item?.image}`}
                        alt=""
                      />
                    </td>
                    <td>{item?.link}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteBanner(item?._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBanners;
