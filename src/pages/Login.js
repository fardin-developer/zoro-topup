import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import IMAGES from "../img/image";
import "./Register.css";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("phone"); // phone, otp, registration
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      message.error("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://api.zorotopup.com/api/v1/user/send-otp", {
        phone: phone,
      });

      if (res.data.success || res.status === 200) {
        message.success("OTP sent successfully!");
        setStep("otp");
      } else {
        message.error(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      message.error("Please enter a valid OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://api.zorotopup.com/api/v1/user/verify-otp", {
        phone: phone,
        otp: otp,
      });

      if (res.data.requiresRegistration) {
        // New user - show registration form
        setStep("registration");
        message.info("Please complete your registration");
      } else {
        // Existing user - login successful
        message.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      message.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (!registrationData.name || !registrationData.email || !registrationData.password) {
      message.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("https://api.zorotopup.com/api/v1/user/complete-registration", {
        name: registrationData.name,
        phone: phone,
        email: registrationData.email,
        password: registrationData.password,
      });

      if (res.data.token) {
        message.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      message.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrationChange = (e) => {
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
  };

  const renderPhoneStep = () => (
    <form className="register-form" onSubmit={handleSendOtp}>
      <img src={IMAGES.logo} alt="" />
      <h1>Zoro's Domain</h1>
      <p>Access your topup dashboard</p>
      <div className="form-fields mb-3">
        <label className="form-label">Phone Number</label>
        <input
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          type="tel"
          className="form-control"
          placeholder="Enter your phone number"
          maxLength="10"
        />
      </div>
      <button className="register-btn" type="submit" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
      <div className="forgot-pass">
        <h6 className="text-center my-2">
          Don't have an account?{" "}
          <Link to="/register">Register Here</Link>
        </h6>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form className="register-form" onSubmit={handleVerifyOtp}>
      <img src={IMAGES.logo} alt="" />
      <h1>Zoro's Domain</h1>
      <p>Enter OTP sent to {phone}</p>
      <div className="form-fields mb-3">
        <label className="form-label">OTP</label>
        <input
          onChange={(e) => setOtp(e.target.value)}
          value={otp}
          type="text"
          className="form-control"
          placeholder="Enter 6-digit OTP"
          maxLength="6"
        />
      </div>
      <button className="register-btn" type="submit" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
      <div className="forgot-pass">
        <h6 className="text-center my-2">
          <button
            type="button"
            onClick={() => setStep("phone")}
            style={{
              background: "none",
              border: "none",
              color: "var(--c)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Change Phone Number
          </button>
        </h6>
        <h6 className="text-center my-2">
          <button
            type="button"
            onClick={handleSendOtp}
            style={{
              background: "none",
              border: "none",
              color: "var(--c)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Resend OTP
          </button>
        </h6>
      </div>
    </form>
  );

  const renderRegistrationStep = () => (
    <form className="register-form" onSubmit={handleCompleteRegistration}>
      <img src={IMAGES.logo} alt="" />
      <h1>Zoro's Domain</h1>
      <p>Complete your registration</p>
      <div className="form-fields mb-3">
        <label className="form-label">Full Name</label>
        <input
          onChange={handleRegistrationChange}
          value={registrationData.name}
          name="name"
          type="text"
          className="form-control"
          placeholder="Enter your full name"
        />
      </div>
      <div className="form-fields mb-3">
        <label className="form-label">Email Address</label>
        <input
          onChange={handleRegistrationChange}
          value={registrationData.email}
          name="email"
          type="email"
          className="form-control"
          placeholder="Enter your email"
        />
      </div>
      <div className="form-fields mb-3">
        <label className="form-label">Password</label>
        <input
          onChange={handleRegistrationChange}
          value={registrationData.password}
          name="password"
          type="password"
          className="form-control"
          placeholder="Enter your password"
        />
      </div>
      <button className="register-btn" type="submit" disabled={loading}>
        {loading ? "Completing..." : "Complete Registration"}
      </button>
      <div className="forgot-pass">
        <h6 className="text-center my-2">
          <button
            type="button"
            onClick={() => setStep("phone")}
            style={{
              background: "none",
              border: "none",
              color: "var(--c)",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            Start Over
          </button>
        </h6>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container-fluid register-container">
        <div className="row text-center">
          <div className="form d-block m-auto col-12 col-sm-12 col-md-6 col-lg-6">
            {step === "phone" && renderPhoneStep()}
            {step === "otp" && renderOtpStep()}
            {step === "registration" && renderRegistrationStep()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
