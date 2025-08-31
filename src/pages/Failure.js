import React from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
import "./Success.css";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="success-container failure-container">
        <div class="failure">
          <CancelIcon className="icon" />
          <h5 class="failure-prompt-heading">Recharge Failed!</h5>
          <p>Your top-up has been failed. Sorry for the inconvenience!</p>

          <div class="success-button-container">
            <button
              class="success-button-main"
              type="button"
              onClick={() => navigate("/user-dashboard")}
            >
              Go to Dashboard
            </button>
            <button
              class="success-button-secondary"
              type="button"
              onClick={() => navigate("/support")}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Failure;
