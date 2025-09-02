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
    id: parseInt(accountId),
    game: "Gaming Account",
    image: "/android-chrome-512x512.png",
    description: "Premium Gaming Account",
    price: 5000,
    originalPrice: 6000,
    discount: 17,
    inStock: true,
    features: ["High Level", "Premium Items", "Rare Skins"],
    serverRegion: "Global",
    accountLevel: 100,
    category: "Premium"
  };

  // Sample additional images for gallery
  const galleryImages = [
    account.image,
    "/android-chrome-512x512.png",
    "/android-chrome-192x192.png",
    "/favicon-32x32.png"
  ];

  const handlePurchase = () => {
    // Navigate to payment page with account details
    navigate('/payment', { 
      state: { 
        product: account,
        type: 'gaming-account'
      } 
    });
  };

  const handleBackToStore = () => {
    navigate('/account-store');
  };

  return (
    <Layout>
      <div className="account-details-container">
        {/* Back Button */}
        <button className="back-button" onClick={handleBackToStore}>
          ← Back to Store
        </button>

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
              {account.discount > 0 && (
                <div className="discount-badge">-{account.discount}%</div>
              )}
              {!account.inStock && (
                <div className="out-of-stock-overlay">
                  <span>Out of Stock</span>
                </div>
              )}
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
              <h1>{account.game}</h1>
              <div className="category-badge">{account.category}</div>
            </div>

            <div className="account-pricing">
              {account.originalPrice > account.price && (
                <span className="original-price">₹{account.originalPrice.toLocaleString()}</span>
              )}
              <span className="current-price">₹{account.price.toLocaleString()}</span>
              {account.discount > 0 && (
                <span className="savings">Save ₹{(account.originalPrice - account.price).toLocaleString()}</span>
              )}
            </div>

            <div className="account-description">
              <h3>Description</h3>
              <p>{account.description}</p>
            </div>

            <div className="account-details-section">
              <h3>Account Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Level:</span>
                  <span className="value">{account.accountLevel}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Server Region:</span>
                  <span className="value">{account.serverRegion}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className="value">{account.category}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Stock Status:</span>
                  <span className={`value ${account.inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {account.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="account-features-section">
              <h3>Features & Items</h3>
              <div className="features-grid">
                {account.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>

            <div className="purchase-section">
              <button 
                className={`purchase-btn ${!account.inStock ? 'disabled' : ''}`}
                onClick={handlePurchase}
                disabled={!account.inStock}
              >
                {account.inStock ? `Buy Now - ₹${account.price.toLocaleString()}` : 'Out of Stock'}
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
