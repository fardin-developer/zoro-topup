import video from "../video/loader.mp4";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-containerrr">
      <video autoPlay loop muted playsInline>
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
};

export default Loader;
