import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGamingIdsWithPagination } from "../services/gamingIdService";
import "./GamingAccounts.css";

const GamingAccounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the last 10 gaming accounts
  useEffect(() => {
    const loadRecentAccounts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchGamingIdsWithPagination(1, 10);
        
        if (response.success) {
          setAccounts(response.gamingIds || []);
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

    loadRecentAccounts();
  }, []);

  const handleAccountClick = (account) => {
    // Navigate to individual account detail page
    navigate(`/account-details/${account._id}`, { state: { account } });
  };

  if (loading) {
    return (
      <div className="gaming-accounts-container">
        <div className="accounts-header">
          <h2 className="accounts-title">Accounts for sale</h2>
          <span onClick={() => navigate("/account-store")} className="view-more-link">View More</span>
        </div>
        <div className="accounts-loading">
          <div className="loading-spinner"></div>
          <p>Loading Gaming Accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gaming-accounts-container">
        <div className="accounts-header">
          <h2 className="accounts-title">Accounts for sale</h2>
          <span onClick={() => navigate("/account-store")} className="view-more-link">View More</span>
        </div>
        <div className="accounts-error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

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
          {accounts.length === 0 ? (
            <div className="no-accounts">
              <p>No gaming accounts available at the moment.</p>
            </div>
          ) : (
            accounts.map((account) => (
              <div key={account._id} className="account-card" onClick={() => handleAccountClick(account)}>
                <div className="account-image-container">
                  <img 
                    src={account.images && account.images[0] ? account.images[0] : "/android-chrome-512x512.png"} 
                    alt={`${account.game} Account`}
                    className="account-image"
                    onError={(e) => {
                      e.target.src = "/android-chrome-512x512.png"; // Fallback image
                    }}
                  />
                  {account.isSold && (
                    <div className="sold-overlay">
                      <span>Sold</span>
                    </div>
                  )}
                  <div className="category-tag">{account.game}</div>
                  <div className="account-overlay">
                    <div className="account-info">
                      <h3>{account.title || account.game}</h3>
                      {/* <p>{account.description}</p> */}
                      <div className="pricing">
                        <span className="current-price">₹{account.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GamingAccounts;