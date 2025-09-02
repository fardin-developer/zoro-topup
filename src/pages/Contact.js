import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import IMAGES from "../img/image";
import "./Contact.css";

const Contact = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    type: "",
    msg: [],
  });
  const [error, setError] = useState(false);
  const [mapLoader, setMapLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMapLoader(false);
    }, 1500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "msg") {
      setForm((prevForm) => ({
        ...prevForm,
        msg: [
          {
            msg: value,
            person: "user",
          },
        ],
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      form?.name === "" ||
      form?.email === "" ||
      form?.mobile === "" ||
      form?.msg.length === 0
    ) {
      setError(true);
      return;
    }
    try {
      const res = await axios.post("/api/contact/add-contact-form", form);
      if (res.data.success) {
        message.success(res.data.message);
        setForm({ name: "", email: "", mobile: "", msg: "" });
        setError(false);
      } else {
        message.error(res.data.message);
        setError(false);
      }
    } catch (error) {
      setError(false);
      console.log(error);
    }
  };

  const getUserData = async () => {
    axios
      .get(
        "https://api.zorotopup.com/api/v1/user/me",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // The new API returns user data directly
        dispatch(setUser(res.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div className="contact-page-container">
        <div className="col-12 col-sm-12 col-md-6 col-lg-6 contact-form">
          <h2>Submit Your Query</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-fields">
              <label>Name</label>
              <input
                onChange={handleChange}
                name="name"
                className="form-control"
                type="text"
                value={form.name}
                placeholder="Enter your name"
              />
              <span className="text-danger">
                <small>
                  {error && form?.name === "" && "Please enter your name"}
                </small>
              </span>
            </div>
            <div className="form-fields">
              <label>Email</label>
              <input
                onChange={handleChange}
                name="email"
                className="form-control"
                type="email"
                value={form.email}
                placeholder="Enter your email"
              />
              <span className="text-danger">
                <small>
                  {error && form?.email === "" && "Please enter your email"}
                </small>
              </span>
            </div>
            <div className="form-fields">
              <label>Phone Number</label>
              <input
                onChange={handleChange}
                name="mobile"
                className="form-control"
                type="text"
                value={form.mobile}
                placeholder="Enter your phone number"
              />
              <span className="text-danger">
                <small>
                  {error && form?.mobile === "" && "Please enter your mobile"}
                </small>
              </span>
            </div>
            <div className="form-fields">
              <label>Choose Query Type</label>
              <select
                className="form-select"
                name="type"
                onChange={handleChange}
                value={form?.type}
              >
                <option value="">Select Query Type</option>
                <option value="Payment Related Query">
                  Payment Related Queries
                </option>
                <option value="In-Game Recharge Query">
                  In-Game Recharge Query
                </option>
                <option value="Wanted to be a Reseller">
                  Wanted to be a Reseller
                </option>
                <option value="others">Other Query</option>
              </select>
              <span className="text-danger">
                <small>
                  {error && form?.type === "" && "Select Query Type"}
                </small>
              </span>
            </div>
            <div className="form-fields">
              <label>Message</label>
              <textarea
                onChange={handleChange}
                className="form-control"
                value={
                  form.msg.length > 0
                    ? form.msg[form.msg.length - 1].message
                    : ""
                }
                name="msg"
                rows="3"
                placeholder="How can we help you?"
              ></textarea>
              <span className="text-danger">
                <small>
                  {error &&
                    form?.msg.length === 0 &&
                    "Please enter your message"}
                </small>
              </span>
            </div>
            <button type="submit" className="theme-btn w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
