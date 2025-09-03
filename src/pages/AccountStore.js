import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import GamingAccounts from '../components/GamingAccounts';
import './AccountStore.css';

const AccountStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('all');

  // Check for query parameter for initial filtering
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const gameFilter = queryParams.get('game');
    if (gameFilter) {
      setSelectedGame(gameFilter);
      // Clear the query parameter from URL
      navigate('/account-store', { replace: true });
    }
  }, [location.search, navigate]);

  // Sample gaming accounts data matching GamingIdSchema
  const sampleAccounts = [
    {
      _id: "1",
      game: "Mobile Legends",
      gameType: "mlbb",
      title: "Mobile Legends Premium Account",
      description: "High-tier MLBB account with extensive skin collection and competitive ranking",
      price: 6500,
      currency: "INR",
      highlights: {
        collectorRank: "Mythic Glory",
        winrate: 87.5,
        skinsOwned: 692,
        highestRank: "Mythical Glory 850 Points",
        loginInfo: "Moonton Account",
        server: "SEA"
      },
      skins: [
        { hero: "Gusion", skinName: "Holy Blade", rarity: "Legend" },
        { hero: "Fanny", skinName: "Lifeguard", rarity: "Epic" },
        { hero: "Lancelot", skinName: "Royal Matador", rarity: "Legend" }
      ],
      images: ["/mobile-legends.webp"],
      tags: ["High Winrate", "SEA Server", "Mythic Rank", "692 Skins"],
      isSold: false,
      status: "active"
    },
    {
      _id: "2",
      game: "Mobile Legends",
      gameType: "mlbb",
      title: "MLBB Collector Account",
      description: "Rare skins and high mythic ranking with excellent winrate",
      price: 8900,
      currency: "INR",
      highlights: {
        collectorRank: "Mythic Immortal",
        winrate: 92.3,
        skinsOwned: 421,
        highestRank: "Mythical Immortal 1200 Points",
        loginInfo: "VK Account",
        server: "SEA"
      },
      images: ["/mobile-legends.webp"],
      tags: ["Mythic Immortal", "High Winrate", "Rare Skins", "VK Login"],
      isSold: false,
      status: "active"
    },
    {
      _id: "67423f1a2b3c4d5e6f789abe",
      game: "PUBG Mobile",
      gameType: "pubg",
      title: "PUBG Mobile Conqueror Account",
      description: "Top-tier PUBG Mobile account with Conqueror rank and rare items",
      price: 4200,
      currency: "INR",
      highlights: {
        collectorRank: "Conqueror",
        winrate: 78.9,
        skinsOwned: 156,
        highestRank: "Conqueror #1847",
        loginInfo: "Facebook Login",
        server: "Asia"
      },
      images: ["/mobile-legends.webp"],
      tags: ["Conqueror Rank", "Asia Server", "Royal Pass", "Rare Skins"],
      isSold: false,
      status: "active"
    },
    {
      _id: "67423f1a2b3c4d5e6f789abf",
      game: "Free Fire",
      gameType: "freefire",
      title: "Free Fire Heroic Account",
      description: "Premium Free Fire account with heroic rank and exclusive items",
      price: 3800,
      currency: "INR",
      highlights: {
        collectorRank: "Heroic",
        winrate: 82.1,
        skinsOwned: 198,
        highestRank: "Heroic Tier",
        loginInfo: "Google Account",
        server: "India"
      },
      images: ["/mobile-legends.webp"],
      tags: ["Heroic Rank", "India Server", "Diamond Character", "Elite Pass"],
      isSold: false,
      status: "active"
    },
    {
      _id: "67423f1a2b3c4d5e6f789ac0",
      game: "BGMI",
      gameType: "bgmi",
      title: "BGMI Conqueror Account",
      description: "High-ranking BGMI account with premium cosmetics and achievements",
      price: 5200,
      currency: "INR",
      highlights: {
        collectorRank: "Conqueror",
        winrate: 75.6,
        skinsOwned: 89,
        highestRank: "Conqueror Tier",
        loginInfo: "Twitter Login",
        server: "Asia"
      },
      images: ["/mobile-legends.webp"],
      tags: ["Conqueror", "Premium Pass", "Rare Outfits", "High Rank"],
      isSold: false,
      status: "active"
    },
    {
      _id: "67423f1a2b3c4d5e6f789ac1",
      game: "Valorant",
      gameType: "valorant",
      title: "Valorant Immortal Account",
      description: "Top-tier Valorant account with immortal rank and premium skins",
      price: 12500,
      currency: "INR",
      highlights: {
        collectorRank: "Immortal",
        winrate: 68.9,
        skinsOwned: 45,
        highestRank: "Immortal 2",
        loginInfo: "Riot Account",
        server: "Mumbai"
      },
      images: ["/mobile-legends.webp"],
      tags: ["Immortal Rank", "Premium Skins", "Mumbai Server", "Knife Collection"],
      isSold: false,
      status: "active"
    },
    {
      _id: "67423f1a2b3c4d5e6f789ac2",
      game: "Call of Duty Mobile",
      gameType: "codm",
      title: "COD Mobile Legendary Account",
      description: "Legendary ranked CODM account with mythic weapons and rare camos",
      price: 7800,
      currency: "INR",
      highlights: {
        collectorRank: "Legendary",
        winrate: 71.4,
        skinsOwned: 234,
        highestRank: "Legendary Master",
        loginInfo: "Activision Account",
        server: "Global"
      },
      images: ["/android-chrome-512x512.png"],
      tags: ["Legendary Rank", "Mythic Weapons", "Global Server", "Rare Camos"],
      isSold: false,
      status: "active"
    },
    {
      _id: "67423f1a2b3c4d5e6f789ac3",
      game: "Clash of Clans",
      gameType: "coc",
      title: "Clash of Clans TH15 Max Account",
      description: "Maxed Town Hall 15 account with champion league ranking",
      price: 8900,
      currency: "INR",
      highlights: {
        collectorRank: "Champion League",
        winrate: 89.2,
        skinsOwned: 0, // COC doesn't have skins
        highestRank: "Champion League II",
        loginInfo: "Supercell ID",
        server: "Global"
      },
      images: ["/android-chrome-512x512.png"],
      tags: ["TH15 Max", "Champion League", "Supercell ID", "Max Heroes"],
      isSold: false,
      status: "active"
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
    if (selectedGame === 'all') {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(account => account.gameType === selectedGame);
      setFilteredAccounts(filtered);
    }
  }, [selectedGame, accounts]);

  const handleGameFilter = (gameId) => {
    setSelectedGame(gameId);
    if (gameId === 'all') {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(account => account.gameType === gameId);
      setFilteredAccounts(filtered);
    }
  };

  const handleAccountClick = (account) => {
    // Navigate to individual account detail page
    navigate(`/account-details/${account._id}`, { state: { account } });
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
                  key={account._id}
                  className={`account-grid-card ${account.isSold ? 'out-of-stock' : ''}`}
                  onClick={() => handleAccountClick(account)}
                >
                  <div className="account-card-image">
                    <img src={account.images[0]} alt={account.game} />
                    {account.isSold && (
                      <div className="out-of-stock-overlay">
                        <span>Sold Out</span>
                      </div>
                    )}
                    {/* <div className="rank-badge">{account.highlights.collectorRank}</div> */}
                  </div>

                  <div className="account-card-content">
                    <div className="card-top-content">
                      <h3 className="account-game-title">{account.game}</h3>
                      <p className="account-description">{account.description}</p>

                      {/* <div className="account-features">
                        {account.tags.map((tag, index) => (
                          <span key={index} className="feature-tag">{tag}</span>
                        ))}
                      </div> */}
                    </div>

                    {/* <div className="card-bottom-content">
                      <div className="account-highlights">
                        <div className="highlight-item">
                          <span className="highlight-label">Winrate:</span>
                          <span className="highlight-value">{account.highlights.winrate}%</span>
                        </div>
                        {account.highlights.skinsOwned > 0 && (
                          <div className="highlight-item">
                            <span className="highlight-label">Skins:</span>
                            <span className="highlight-value">{account.highlights.skinsOwned}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="account-details">
                        <div className="account-server">{account.highlights.server}</div>
                        <div className="account-login">{account.highlights.loginInfo}</div>
                      </div>
                      
                   
                      
                      <button 
                        className={`buy-now-btn ${account.isSold ? 'disabled' : ''}`}
                        disabled={account.isSold}
                      >
                        {account.isSold ? 'Sold Out' : 'Buy Now'}
                      </button>
                    </div> */}

                    <div className="account-pricing">
                      <span className="current-price">₹{account.price}</span>
                    </div>
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