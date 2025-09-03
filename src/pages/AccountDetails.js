import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import './AccountDetails.css';

const AccountDetails = () => {
  const { accountId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get account data from state or fetch from API
  const account = location.state?.account || {
    _id: accountId,
    game: "Gaming Account",
    gameType: "unknown",
    title: "Premium Gaming Account",
    description: "Premium Gaming Account",
    price: 5000,
    currency: "INR",
    highlights: {
      collectorRank: "Unknown",
      winrate: 0,
      skinsOwned: 0,
      highestRank: "Unknown",
      loginInfo: "Unknown",
      server: "Unknown"
    },
    skins: [],
    images: ["/android-chrome-512x512.png"],
    tags: ["High Level", "Premium Items", "Rare Skins"],
    isSold: false,
    status: "active"
  };

  // Use account images or fallback to sample images
  const galleryImages = account.images && account.images.length > 0 
    ? account.images 
    : ["/android-chrome-512x512.png", "/android-chrome-192x192.png", "/favicon-32x32.png"];

  const handlePurchase = () => {
    // Redirect to WhatsApp for purchase inquiry
    window.open('https://api.whatsapp.com/send/?phone=919402831766&text&type=phone_number&app_absent=0', '_blank');
  };

  const handleBackToStore = () => {
    navigate('/account-store');
  };

  return (
    <Layout>
      <div className="account-details-container">
        {/* Back Buttons */}
        <div className="back-navigation">
          <button className="back-button" onClick={handleBackToStore}>
            ← Back to Store
          </button>
        </div>

        <div className="account-details-content">
          {/* Image Gallery */}
          <div className="account-gallery">
            <div className="main-image">
              <img 
                src={galleryImages[selectedImageIndex]} 
                alt={account.game}
                onError={(e) => {
                  e.target.src = "/android-chrome-512x512.png";
                }}
              />
              {account.isSold && (
                <div className="out-of-stock-overlay">
                  <span>Sold Out</span>
                </div>
              )}
              <div className="rank-badge">{account.highlights.collectorRank}</div>
            </div>
            
            <div className="thumbnail-gallery">
              {galleryImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${account.game} ${index + 1}`}
                  className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                  onError={(e) => {
                    e.target.src = "/android-chrome-512x512.png";
                  }}
                />
              ))}
            </div>
          </div>

          {/* Account Information */}
          <div className="account-info">
            <div className="account-header">
              <h1>{account.title || account.game}</h1>
              <div className="game-type-badge">{account.game}</div>
            </div>

            <div className="account-pricing">
              <span className="current-price">₹{account.price.toLocaleString()}</span>
              <span className="currency">{account.currency}</span>
            </div>

            <div className="account-description">
              <h3>Description</h3>
              <p>{account.description}</p>
            </div>

            {/* Account Highlights */}
            <div className="account-highlights-section">
              <h3>Account Highlights</h3>
              <div className="highlights-grid">
                <div className="highlight-item">
                  <span className="label">Rank:</span>
                  <span className="value rank-value">{account.highlights.collectorRank}</span>
                </div>
                <div className="highlight-item">
                  <span className="label">Win Rate:</span>
                  <span className="value winrate-value">{account.highlights.winrate}%</span>
                </div>
                <div className="highlight-item">
                  <span className="label">Highest Rank:</span>
                  <span className="value">{account.highlights.highestRank}</span>
                </div>
                <div className="highlight-item">
                  <span className="label">Server:</span>
                  <span className="value">{account.highlights.server}</span>
                </div>
                <div className="highlight-item">
                  <span className="label">Login Type:</span>
                  <span className="value">{account.highlights.loginInfo}</span>
                </div>
                {account.highlights.skinsOwned > 0 && (
                  <div className="highlight-item">
                    <span className="label">Skins Owned:</span>
                    <span className="value skins-value">{account.highlights.skinsOwned}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skins Collection */}
            {account.skins && account.skins.length > 0 && (
              <div className="skins-section">
                <h3>Featured Skins</h3>
                <div className="skins-grid">
                  {account.skins.map((skin, index) => (
                    <div key={index} className="skin-item">
                      <div className="skin-hero">{skin.hero}</div>
                      <div className="skin-name">{skin.skinName}</div>
                      <div className={`skin-rarity ${skin.rarity.toLowerCase()}`}>
                        {skin.rarity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="account-tags-section">
              <h3>Features & Highlights</h3>
              <div className="tags-grid">
                {account.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Account Status */}
            <div className="account-status-section">
              <h3>Account Status</h3>
              <div className="status-grid">
                <div className="status-item">
                  <span className="label">Status:</span>
                  <span className={`value status-${account.status}`}>
                    {account.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="status-item">
                  <span className="label">Availability:</span>
                  <span className={`value ${account.isSold ? 'out-of-stock' : 'in-stock'}`}>
                    {account.isSold ? 'Sold Out' : 'Available'}
                  </span>
                </div>
              </div>
            </div>

            <div className="purchase-section">
              <button 
                className={`purchase-btn ${account.isSold ? 'disabled' : ''}`}
                onClick={handlePurchase}
                disabled={account.isSold}
              >
                {account.isSold ? 'Sold Out' : `Contact Us - ₹${account.price.toLocaleString()}`}
              </button>
              
              <div className="security-info">
                <p>🔒 Secure Payment • 📱 Instant Delivery • 🛡️ Account Guarantee</p>
              </div>
            </div>

            <div className="additional-info">
              <div className="info-section">
                <h4>✨ What You Get</h4>
                <ul>
                  <li>Complete account access with login credentials</li>
                  <li>All items and progress as described</li>
                  <li>Account verification and guarantee</li>
                  <li>24/7 customer support</li>
                </ul>
              </div>

              <div className="info-section">
                <h4>📋 Important Notes</h4>
                <ul>
                  <li>Account details will be provided after payment</li>
                  <li>Please change password immediately after receiving</li>
                  <li>No refunds after account credentials are shared</li>
                  <li>Account binding may be required for some games</li>
                </ul>
              </div>

              <div className="info-section">
                <h4>🎮 Delivery Process</h4>
                <ul>
                  <li>Complete payment through secure gateway</li>
                  <li>Receive account details within 5-10 minutes</li>
                  <li>Verify account and change credentials</li>
                  <li>Start gaming immediately!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountDetails;
