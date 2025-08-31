import React, { useEffect, useState } from "react";
import { message, Pagination, Select } from "antd";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import website from "../website/data";
import axios from "axios";
import "./AdminUsers.css";
import "./AdminPackCategory.css";

const AdminPackCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  async function addPackCategory() {
    try {
      const formdata = new FormData();
      formdata.append("category", category);
      formdata.append("image", file);

      const res = await axios.post(
        "/api/packcategory/add-pack-category",
        formdata,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        setCategory("");
        getAllCategory();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function deletePackCategory(id) {
    try {
      const confirm = window.confirm("Are you sure to delete?");
      if (!confirm) {
        return;
      }
      const res = await axios.post(
        "/api/packcategory/delete-pack-category",
        {
          id: id,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAllCategory();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const getAllCategory = async () => {
    try {
      const res = await axios.get("/api/packcategory/get-pack-category", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setData(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Category</h3>
        </div>
        <hr />
        <div className="table-container">
          <div className="tools">
            <input
              type="file"
              name="image"
              className="form-cotrol py-1"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              type="text"
              className="py-2"
              placeholder="Enter category"
              name="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
            <button onClick={addPackCategory}>Add Category</button>
          </div>
        </div>
        <table className="table table-dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      width="40px"
                      src={`${website.link}/${item?.image}`}
                      alt=""
                    />
                  </td>
                  <td>{item?.category}</td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => deletePackCategory(item?._id)}
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
    </AdminLayout>
  );
};

export default AdminPackCategory;
