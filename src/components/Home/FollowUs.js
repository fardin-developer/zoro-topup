import "./FollowUs.css";
import IMAGES from "../../img/image";
import { Link } from "react-router-dom";
import website from "../../website/data";

const FollowUs = () => {
  return (
    <div className="followus-container">
      <h2>Reach Us At</h2>
      <div className="socials">
        <Link target="_blank" to={website.facebook}>
          <img src={IMAGES.facebook} alt="" />
        </Link>

        <Link target="_blank" to={website.instagram}>
          <img src={IMAGES.instagram} alt="" />
        </Link>

        <Link target="_blank" to={website.whatsapp}>
          <img src={IMAGES.whatsapp} alt="" />
        </Link>

        <Link target="_blank" to={`mailto:${website.mail}`}>
          <img src={IMAGES.gmail} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default FollowUs;
