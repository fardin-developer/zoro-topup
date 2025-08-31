import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import PaymentsIcon from "@mui/icons-material/Payments";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import "./Features.css";

const Features = () => {
  return (
    <div className="features-container">
      <h1>Why Gamers Trust Zoro</h1>
      <p>
        10,000+ successful top-ups, secure payments, and 24/7 support. <br /> We
        deliver fast and keep your game data safe.
      </p>
      <div className="features-grid">
        <div className="feature-card">
          <VerifiedUserIcon className="feature-icon text-success" />
          <h4>
            SSL <br className="d-block d-lg-none" /> Secure
          </h4>
        </div>
        <div className="feature-card">
          <FlashOnIcon className="feature-icon text-warning" />
          <h4>
            Fast <br className="d-block d-lg-none" /> Delivery
          </h4>
        </div>
        <div className="feature-card">
          <HeadsetMicIcon className="feature-icon text-primary" />
          <h4>
            24/7 <br className="d-block d-lg-none" /> Support
          </h4>
        </div>
        <div className="feature-card">
          <PaymentsIcon className="feature-icon" />
          <h4>
            Trusted <br className="d-block d-lg-none" /> Payments
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Features;
