import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import "./SubscriberForm.css";

const SubscriberForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("/api/user/subscribe", { email });
      if (res.data.success) {
        setMsg(true);
        setLoading(false);
      } else {
        setMsg(true);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setMsg(false);
      console.log(error);
    }
  };

  return (
    <div className="subscriber-form">
      <h1>Stay Updated on Our Newest Designs and Exclusive Offers</h1>
      <h5 className="text-white">Drop your email and vibe with us!</h5>
      <form onSubmit={handleSubmit}>
        <div className="subcribe-input-container">
          {msg ? (
            <div className="text-success subcribe-success">
              You have been successfully subcribed!
            </div>
          ) : (
            <>
              <input
                placeholder="Email Address"
                type="email"
                className="subcribe-input"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="subcribe-input-btn">
                {loading && (
                  <div
                    class="spinner-grow spinner-grow-sm me-2 text-warning"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                )}
                Subcribe
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SubscriberForm;
