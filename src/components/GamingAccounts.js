import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./GamingAccounts.css";

const GamingAccounts = () => {
  const navigate = useNavigate();

  // Featured gaming accounts data - these are highlighted products
  const accounts = [
    {
      id: 1,
      game: "Genshin Impact",
      image: "/mobile-legends.webp",
      description: "AR 55+ | C6 Zhongli | C3 Raiden | Whale Account",
      price: "₹2,700",
      originalPrice: "₹3,500",
      discount: 23,
      featured: true,
      category: "Premium",
      link: "/account/genshin"
    },
    {
      id: 2,
      game: "MLBB",
      image: "/mobile-legends.webp",
      description: "Mythic Glory | 692 Skins | All Heroes",
      price: "₹6,500",
      originalPrice: "₹8,000",
      discount: 19,
      featured: true,
      category: "Ultra Premium",
      link: "/account/mlbb"
    },
    {
      id: 6,
      game: "Valorant",
      image: "/mobile-legends.webp",
      description: "Immortal Rank | Premium Skins | Knife Collection",
      price: "₹8,900",
      originalPrice: "₹11,000",
      discount: 19,
      featured: true,
      category: "Ultra Premium",
      link: "/account/valorant"
    },
    {
      id: 3,
      game: "BGMI",
      image: "/android-chrome-512x512.png",
      description: "Conqueror Tier | Premium Pass | Mythic Items",
      price: "₹12,800",
      originalPrice: "₹15,000",
      discount: 15,
      featured: true,
      category: "Premium",
      link: "/account/bgmi"
    },
    {
      id: 8,
      game: "Call of Duty Mobile",
      image: "/android-chrome-512x512.png",
      description: "Legendary Rank | Mythic Weapons | Rare Camos",
      price: "₹7,800",
      originalPrice: "₹9,500",
      discount: 18,
      featured: true,
      category: "Ultra Premium",
      link: "/account/codm"
    }
  ];

  const handleBuyNow = (account) => {
    // Navigate to account store with game type filter
    const gameTypeMap = {
      'genshin': 'genshin',
      'mlbb': 'mlbb', 
      'valorant': 'valorant',
      'bgmi': 'bgmi',
      'codm': 'codm'
    };
    
    const gameType = gameTypeMap[account.game.toLowerCase()];
    if (gameType) {
      navigate(`/account-store?game=${gameType}`);
    } else {
      navigate('/account-store');
    }
  };

  return (
    <div className="gaming-accounts-container">
      {/* Header */}
      <div className="accounts-header">
        <h2 className="accounts-title">Accounts for sale</h2>
        <span onClick={() => navigate("/account-store")} className="view-more-link">View More</span>
      </div>

      {/* Horizontal Scrolling Cards */}
      <div className="accounts-scroll-container">
        <div className="accounts-scroll">
          {accounts.map((account) => (
            <div key={account.id} className="account-card" onClick={() => handleBuyNow(account)}>
              <div className="account-image-container">
                <img 
                  src={account.image} 
                  alt={`${account.game} Account`}
                  className="account-image"
                  onError={(e) => {
                    e.target.src = "/android-chrome-512x512.png"; // Fallback image
                  }}
                />
                {account.discount && (
                  <div className="discount-tag">-{account.discount}%</div>
                )}
                {/* <div className="price-tag">
                  <span>{account.price}</span>
                </div> */}
                <div className="category-tag">{account.category}</div>
                <div className="account-overlay">
                  <div className="account-info">
                    <h3>{account.game}</h3>
                    <p>{account.description}</p>
                    {account.originalPrice && (
                      <div className="pricing">
                        <span className="original-price">{account.originalPrice}</span>
                        <span className="current-price">{account.price}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamingAccounts;