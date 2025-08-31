import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import "./AdminGallery.css";
import website from "../website/data";

const AdminGallery = () => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState(null);

  function handleFileChange(e) {
    setFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("/api/image/upload", formData);
      if (res.data.success) {
        message.success(res.data.message);
        getAllImages();
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

  async function handleDelete(id) {
    const confirm = window.confirm("Are you sure to delete?");
    if (confirm) {
      try {
        const res = await axios.post("/api/image/delete", { id });
        if (res.data.success) {
          message.success(res.data.message);
          getAllImages();
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getAllImages() {
    try {
      const res = await axios.get("/api/image/get-images");
      if (res.data.success) {
        setImages(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Gallery</h3>
        </div>
        <hr />
        <div className="table-container">
          <div className="tools">
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
            <button onClick={handleSubmit} className="button">
              Upload
            </button>
          </div>
          <table className="table table-dark">
            <thead>
              <tr>
                <th width="10%">Sr No</th>
                <th width="40%">Image</th>
                <th width="40%">Image Path</th>
                <th width="40%">Action</th>
              </tr>
            </thead>
            <tbody>
              {images &&
                images?.map((item, index) => {
                  return (
                    <tr>
                      <td>{index + 1}</td>
                      <td>
                        <img
                          width="50px"
                          src={`${website.link}/${item?.image}`}
                          alt=""
                        />
                      </td>
                      <td>{`${website.link}/${item?.image}`}</td>
                      <td>
                        <DeleteIcon onClick={() => handleDelete(item._id)} />
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

export default AdminGallery;
