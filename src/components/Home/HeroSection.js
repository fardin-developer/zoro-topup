import video from "../../video/herobgvideo.mp4";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <>
      <div className="hero-container">
        <video autoPlay loop muted playsInline>
          <source src={video} type="video/mp4" />
        </video>
        <h4 className="orb">
          Top-Up Your <br className="d-lg-none d-block" /> Favourite Games
        </h4>
        <p className="orb">
          Fast delivery, trusted by thousands.
          <br className="d-lg-none d-block" /> Boost your gameplay now!
        </p>
        <button
          onClick={() =>
            window.open(
              "https://whatsapp.com/channel/0029Vb6KaT94tRrrPXngmO0H",
              "_blank"
            )
          }
        >
          Join whatsApp Channel
        </button>
      </div>
    </>
  );
};

export default HeroSection;
