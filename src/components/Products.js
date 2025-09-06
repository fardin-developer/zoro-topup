import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Products.css";

const Products = ({ title }) => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);

  const getAllGames = async () => {
    try {
      setLoading(true);
      setLoader(true);
      const res = await axios.get("https://api.zorotopup.com/api/v1/games/get-all");
      if (res.data.success) {
        setGames(res.data.games);
        setFilteredGames(res.data.games);
        
        // Extract unique categories and convert to lowercase
        const uniqueCategories = [...new Set(res.data.games.map(game => game.category?.toLowerCase()))].filter(Boolean);
        setCategories(["all", ...uniqueCategories]);
        
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

  // Filter games based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game => 
        game.category?.toLowerCase() === selectedCategory
      );
      setFilteredGames(filtered);
    }
  }, [selectedCategory, games]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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
        
        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="games-list">
          {filteredGames?.map((item, index) => (
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
