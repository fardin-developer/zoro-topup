import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminPromoEvents.css";

const AdminPromoEvents = () => {
  const navigate = useNavigate();
  const [promos, setPromos] = useState(null);

  async function getPromos() {
    try {
      const res = await axios.get("/api/promo/get-promos");
      if (res.data.success) {
        setPromos(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePromo(id, image) {
    const deletePromo = window.confirm("Are you sure to delete?");

    if (!deletePromo) {
      return;
    }

    try {
      const res = await axios.post(
        "/api/promo/delete-promo",
        { id: id, image: image },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        getPromos();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPromos();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users admin-promo-event">
        <div className="page-title">
          <h3 className="m-0">Promo & Events</h3>
          <button onClick={() => navigate("/admin-add-promo")}>Add New</button>
        </div>
        <hr />
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>SR NO</th>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {promos?.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>
                    <img src={item?.image} alt="" />
                  </td>
                  <td>{item?.title}</td>
                  <td>{item?.category}</td>
                  <td>
                    <button
                      onClick={() => deletePromo(item?._id, item?.image)}
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
    </AdminLayout>
  );
};

export default AdminPromoEvents;
