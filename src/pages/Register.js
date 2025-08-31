import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import CryptoJS from "crypto-js";
import IMAGES from "../img/image";
import VerifiedIcon from "@mui/icons-material/Verified";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [form, setForm] = useState({ sponsor: params?.code || "" });
  const [isSponsorValid, setIsSponsorValid] = useState(false);
  const [sponsor, setSponsor] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState("");

  const clientId = process.env.REACT_APP_CLIENTID;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSuccess = async (response) => {
    try {
      const decoded = jwtDecode(response.credential);

      const email = decoded.email;
      const name = decoded.name;
      const profilePicture = decoded.picture;

      const res = await axios.post("/api/user/checkcanregister", {
        email: email,
      });
      if (res.data.success) {
        message.success(res.data.message);
        setForm({
          ...form,
          email: email,
          fname: name,
          userimg: profilePicture,
        });
        setShowPopup(true);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleRegister = async (response) => {
    try {
      if (form?.mobile?.length > 10 || form?.mobile?.length < 10) {
        return message.error("Enter 10 digits Mobile Number only");
      }
      const res = await axios.post("/api/user/registerusinggoogle", form);
      if (res.data.success) {
        message.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        if (res.data.isAdmin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/");
        }
      } else {
        message.error(res.data.message);
        setError(res.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFailure = (error) => {
    message.error("Failed to Login. Try again later.");
  };

  const sendMobileOtp = async (e) => {
    e.preventDefault();

    if (form?.mobile?.length !== 10) {
      return message.error("Enter 10 digits mobile number");
    }

    const secretKey = process.env.REACT_APP_REG_SECRET;

    const encryptedMobile = CryptoJS.AES.encrypt(
      form.mobile,
      secretKey
    ).toString();
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("/api/user/mobileotp", {
        token: encryptedMobile,
        email: form?.email,
      });
      if (res.data.success) {
        message.success(res.data.message);
        setShowOtpField(true);
        setLoading(false);
      } else {
        message.error(res.data.message);
        setLoading(false);
        setError(res.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  async function handleRegister(e) {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form?.email)) {
      message.error("Invalid email format");
      return;
    }
    if (form?.mobile?.length > 10 || form?.mobile?.length < 10) {
      return message.error("Enter 10 digits Mobile Number only");
    }

    if (isNaN(form?.userEnteredOtp)) {
      return message.error("Enter only numbers");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/user/register", form);
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/login");
        setLoading(false);
      } else {
        setLoading(false);
        message.error(res.data.message);
        setError(res.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  }

  async function getSponsor(e) {
    if (e) {
      e.preventDefault();
    }
    if (form?.sponsor === "" || !form?.sponsor) {
      return message.error("Sponsor field cannot be blank");
    }
    try {
      const res = await axios.post("/api/user/getSponsor", {
        code: form?.sponsor,
      });
      if (res.data.success) {
        message.success(res.data.message);
        setSponsor(res.data.data);
      } else {
        message.error(res.data.message);
        setSponsor(null);
        setError(res.data.message);
        setTimeout(() => {
          setError("");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (params?.code && params.code.trim() !== "") {
      getSponsor();
    }
  }, [params?.code]);

  return (
    <Layout>
      {showPopup && (
        <div className="addremainingfieldscontainer">
          <div className="ppform">
            <h4>Enter Details</h4>
            <div className="validate-input form-fields">
              <div className="validateinput">
                <input
                  onChange={handleChange}
                  value={form?.mobile}
                  name="mobile"
                  type="text"
                  className="form-control"
                  placeholder="Enter mobile number"
                />
                <button className="validatebtn" onClick={sendMobileOtp}>
                  Send OTP
                </button>
              </div>

              {showOtpField && (
                <div className="validateinput otpinput">
                  <input
                    onChange={handleChange}
                    value={form?.userEnteredOtp}
                    name="userEnteredOtp"
                    type="text"
                    className="form-control"
                    placeholder="Enter 6 digits OTP"
                  />
                </div>
              )}

              <div className="validateinput">
                <input
                  onChange={handleChange}
                  value={form?.sponsor}
                  name="sponsor"
                  type="text"
                  className="form-control"
                  placeholder="Enter Sponsor Code (Optional)"
                />
                {!sponsor && (
                  <button
                    className="validatebtn"
                    onClick={(e) => getSponsor(e)}
                  >
                    Validate
                  </button>
                )}
              </div>
              {sponsor && (
                <div className="text-success text-start mb-2 mt-2">
                  <small>
                    Sponsor - {sponsor} <VerifiedIcon className="icon" />
                  </small>
                </div>
              )}
            </div>
            {error !== "" && <div className="errormsg">Error - {error}</div>}
            <button className="registerbtn" onClick={handleGoogleRegister}>
              Register & Save
            </button>
          </div>
        </div>
      )}
      <div className="container-fluid register-container">
        <div className="row text-center">
          <div className="form d-block m-auto col-12 col-sm-12 col-md-6 col-lg-6">
            <form className="register-form">
              <img src={IMAGES.logo} alt="" />
              <h1>Zoro's Domain</h1>
              <p>Be a part of our family. Start your journey with us!</p>
              <div className="form-fields mb-3">
                <label className="form-label">Full Name</label>
                <input
                  onChange={handleChange}
                  value={form?.fname}
                  name="fname"
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-fields mb-3">
                <label className="form-label">Email</label>
                <input
                  onChange={handleChange}
                  value={form?.email}
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
              </div>
              <div className="form-fields mb-3">
                <label className="form-label">Mobile</label>
                <input
                  onChange={handleChange}
                  value={form?.mobile}
                  name="mobile"
                  type="text"
                  className="form-control"
                  placeholder="Enter your mobile"
                />
              </div>

              <div className="form-fields mb-3">
                <label className="form-label">Password</label>
                <input
                  onChange={handleChange}
                  value={form?.password}
                  name="password"
                  type="text"
                  className="form-control"
                  placeholder="Enter a strong password"
                />
              </div>
              <div className="form-fields mb-3">
                <label className="form-label">Refer Code</label>
                <div className="validateinput">
                  <input
                    onChange={handleChange}
                    value={form?.sponsor}
                    name="sponsor"
                    type="text"
                    className="form-control"
                    placeholder="Enter Referral Code (Optional)"
                  />
                  <button className="validatebtn" onClick={getSponsor}>
                    Validate
                  </button>
                </div>
              </div>
              {sponsor && (
                <div className="text-success text-start mb-2 mt-2">
                  <small>
                    Sponsor - {sponsor} <VerifiedIcon className="icon" />
                  </small>
                </div>
              )}

              {showOtpField && (
                <div className="form-fields mb-3">
                  <label className="form-label">Enter OTP</label>
                  <input
                    onChange={handleChange}
                    value={form?.userEnteredOtp}
                    name="userEnteredOtp"
                    type="text"
                    className="form-control"
                    placeholder="Enter 6 digits OTP"
                  />
                </div>
              )}

              {showOtpField ? (
                <button className="register-btn" onClick={handleRegister}>
                  {loading ? "VERIFYING.." : "Verify and Register"}
                </button>
              ) : (
                <button className="register-btn" onClick={sendMobileOtp}>
                  {loading ? "SENDING.." : "Send WhatsApp OTP"}
                </button>
              )}
              <div className="or">OR</div>
              <div className="googlelogin">
                <GoogleLogin
                  clientId={clientId}
                  buttonText="Sign Up with Google"
                  onSuccess={handleSuccess}
                  onFailure={handleFailure}
                  cookiePolicy={"single_host_origin"}
                />
              </div>
              <div className="forgot-pass">
                <h6 className="text-center my-2">
                  Already a Customer? <Link to="/login">Click here</Link>
                </h6>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
