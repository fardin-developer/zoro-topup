import Layout from "../components/Layout/Layout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import "./Success.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function getOrder() {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://api.zorotopup.com/api/v1/order/order-status?orderId=${params?.orderId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setOrder(res.data.order); // Updated to match your API response structure
      } else {
        setError("Failed to fetch order details");
      }
    } catch (error) {
      console.log(error);
      setError("Error fetching order details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params?.orderId) {
      getOrder();
    }
  }, [params?.orderId]);

  // Parse description if it's a JSON string
  const parseDescription = (description) => {
    try {
      return JSON.parse(description);
    } catch {
      return { text: description };
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'processing': 'Processing',
      'completed': 'Completed',
      'failed': 'Failed'
    };
    return statusMap[status] || status;
  };

  const getPaymentMethodDisplay = (method) => {
    const methodMap = {
      'wallet': 'Wallet',
      'upi': 'UPI',
      'cashpe': 'UPI'
    };
    return methodMap[method] || method;
  };

  return (
    <Layout>
      {location?.pathname === "/walletsuccess" ? (
        <div className="success-container">
          <div class="success">
            <CheckCircleOutlineIcon className="icon" />
            <h5 class="success-prompt-heading">Recharge successful!</h5>
            <p>Your money has been added to your wallet successfully.</p>

            <div class="success-button-container">
              <button
                class="success-button-main"
                type="button"
                onClick={() => navigate("/user-dashboard")}
              >
                Go to Dashboard
              </button>
              <button
                class="success-button-secondary"
                type="button"
                onClick={() => navigate("/")}
              >
                Make an Order
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="success-container">
          <div class="success">
            <CheckCircleOutlineIcon className="icon" />
            <h5 class="success-prompt-heading">
              {loading ? 'Processing...' : order?.status === 'completed' ? 'Recharge successful!' : 'Order processed successfully!'}
            </h5>
            <p>
              {loading 
                ? 'Please wait while we fetch your order details...'
                : order?.status === 'completed' 
                  ? 'Your top-up has been completed successfully. Thank you for recharging from zorotopup'
                  : 'Your order has been processed and is being fulfilled. You will receive your items shortly.'
              }
            </p>

            {loading ? (
              <div className="orderitemcontainer">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ 
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #3498db',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    animation: 'spin 2s linear infinite',
                    margin: '0 auto 10px'
                  }}></div>
                  <p>Loading order details...</p>
                </div>
              </div>
            ) : error ? (
              <div className="orderitemcontainer">
                <div style={{ textAlign: 'center', padding: '20px', color: '#e74c3c' }}>
                  <p>{error}</p>
                  <button 
                    onClick={getOrder}
                    style={{
                      padding: '8px 16px',
                      marginTop: '10px',
                      backgroundColor: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : order ? (
              <div className="orderitemcontainer">
                <div className="orderitem">
                  Order Id :<div className="item">{order?.orderId || order?._id}</div>
                </div>
                {/* <div className="orderitem">
                  User Id :<div className="item">{order?.userId}</div>
                </div> */}
                
                {/* Show Player ID and Server if it's a diamond pack order */}
                {order?.description && (() => {
                  const desc = parseDescription(order.description);
                  return desc.playerId ? (
                    <>
                      <div className="orderitem">
                        Player Id :<div className="item">{desc.playerId}</div>
                      </div>
                      <div className="orderitem">
                        Server :<div className="item">{desc.server}</div>
                      </div>
                    </>
                  ) : null;
                })()}

                <div className="orderitem">
                  Order Type :<div className="item">{order?.orderType?.replace('_', ' ') || 'Purchase'}</div>
                </div>

                {/* Show items */}
                {order?.items && order.items.length > 0 && (
                  <div className="orderitem">
                    Items :
                    <div className="item">
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.itemName} (Qty: {item.quantity})
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="orderitem">
                  Amount :<div className="item">₹{order?.amount}</div>
                </div>
                <div className="orderitem">
                  Currency :<div className="item">{order?.currency || 'INR'}</div>
                </div>
                <div className="orderitem">
                  Payment Method :
                  <div className="item">
                    {getPaymentMethodDisplay(order?.paymentMethod)}
                  </div>
                </div>
                <div className="orderitem">
                  Status :
                  <div className="item" style={{ 
                    color: order?.status === 'completed' ? '#27ae60' : 
                           order?.status === 'processing' ? '#f39c12' : 
                           order?.status === 'failed' ? '#e74c3c' : '#34495e'
                  }}>
                    {getStatusDisplay(order?.status)}
                  </div>
                </div>
                <div className="orderitem">
                  Order Date :
                  <div className="item">
                    {order?.createdAt && new Date(order?.createdAt).toLocaleString("default", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </div>
                </div>

                {/* Show API Results if available */}
                {order?.apiResults && order.apiResults.length > 0 && (
                  <div className="orderitem">
                    Provider Status :
                    <div className="item">
                      {order.apiResults.map((result, index) => (
                        <div key={index} style={{ fontSize: '0.9em', marginBottom: '2px' }}>
                          {result.provider}: {result.success ? '✅ Success' : '❌ Failed'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="orderitemcontainer">
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>No order data available</p>
                </div>
              </div>
            )}

            <div class="success-button-container">
              <button
                class="success-button-main"
                type="button"
                onClick={() => navigate("/user-dashboard")}
                disabled={loading}
              >
                Go to Dashboard
              </button>
              <button
                class="success-button-secondary"
                type="button"
                onClick={() => navigate("/")}
                disabled={loading}
              >
                Make Another Order
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Success;