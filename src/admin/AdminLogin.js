import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import "../pages/Register.css";
import IMAGES from "../img/image";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form?.email === "aashirdigital@gmail.com") {
      try {
        const res = await axios.post("/api/user/admin", form);
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          navigate("/admin-dashboard");
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await axios.post("/api/user/login", form);
        if (res.data.success) {
          localStorage.setItem("token", res.data.token);
          navigate("/user-dashboard");
        } else {
          message.error(res.data.message);
        }
      } catch (error) {
        console.log(error);
        message.error("Something went wrong");
      }
    }
  };

  return (
    <Layout>
      <div className="container-fluid hero-container">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 p-0 m-0">
            <img src={IMAGES.alogin} alt="" />
          </div>
          <div className="col-12 col-sm-12 col-md-6 col-lg-6 bg-white border">
            <form className="register-form" onSubmit={handleSubmit}>
              <h5>Admin Login</h5>
              <hr className="m-0 p-0 mb-4" />
              <div className="mb-3 form-fields">
                <label htmlFor="" className="form-label">
                  Email*
                </label>
                <input
                  onChange={handleChange}
                  placeholder="Enter your email"
                  type="email"
                  className="form-control"
                  required
                  name="email"
                />
              </div>
              <div className="mb-3 form-fields">
                <div className="d-flex justify-content-between">
                  <label htmlFor="" className="form-label">
                    Password*
                  </label>
                  {/* <Link to="/forgot-password">Forgot Password?</Link> */}
                </div>
                <input
                  onChange={handleChange}
                  placeholder="Enter your password"
                  type="text"
                  className="form-control"
                  required
                  name="password"
                />
              </div>
              <button className="register-btn">Login</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
