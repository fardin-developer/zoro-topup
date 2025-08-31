import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StickyFooter from "./StickyFooter";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";
import CodeIcon from "@mui/icons-material/Code";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import website from "../../website/data";
import "../Footer/Footer.css";
import IMAGES from "../../img/image";

const Footer = () => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  return (
    <React.Fragment>
      <div className="container-fluid footer-container">
        <div className="wa-icon-cont">
          <Link target="_blank" to={website.whatsapp}>
            <img src={IMAGES.wasupport} alt="" />
          </Link>
        </div>
        <div className="row">
          <div className="col-12 col-lg-6 mb-4">
            <div className="footer-logo">
              <b>
                ZORO'S <span>DOMAIN</span>
              </b>
            </div>
            <span>
              <small>
                Welcome to Zoro's Domain! Your go-to destination for in-game
                currencies for Mobile Legends, BGMI, PUBG, Genshin Impact, and
                more. Experience fast transactions, secure services, and
                top-tier customer support. Start gaming with ease today!
              </small>
            </span>
            <br />
          </div>
          <div className="quick-links col-12 col-lg-6 mb-4">
            <h6>Support</h6>
            <ul className="supportul">
              <li>
                <CallIcon className="icon text-danger me-2" />
                +91 9402831766 / 6003716911
              </li>
              <li>
                <EmailIcon className="icon text-primary me-2" />
                {website.mail}
              </li>
            </ul>
          </div>
          <div className="quick-links col-12 col-lg-6 col-sm-6 mb-4">
            <h6>Important Links</h6>
            <ul>
              <li>
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy">Refund Policy</Link>
              </li>
            </ul>
          </div>
          <div className="quick-links col-12 col-sm-12 col-lg-4 mb-4">
            <h6>Payments Channel</h6>
            <div className="payments-channel">
              <marquee behavior="smooth">
                <img src={IMAGES.upi} alt="" />
                <img src={IMAGES.paytm} alt="" />
                <img src={IMAGES.phonepe} alt="" />
                <img src={IMAGES.gpay} alt="" />
              </marquee>
            </div>
          </div>

          <hr />
          <span className="text-start text-lg-center">
            <small>
              All Rights Reserved © 2025 | {website?.name} | Website Developed
              by{" "}
              <Link
                className="text-danger"
                onClick={() =>
                  window.open(
                    `https://wa.me/919284263003?text=Hello! I want to make a website like ${website?.name}`,
                    "_blank"
                  )
                }
              >
                ~@aashirdigital
              </Link>
            </small>
          </span>
        </div>
      </div>

      {location.pathname !== "/product" && <StickyFooter />}
    </React.Fragment>
  );
};

export default Footer;
