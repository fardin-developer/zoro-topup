import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const Products = ({ title }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  const getAllGames = async () => {
    try {
      setLoading(true);
      setLoader(true);
      const res = await axios.get("https://api.zorotopup.com/api/v1/games/get-all");
      if (res.data.success) {
        setGames(res.data.games);
        setTimeout(() => {
          setLoading(false);
          setLoader(false);
        }, 1000);
      } else {
        setLoader(false);
        setLoading(false);
      }
    } catch (error) {
      setLoader(false);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAllGames();
  }, []);

  return (
    <div className="explore-products-container">
      <div className="popular-games">
        <div className="titlee">
          <h5 className="m-0">All Games</h5>
        </div>
        <div className="games-list">
          {games?.map((item, index) => (
            <div
              key={index}
              className="game"
              style={loader ? { overflow: "hidden" } : {}}
              onClick={() => navigate(`/product/${item?._id}`)}
            >
              {loader ? (
                <div className=""></div>
              ) : (
                <img
                  className="loading active"
                  src={item?.image}
                  alt="game-img"
                />
              )}
              <div className="company">
                <h5>{item?.name}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
