import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import HeroSection from "../components/Home/HeroSection";
import UpcomingEvent from "../components/Home/UpcomingEvent.js";
import HowItWorks from "../components/Home/HowItWorks";
import SliderText from "../components/Home/SliderText";
import Products from "../components/Products";
import MobileButtons from "../components/Home/MobileButtons.js";
import Features from "../components/Features.js";
import axios from "axios";
import CancelIcon from "@mui/icons-material/Cancel";
import "./Home.css";

const Home = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [display, setDisplay] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [text, setText] = useState("");

  const getUserData = async () => {
    axios
      .post(
        "/api/user/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function getNoti() {
    try {
      const res = await axios.get("/api/noti/get-noti");
      if (res.data.success) {
        setImage(res.data.data[0].image);
        setLink(res.data.data[0].link);
        setDisplay(res.data.data[0].display);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserData();
    getNoti();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowPopup(true);
    }, 1500);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Are you sure you want quit?";
      localStorage.setItem("giveaway", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // ============== SLDIE TEXT
  async function getSlideText() {
    try {
      const res = await axios.get("/api/banner/get-slide-text");
      if (res.data.success) {
        setText(res.data.data.text);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getSlideText();
  }, []);

  return (
    <Layout>
      <div className="main-home-container">
        {showPopup && display === "yes" && (
          <div className="popup-container">
            <div>
              <CancelIcon
                onClick={() => setShowPopup(!showPopup)}
                className="icon"
              />
            </div>
            <Link target="_blank" to={link}>
              <img src={`https://zorotopup.com/${image}`} alt="popup-img" />
            </Link>
          </div>
        )}
        <HeroSection />
        <MobileButtons />
        <UpcomingEvent />
        <Products title={"Trending Games"} />
        <Features />
      </div>
    </Layout>
  );
};

export default Home;
