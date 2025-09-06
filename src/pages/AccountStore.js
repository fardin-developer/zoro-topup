import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import GamingAccounts from '../components/GamingAccounts';
import { fetchGamingIds } from '../services/gamingIdService';
import './AccountStore.css';

const AccountStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

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

  // Function to load gaming accounts from API
  const loadGamingAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchGamingIds();
      
      if (response.success) {
        setAccounts(response.gamingIds || []);
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: 10
        });
      } else {
        setError('Failed to load gaming accounts');
      }
    } catch (error) {
      console.error('Error loading gaming accounts:', error);
      setError('Failed to load gaming accounts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Generate game categories dynamically from the accounts data
  const getGameCategories = () => {
    const gameCounts = {};
    accounts.forEach(account => {
      const game = account.game || 'Unknown';
      gameCounts[game] = (gameCounts[game] || 0) + 1;
    });

    const categories = [
      { id: 'all', name: 'All Games', count: accounts.length }
    ];

    // Add categories for each unique game
    Object.entries(gameCounts).forEach(([game, count]) => {
      categories.push({
        id: game.toLowerCase().replace(/\s+/g, ''),
        name: game,
        count: count
      });
    });

    return categories;
  };

  useEffect(() => {
    loadGamingAccounts();
  }, []);

  useEffect(() => {
    if (selectedGame === 'all') {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(account => {
        const gameId = account.game?.toLowerCase().replace(/\s+/g, '');
        return gameId === selectedGame;
      });
      setFilteredAccounts(filtered);
    }
  }, [selectedGame, accounts]);

  const handleGameFilter = (gameId) => {
    setSelectedGame(gameId);
    if (gameId === 'all') {
      setFilteredAccounts(accounts);
    } else {
      const filtered = accounts.filter(account => {
        const gameIdFromAccount = account.game?.toLowerCase().replace(/\s+/g, '');
        return gameIdFromAccount === gameId;
      });
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

  if (error) {
    return (
      <Layout>
        <div className="account-store-error">
          <h3>Error Loading Accounts</h3>
          <p>{error}</p>
          <button onClick={loadGamingAccounts} className="retry-button">
            Try Again
          </button>
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
            {getGameCategories().map((category) => (
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
                  </div>
                  
                  <div className="account-card-content">
                    <h3 className="account-game-title">{account.title || account.game}</h3>
                    <p className="account-description">{account.description}</p>
                    <div className="account-highlights">
                      {account.highlights?.highestRank && (
                        <span className="highlight-tag">Rank: {account.highlights.highestRank}</span>
                      )}
                      {account.highlights?.winrate && (
                        <span className="highlight-tag">Winrate: {account.highlights.winrate}%</span>
                      )}
                    </div>
                    <span className="current-price">₹{account.price}</span>
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