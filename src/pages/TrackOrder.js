import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import "./TrackOrder.css";
import axios from "axios";
import { message } from "antd";

const TrackOrder = () => {
  const [tabs, setTabs] = useState(0);
  const [form, setForm] = useState({ orderId: "", email: "" });
  const [orderData, setOrderData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/order/track-order", {
        orderId: form?.orderId,
        email: form?.email,
      });
      if (res.data.success) {
        message.success(res.data.message);
        setOrderData(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid hero-container bg-white register-container">
        <div className="row text-center">
          <div className="d-block m-auto col-12 col-sm-12 col-md-6 col-lg-6">
            <form className="register-form" onSubmit={handleSubmit}>
              <h1>Track Order</h1>
              <div className="tabs">
                <div
                  onClick={() => setTabs(0)}
                  className={`email ${tabs === 0 && "active"}`}
                >
                  Email
                </div>
                <div
                  onClick={() => setTabs(1)}
                  className={`order-id ${tabs === 1 && "active"}`}
                >
                  Order ID
                </div>
              </div>
              {tabs === 0 && (
                <div className="form-fields mb-3">
                  <input
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    value={form?.email}
                    name="email"
                    type="text"
                    className="form-control"
                    placeholder="Enter Your Email"
                  />
                </div>
              )}
              {tabs === 1 && (
                <div className="form-fields mb-3">
                  <input
                    onChange={(e) =>
                      setForm({ ...form, orderId: e.target.value })
                    }
                    value={form?.orderId}
                    name="orderId"
                    type="text"
                    className="form-control"
                    placeholder="Enter Order ID"
                  />
                </div>
              )}
              <button className="register-btn">Track Order</button>
            </form>
          </div>
        </div>

        <hr className="my-5" />
        <div className="container track-orders-display">
          <table className="table table-bordered">
            <thead>
              {orderData?.length > 0 ? (
                orderData?.map((item, index) => {
                  return (
                    <>
                      <tr className="table-dark">
                        <th>Order ID</th>
                        <td>{item?.orderId}</td>
                      </tr>
                      <tr>
                        <th>Product</th>
                        <td>{item?.p_info}</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <td>{item?.price}</td>
                      </tr>
                      <tr>
                        <th>User Id</th>
                        <td>{item?.userId}</td>
                      </tr>
                      {/* <tr>
                          <th>Zone Id</th>
                          <td>{item?.zoneId}</td>
                        </tr> */}
                      <tr>
                        <th>Status</th>
                        <td>{item?.status}</td>
                      </tr>
                    </>
                  );
                })
              ) : (
                <div className="text-center">No result found</div>
              )}
            </thead>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
