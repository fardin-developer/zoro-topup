import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { message } from "antd";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import axios from "axios";

import HistoryIcon from "@mui/icons-material/History";
import IMAGES from "../img/image.js";
import "./Wallet.css";

const Wallet = () => {
  const { user } = useSelector((state) => state.user);
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ email: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [balance, setBalance] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [histories, setHistories] = useState([]);
  const [historyData, setHistoryData] = useState([]);



  useEffect(() => {
    getWalletBalance();
  }, []);

  async function getWalletBalance() {
    try {
      const res = await axios.get("https://api.zorotopup.com/api/v1/user/profile", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setBalance(res.data.user.balance || "0");
      }
    } catch (error) {
      console.log(error);
      setBalance("0");
    }
  }



  async function addWalletBalance() {
    try {
      setLoading(true);
      const paymentObject = {
        amount: parseInt(form?.amount),
        redirectUrl: `https://api.zorotopup.com/api/v1/wallet/add/wallet`,
      };
      
      const response = await axios.post(
        "https://api.zorotopup.com/api/v1/wallet/add",
        paymentObject,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
             if (response.data.success) {
         message.success(response.data.message);
         // Store transaction details for reference
         localStorage.setItem("currentTransaction", JSON.stringify(response.data.transaction));
         
         // Refresh balance after successful payment request
         getWalletBalance();
         
         // Redirect to payment URL
         if (response.data.transaction.paymentUrl) {
           window.location.href = response.data.transaction.paymentUrl;
         } else {
           // Show UPI options if payment URL is not available
           showUpiOptions(response.data.transaction);
         }
       } else {
        message.error(response.data.message || "Failed to create payment request");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      message.error("Failed to create payment request. Please try again.");
      setLoading(false);
    }
  }

  const showUpiOptions = (transaction) => {
    if (transaction.upiIntent) {
      const upiOptions = transaction.upiIntent;
      const options = [];
      
      if (upiOptions.bhim_link) {
        options.push({ name: "BHIM UPI", link: upiOptions.bhim_link });
      }
      if (upiOptions.phonepe_link) {
        options.push({ name: "PhonePe", link: upiOptions.phonepe_link });
      }
      if (upiOptions.paytm_link) {
        options.push({ name: "Paytm", link: upiOptions.paytm_link });
      }
      if (upiOptions.gpay_link) {
        options.push({ name: "Google Pay", link: upiOptions.gpay_link });
      }
      
      // Create a modal or alert to show UPI options
      const optionText = options.map(option => 
        `${option.name}: ${option.link}`
      ).join('\n\n');
      
      alert(`Payment Options:\n\n${optionText}\n\nOrder ID: ${transaction.orderId}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    const filteredHis = historyData?.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const selected = new Date(selectedDate);
      return (
        itemDate.getDate() === selected.getDate() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getFullYear() === selected.getFullYear()
      );
    });
    setHistories(filteredHis);
  }, [selectedDate]);

  async function getHistories() {
    try {
      const res = await axios.get("https://api.zorotopup.com/api/v1/transaction/history", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setHistories(res.data.transactions.reverse());
        setHistoryData(res.data.transactions);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [e.target.name]: e.target.value });
    if (name === "amount") {
      if (value < 20) {
        setError(true);
      } else {
        setError(false);
      }
    }
  }

  useEffect(() => {
    getHistories();
  }, []);

  return (
    <Layout>
      <div className="walletcontainer">
        {tab === 0 && (
          <>
            <div className="addmoneyform">
              <h4>Add Money To Wallet</h4>
              <p>
                <img src={IMAGES.ycoin} alt="" />
                Current Balance : {balance} Z Coins
              </p>
              <label>Enter Amount</label>
              <div>
                <input
                  type="text"
                  name="amount"
                  onChange={handleChange}
                  value={form?.amount}
                  placeholder="e.g. 100, 200, 500"
                />
              </div>
              <button onClick={addWalletBalance}>
                {loading ? "Processing..." : "Add Money"}
              </button>
              <div className="forgot-pass">
                Need Help? <Link to="/support">Contact Support</Link>
              </div>
            </div>
            <div className="checkhistory" onClick={() => setTab(1)}>
              <span>Check History</span>
              <HistoryIcon className="icon" />
            </div>
          </>
        )}

        {/* history  */}
        {/* history  */}
        {/* history  */}
        {tab === 1 && (
          <div className="wallethistories">
            <h4>Your Payments</h4>
            <div className="tools mb-3">
              <div className="form-fields">
                <input
                  type="date"
                  className="py-2 form-control"
                  name="addition"
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="form-fields">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setHistories(historyData);
                  }}
                >
                  Clear Filter
                </button>
              </div>
            </div>
            {/* DESKTOP */}
            {/* DESKTOP */}
            {/* DESKTOP */}
            <div className="d-none d-md-none d-lg-block">
              <table className="table table-dark">
                                 <thead className="custom-thead">
                   <tr>
                     <th>
                       <small>Order ID</small>
                     </th>
                     <th>
                       <small>Amount</small>
                     </th>
                     <th>
                       <small>Status</small>
                     </th>
                     <th>
                       <small>Payment Note</small>
                     </th>
                     <th>
                       <small>Customer Name</small>
                     </th>
                     <th>
                       <small>UTR Number</small>
                     </th>
                     <th>
                       <small>Payer UPI</small>
                     </th>
                     <th>
                       <small>Date</small>
                     </th>
                   </tr>
                 </thead>
                <tbody>
                  {histories && histories?.length === 0 ? (
                    <tr>
                      <td align="center" colSpan={9}>
                        No record found
                      </td>
                    </tr>
                  ) : (
                                         histories?.map((item, index) => {
                       return (
                         <tr key={item._id}>
                           <td>
                             <small>{item.orderId}</small>
                           </td>
                           <td>
                             <b>
                               <small>₹{parseFloat(item.amount).toFixed(2)}</small>
                             </b>
                           </td>
                           <td>
                             <small>
                               <span className={`badge ${item.status === 'success' ? 'bg-success' : item.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                                 {item.status.toUpperCase()}
                               </span>
                             </small>
                           </td>
                           <td>
                             <small>{item.paymentNote}</small>
                           </td>
                           <td>
                             <small>{item.customerName}</small>
                           </td>
                           <td>
                             <small>{item.utr || "N/A"}</small>
                           </td>
                           <td>
                             <small>{item.payerUpi || "N/A"}</small>
                           </td>
                           <td>
                             <small>
                               {new Date(item?.createdAt).toLocaleString(
                                 "default",
                                 {
                                   day: "numeric",
                                   month: "long",
                                   year: "numeric",
                                   hour: "numeric",
                                   minute: "numeric",
                                   second: "numeric",
                                 }
                               )}
                             </small>
                           </td>
                         </tr>
                       );
                     })
                  )}
                </tbody>
              </table>
            </div>
            {/* MOBILE */}
            {/* MOBILE */}
            {/* MOBILE */}
            <div className="d-block d-lg-none wallet-history-mobile">
              {histories && histories?.length === 0 ? (
                <div className="whistory m-0">No record found</div>
              ) : (
                histories?.map((item, index) => {
                  return (
                    <div className="whistory">
                      <div className="items">
                        <span className="fw-bold">Transaction Details</span>
                        <span className="fw-bold text-success text-end">
                          {new Date(
                            item?.createdAt || item?.created
                          ).toLocaleString("default", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "numeric",
                            second: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="items">
                        <div className="item-name">
                          <span>Order Id</span>
                        </div>
                        <div className="item-details text-primary">
                          <span>{item?.orderId}</span>
                        </div>
                      </div>

                                             <div className="items">
                         <div className="item-name">
                           <span>Amount</span>
                         </div>
                         <div className="item-details">
                           <span>₹{item?.amount}</span>
                         </div>
                       </div>
                       <div className="items">
                         <div className="item-name">
                           <span>Status</span>
                         </div>
                         <div className="item-details">
                           <span className={`${item.status === 'success' ? 'text-success' : item.status === 'pending' ? 'text-warning' : 'text-danger'}`}>
                             {item.status.toUpperCase()}
                           </span>
                         </div>
                       </div>
                       <div className="items">
                         <div className="item-name">
                           <span>Payment Note</span>
                         </div>
                         <div className="item-details">
                           <span>{item?.paymentNote}</span>
                         </div>
                       </div>
                       <div className="items">
                         <div className="item-name">
                           <span>Customer Name</span>
                         </div>
                         <div className="item-details">
                           <span>{item?.customerName}</span>
                         </div>
                       </div>
                       {item?.utr && (
                         <div className="items">
                           <div className="item-name">
                             <span>UTR Number</span>
                           </div>
                           <div className="item-details">
                             <span>{item?.utr}</span>
                           </div>
                         </div>
                       )}
                       {item?.payerUpi && (
                         <div className="items">
                           <div className="item-name">
                             <span>Payer UPI</span>
                           </div>
                           <div className="item-details">
                             <span>{item?.payerUpi}</span>
                           </div>
                         </div>
                       )}
                    </div>
                  );
                })
              )}
            </div>
            <button onClick={() => setTab(0)}>Back</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wallet;
