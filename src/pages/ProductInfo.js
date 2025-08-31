import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { setUser } from "../redux/features/userSlice.js";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import getUserData from "../utils/userDataService.js";

// ICON
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedIcon from "@mui/icons-material/Verified";
import BoltIcon from "@mui/icons-material/Bolt";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SearchIcon from "@mui/icons-material/Search";
import IMAGES from "../img/image.js";
import website from "../website/data.js";

// CSS
import "./ProductInfo.css";
import "./PackAmount.css";
import "./Spinner.css";
import "./OrderSuccess.css";

const ProductInfo = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const paymentRef = useRef(null);
  const { pathname } = useLocation();

  const handleScrollToPayment = () => {
    if (paymentRef.current) {
      paymentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const { user } = useSelector((state) => state.user);
  const [checkBox, setCheckBox] = useState(false);
  const [playerCheck, setPlayerCheck] = useState(null);
  
  // Updated state for new backend
  const [gameData, setGameData] = useState(null);
  const [diamondPacks, setDiamondPacks] = useState([]);
  const [selectedPack, setSelectedPack] = useState(null);
  const [selectedPackId, setSelectedPackId] = useState("");
  const [showImage, setShowImage] = useState(0);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  //! API BASED
  const [orderId, setOrderId] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [server, setServer] = useState("");
  const [balance, setBalance] = useState("");

  // loading
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [readMore, setReadMore] = useState(false);

  // coupon - keeping existing coupon functionality
  const [coupon, setCoupon] = useState(null);
  const [couponId, setCouponId] = useState("");
  const [couponApplied, setCouponApplied] = useState(null);
  const [discount, setDiscount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [couponName, setCouponName] = useState("");

  // payment mode
  const [mode, setMode] = useState("WALLET");

  // Base URL for new backend
  const BASE_URL = "https://api.zorotopup.com";

  useEffect(() => {
    getUserData(dispatch, setUser, setBalance);
    getAllCoupons();
  }, []);

  const ScrollToTop = () => {
    window.scrollTo(0, 0);
    return null;
  };

  // Keep existing coupon functionality
  const getAllCoupons = async () => {
    try {
      const res = await axios.get("/api/admin/get-coupons");
      if (res.data.success) {
        // setData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(params.gameId);
  

  // Updated function to fetch diamond packs for a game
  const getDiamondPacks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/v1/games/${params.gameId}/diamond-packs`);
      
      if (res.data.success) {
        setDiamondPacks(res.data.diamondPacks);
        setGameData(res.data.gameData);
        
        // Set default selected pack
        if (res.data.diamondPacks.length > 0) {
          const defaultPack = res.data.diamondPacks[0];
          setSelectedPack(defaultPack);
          setSelectedPackId(defaultPack._id);
          setFinalAmount(calculatePackPrice(defaultPack));
        }
      } else {
        message.error("Failed to load diamond packs");
      }
    } catch (error) {
      console.log(error);
      message.error("Error loading diamond packs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.gameId) {
      getDiamondPacks();
    }
  }, [params.gameId]);

  // Calculate pack price (you can add reseller logic here)
  const calculatePackPrice = (pack) => {
    // Add your pricing logic here based on user type
    return pack.amount + pack.commission; // Example calculation
  };

  // Updated player validation function
  const handleCheckPlayer = async () => {
    if (playerId === "" || server === "") {
      return message.error(
        `${playerId === "" ? "Enter Player ID" : "Enter Server ID"}`
      );
    }

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/validate-user`, {
        game: gameData?.name || "MOBILE_LEGENDS_PRO", // Use game name from gameData
        userId: playerId,
        serverId: server,
      });

      if (response.data.success) {
        setPlayerCheck(response.data.username || "Player Found");
        message.success("Player validated successfully");
      } else {
        message.error(response.data.message || "Player not found");
        setPlayerCheck(null);
      }
    } catch (error) {
      console.log(error);
      message.error("Error validating player");
      setPlayerCheck(null);
    } finally {
      setLoading(false);
    }
  };

  // Updated order placement function
  const checkPlaceOrder = (e) => {
    ScrollToTop();
    
    if (playerId === "") {
      return message.error("Enter Player ID");
    }
    if (server === "") {
      return message.error("Enter Server ID");
    }
    if (!selectedPack) {
      return message.error("Select a diamond pack");
    }

    // Check if player validation is required
    if (gameData?.requiresValidation && playerCheck === null) {
      return message.error("Please validate your player first");
    }

    if (mode === "UPI") {
      handleUpiOrder(e);
    } else {
      handleWalletOrder(e);
    }
  };

  // Wallet order (balance purchase)
  const handleWalletOrder = async (e) => {
    if (parseInt(balance) < parseInt(finalAmount)) {
      return message.error("Balance is less for this order");
    }

    e.preventDefault();
    
    try {
      setLoading(true);
      const orderData = {
        diamondPackId: selectedPackId,
        playerId: playerId,
        server: server,
        quantity: quantity,
      };

      const response = await axios.post(`${BASE_URL}/api/v1/order/diamond-pack`, orderData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.data.success) {
        message.success("Order placed successfully!");
        setOrderSuccess(true);
        setOrderId(response.data.orderId);
        navigate(`/success/${response.data.orderId}`);
      } else {
        message.error(response.data.message);
        navigate("/failure");
      }
    } catch (error) {
      console.log(error);
      message.error("Error placing order");
      navigate("/failure");
    } finally {
      setLoading(false);
    }
  };

  // UPI order
  const handleUpiOrder = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const orderData = {
        diamondPackId: selectedPackId,
        playerId: playerId,
        server: server,
        quantity: quantity,
        redirectUrl: `${window.location.origin}/status`,
      };

      const response = await axios.post(`${BASE_URL}/api/v1/order/diamond-pack-upi`, orderData, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (response.data.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error initiating payment");
    } finally {
      setLoading(false);
    }
  };

  // Handle pack selection
  const handlePackSelection = (pack) => {
    setSelectedPack(pack);
    setSelectedPackId(pack._id);
    setFinalAmount(calculatePackPrice(pack));
    handleScrollToPayment();
    
    // Reset coupon if applied
    if (couponApplied) {
      setCouponApplied(false);
      setCouponId("");
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="loading-container">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </div>
      ) : orderSuccess ? (
        <div className="order-succcess-container">
          <h5>Order Successful</h5>
          <div className="order-recpt">
            <div className="order-item">
              <span>Game Name</span>
              <span>{gameData?.name}</span>
            </div>
            <div className="order-item">
              <span>Order Id</span>
              <span>{orderId}</span>
            </div>
            <div className="order-item">
              <span>Player Id</span>
              <span>{playerId}</span>
            </div>
            {server !== "" && (
              <div className="order-item">
                <span>Server Id</span>
                <span>{server}</span>
              </div>
            )}
            <div className="order-item">
              <span>Diamond Pack</span>
              <span>{selectedPack?.amount} Diamonds</span>
            </div>
            <div className="order-item">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="order-item">
              <span>Total Amount</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="topbanner">
            <div
              className={`p-info-container area loading ${loading && "active"}`}
              style={{
                backgroundImage: gameData?.bannerImage 
                  ? `url(${gameData.bannerImage})`
                  : `url(${website.link}/default-banner.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          </div>

          <div className="productdetails">
            <div className="pro-img">
              {loading ? (
                <div className="imagess"></div>
              ) : (
                <img src={gameData?.logo || `${website.link}/default-game.jpg`} alt="" />
              )}
              <div>
                <h2 className={`m-0 loading ${loading && "active"}`} style={{ overflow: "hidden" }}>
                  {gameData?.name}
                </h2>
                <h6 className="m-0 d-none d-md-none d-lg-block">
                  {gameData?.company || "Gaming Company"}
                </h6>
                <div className="features">
                  <button className={`loading ${loading && "active"}`}>
                    <VerifiedIcon className="icon text-primary" />
                    Official Service
                  </button>
                  <button className={`loading ${loading && "active"}`}>
                    <BoltIcon className="icon text-warning" />
                    Instant Process
                  </button>
                  <button className={`loading ${loading && "active"}`}>
                    <VerifiedUserIcon className="icon text-success" />
                    Secure Top-Ups
                  </button>
                  <button className={`loading ${loading && "active"}`}>
                    <SupportAgentIcon className="icon text-info" />
                    24/7 Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="product-info-container">
            <div className="product-info-content mb-2">
              {/* DIAMOND PACKS */}
              <div className="packageeeee">
                <div className="package-container">
                  {diamondPacks?.map((pack, index) => (
                    <div
                      key={pack._id}
                      onClick={() => handlePackSelection(pack)}
                      className={`amount ${selectedPackId === pack._id && "active"}`}
                    >
                      <div className="pack-details">
                        <div className="image">
                          <img src={pack.logo} alt="diamond pack" />
                        </div>
                        <div className="pack">
                          <p>{pack.amount} Diamonds</p>
                          <p>Instant Delivery</p>
                        </div>
                        <div className="price">
                          <p>₹{calculatePackPrice(pack)}</p>
                          {pack.originalPrice && (
                            <p className="fakeprice">₹{pack.originalPrice}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="pic d-none d-lg-block">
                <div className="product-info-img bg-fields transparentbg descbg">
                  <div className="game-name">
                    <h4>Description:</h4>
                  </div>
                  {readMore ? (
                    <>
                      <p>{gameData?.description || selectedPack?.description}</p>
                      <span className="text-primary" onClick={() => setReadMore(!readMore)}>
                        <small>Read Less</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <p>{(gameData?.description || selectedPack?.description)?.slice(0, 100)}...</p>
                      <span className="text-primary" onClick={() => setReadMore(!readMore)}>
                        <small>Read More</small>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* PLAYER FIELDS */}
              <div className="userfields" ref={paymentRef}>
                <div className="bg-fields transparentbg">
                  <h5>Enter Player Details</h5>
                  <div className="fieldss">
                    <input
                      className="player-tag"
                      type="text"
                      name="playerId"
                      placeholder="Player ID"
                      onChange={(e) => setPlayerId(e.target.value)}
                      value={playerId}
                    />
                    <input
                      className="player-tag"
                      type="text"
                      name="server"
                      placeholder="Server ID"
                      onChange={(e) => setServer(e.target.value)}
                      value={server}
                    />
                  </div>
                  <div className="playercheckbutton">
                    <button className="buy-now" onClick={handleCheckPlayer}>
                      <SearchIcon className="icon" />
                      Validate Player
                      {loading && (
                        <div className="spinner-grow spinner-grow-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </button>
                    {playerCheck !== null && (
                      <p className="playername">{playerCheck}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* PAYMENT METHOD */}
              <div className="paymentsection">
                <div className="bg-fields transparentbg">
                  <h5>Payment Method</h5>
                  <div className="payment-container">
                    <div
                      onClick={() => setMode("WALLET")}
                      className={`payment wallet ${mode === "WALLET" && "active"}`}
                    >
                      Z COINS
                    </div>
                    <div
                      onClick={() => setMode("UPI")}
                      className={`payment upi ${mode === "UPI" && "active"}`}
                    >
                      UPI
                    </div>
                  </div>
                </div>
              </div>

              {/* QUANTITY SELECTION */}
              <div className="quantitysection">
                <div className="bg-fields transparentbg">
                  <h5>Quantity</h5>
                  <div className="quantity-container">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-display">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              <div className="totaltable">
                <h5>Order Summary</h5>
                <div className="orderitem">
                  <div className="item">Diamond Pack</div>
                  <div className="item">{selectedPack?.amount || 0} Diamonds</div>
                </div>
                <div className="orderitem">
                  <div className="item">Quantity</div>
                  <div className="item">{quantity}</div>
                </div>
                <div className="orderitem">
                  <div className="item">Total Amount</div>
                  <div className="item">₹{finalAmount * quantity}</div>
                </div>
              </div>

              {user && (
                <div className="eighteenplusconfirmation">
                  <div className="text">
                    <input
                      type="checkbox"
                      className="checkbox"
                      name="check"
                      onChange={() => setCheckBox(!checkBox)}
                    />
                    I, {user?.fname} confirms that I am 18+ age
                  </div>
                  {!checkBox && (
                    <div className="note">
                      Note: Please check the box to continue
                    </div>
                  )}
                </div>
              )}

              <div className="totalsection">
                {!user ? (
                  <button onClick={() => navigate("/login")} className="buy-now">
                    Please Login First
                  </button>
                ) : (
                  <button
                    disabled={!checkBox || !selectedPack}
                    onClick={checkPlaceOrder}
                    className={`buy-now ${(!checkBox || !selectedPack) && "disabled"}`}
                  >
                    Place Order - ₹{finalAmount * quantity}
                  </button>
                )}
              </div>

              {/* MOBILE DESCRIPTION */}
              <div className="pic d-block d-lg-none">
                <div className="product-info-img bg-fields transparentbg descbg">
                  <div className="game-name">
                    <h4>Description:</h4>
                  </div>
                  {readMore ? (
                    <>
                      <p>{gameData?.description || selectedPack?.description}</p>
                      <span className="text-primary" onClick={() => setReadMore(!readMore)}>
                        <small>Read Less</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <p>{(gameData?.description || selectedPack?.description)?.slice(0, 100)}...</p>
                      <span className="text-primary" onClick={() => setReadMore(!readMore)}>
                        <small>Read More</small>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ProductInfo;