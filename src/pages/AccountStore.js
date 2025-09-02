import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import GamingAccounts from '../components/GamingAccounts';
import './AccountStore.css';

const AccountStore = () => {
  const { gameType } = useParams();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('all');

  // Sample gaming accounts data - replace with API call
  const sampleAccounts = [
    {
      id: 1,
      game: "Genshin Impact",
      gameType: "genshin",
      image: "/mobile-legends.webp",
      description: "AR 55+ | C6 Zhongli | C3 Raiden | 15+ Five Stars",
      price: 2700,
      originalPrice: 3500,
      discount: 23,
      inStock: true,
      features: ["AR 55+", "C6 Zhongli", "C3 Raiden Shogun", "15+ Five Star Characters", "Whale Account"],
      serverRegion: "Asia",
      accountLevel: 55,
      category: "Premium"
    },
    {
      id: 2,
      game: "MLBB",
      gameType: "mlbb",
      image: "/mobile-legends.webp",
      description: "Mythic Glory | 692 Skins | Mega Collector | All Heroes",
      price: 6500,
      originalPrice: 8000,
      discount: 19,
      inStock: true,
      features: ["Mythic Glory Rank", "692 Skins", "All Heroes Unlocked", "Mega Collector Badge", "Legend Skins"],
      serverRegion: "SEA",
      accountLevel: 999,
      category: "Ultra Premium"
    },
    {
      id: 3,
      game: "BGMI",
      gameType: "bgmi",
      image: "/mobile-legends.webp",
      description: "Conqueror Tier | Premium Pass | Rare Outfits",
      price: 12800,
      originalPrice: 15000,
      discount: 15,
      inStock: true,
      features: ["Conqueror Tier", "Premium Pass", "Rare Outfits", "Mythic Items", "High KD Ratio"],
      serverRegion: "Asia",
      accountLevel: 100,
      category: "Premium"
    },
    {
      id: 4,
      game: "Free Fire",
      gameType: "freefire",
      image: "/mobile-legends.webp",
      description: "Heroic Tier | 150+ Skins | Diamond Collection",
      price: 4500,
      originalPrice: 5500,
      discount: 18,
      inStock: true,
      features: ["Heroic Tier", "150+ Skins", "Diamond Character", "Elite Pass", "Rare Bundles"],
      serverRegion: "India",
      accountLevel: 65,
      category: "Premium"
    },
    {
      id: 5,
      game: "PUBG Mobile",
      gameType: "pubg",
      image: "/mobile-legends.webp",
      description: "Conqueror | Royal Pass | Glacier M416",
      price: 3200,
      originalPrice: 4000,
      discount: 20,
      inStock: false,
      features: ["Conqueror Rank", "Royal Pass", "Glacier M416", "Mythic Outfits", "Vehicle Skins"],
      serverRegion: "Asia",
      accountLevel: 80,
      category: "Premium"
    },
    {
      id: 6,
      game: "Valorant",
      gameType: "valorant",
      image: "/mobile-legends.webp",
      description: "Immortal Rank | Premium Skins | Knife Collection",
      price: 8900,
      originalPrice: 11000,
      discount: 19,
      inStock: true,
      features: ["Immortal Rank", "Premium Gun Skins", "Knife Collection", "Rare Bundles", "Battle Pass"],
      serverRegion: "Asia Pacific",
      accountLevel: 150,
      category: "Ultra Premium"
    },
    {
      id: 7,
      game: "Clash of Clans",
      gameType: "coc",
      image: "/android-chrome-512x512.png",
      description: "TH14 Max | Champion League | Rare Decorations",
      price: 5200,
      originalPrice: 6500,
      discount: 20,
      inStock: true,
      features: ["Town Hall 14 Max", "Champion League", "Rare Decorations", "Max Heroes", "Season Pass"],
      serverRegion: "Global",
      accountLevel: 200,
      category: "Premium"
    },
    {
      id: 8,
      game: "Call of Duty Mobile",
      gameType: "codm",
      image: "/android-chrome-512x512.png",
      description: "Legendary Rank | Mythic Weapons | Rare Camos",
      price: 7800,
      originalPrice: 9500,
      discount: 18,
      inStock: true,
      features: ["Legendary Rank", "Mythic Weapons", "Rare Camos", "Character Skins", "CP Credits"],
      serverRegion: "Global",
      accountLevel: 150,
      category: "Ultra Premium"
    }
  ];

  const gameCategories = [
    { id: 'all', name: 'All Games', count: sampleAccounts.length },
    { id: 'genshin', name: 'Genshin Impact', count: sampleAccounts.filter(acc => acc.gameType === 'genshin').length },
    { id: 'mlbb', name: 'MLBB', count: sampleAccounts.filter(acc => acc.gameType === 'mlbb').length },
    { id: 'bgmi', name: 'BGMI', count: sampleAccounts.filter(acc => acc.gameType === 'bgmi').length },
    { id: 'freefire', name: 'Free Fire', count: sampleAccounts.filter(acc => acc.gameType === 'freefire').length },
    { id: 'pubg', name: 'PUBG Mobile', count: sampleAccounts.filter(acc => acc.gameType === 'pubg').length },
    { id: 'valorant', name: 'Valorant', count: sampleAccounts.filter(acc => acc.gameType === 'valorant').length },
    { id: 'coc', name: 'Clash of Clans', count: sampleAccounts.filter(acc => acc.gameType === 'coc').length },
    { id: 'codm', name: 'COD Mobile', count: sampleAccounts.filter(acc => acc.gameType === 'codm').length },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAccounts(sampleAccounts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (gameType) {
      setSelectedGame(gameType);
      setFilteredAccounts(accounts.filter(account => account.gameType === gameType));
    } else {
      setSelectedGame('all');
      setFilteredAccounts(accounts);
    }
  }, [gameType, accounts]);

  const handleGameFilter = (gameId) => {
    setSelectedGame(gameId);
    if (gameId === 'all') {
      setFilteredAccounts(accounts);
      navigate('/account-store');
    } else {
      const filtered = accounts.filter(account => account.gameType === gameId);
      setFilteredAccounts(filtered);
      navigate(`/account/${gameId}`);
    }
  };

  const handleAccountClick = (account) => {
    // Navigate to individual account detail page
    navigate(`/account-details/${account.id}`, { state: { account } });
  };

  if (loading) {
    return (
      <Layout>
        <div className="account-store-loading">
          <div className="loading-spinner"></div>
          <p>Loading Gaming Accounts...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="account-store-container">
        {/* Hero Section */}
        <div className="account-store-hero">
          <h1>Premium Gaming Accounts</h1>
          <p>Discover high-level gaming accounts with premium items, rare skins, and competitive rankings</p>
        </div>



        {/* Game Filter Tabs */}
        <div className="game-filter-container">
          <h2>Browse by Game</h2>
          <div className="game-filter-tabs">
            {gameCategories.map((category) => (
              <button
                key={category.id}
                className={`filter-tab ${selectedGame === category.id ? 'active' : ''}`}
                onClick={() => handleGameFilter(category.id)}
              >
                {category.name}
                <span className="count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="accounts-grid-container">
          {filteredAccounts.length === 0 ? (
            <div className="no-accounts">
              <h3>No accounts available</h3>
              <p>Check back later for new gaming accounts!</p>
            </div>
          ) : (
            <div className="accounts-grid">
              {filteredAccounts.map((account) => (
                <div 
                  key={account.id} 
                  className={`account-grid-card ${!account.inStock ? 'out-of-stock' : ''}`}
                  onClick={() => handleAccountClick(account)}
                >
                  <div className="account-card-image">
                    <img src={account.image} alt={account.game} />
                    {account.discount > 0 && (
                      <div className="discount-badge">-{account.discount}%</div>
                    )}
                    {!account.inStock && (
                      <div className="out-of-stock-overlay">
                        <span>Out of Stock</span>
                      </div>
                    )}
                    <div className="category-badge">{account.category}</div>
                  </div>
                  
                  <div className="account-card-content">
                    <h3 className="account-game-title">{account.game}</h3>
                    <p className="account-description">{account.description}</p>
                    
                    <div className="account-features">
                      {account.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                    
                    <div className="account-details">
                      <div className="account-level">Level {account.accountLevel}</div>
                      <div className="account-region">{account.serverRegion}</div>
                    </div>
                    
                    <div className="account-pricing">
                      {account.originalPrice > account.price && (
                        <span className="original-price">₹{account.originalPrice}</span>
                      )}
                      <span className="current-price">₹{account.price}</span>
                    </div>
                    
                    <button 
                      className={`buy-now-btn ${!account.inStock ? 'disabled' : ''}`}
                      disabled={!account.inStock}
                    >
                      {account.inStock ? 'Buy Now' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AccountStore;