import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import axios from "axios";
import { message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import "./SinglePromoEvents.css";

const SinglePromoEvent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [promo, setPromo] = useState(null);

  async function getSinglePromo() {
    try {
      const res = await axios.post("/api/promo/get-promo", { id: params.id });
      if (res.data.success) {
        setPromo(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSinglePromo();
  }, []);

  return (
    <Layout>
      <div className="single-promo-container">
        <ArrowLeftIcon className="icon" onClick={() => navigate("/promo")} />
        <div className="single-promo">
          <img src={promo?.image} alt="" />
          <div className="single-promo-content">
            <span>
              {new Date(promo?.date).toLocaleString("default", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              | {promo?.category}
            </span>
            <h2>{promo?.title}</h2>
            <div
              className="description"
              dangerouslySetInnerHTML={{ __html: promo?.description }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SinglePromoEvent;
