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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [currentPage, setCurrentPage] = useState(1);

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
        localStorage.setItem("currentTransaction", JSON.stringify(response.data.transaction));
        getWalletBalance();
        
        if (response.data.transaction.paymentUrl) {
          window.location.href = response.data.transaction.paymentUrl;
        } else {
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
      
      const optionText = options.map(option => 
        `${option.name}: ${option.link}`
      ).join('\n\n');
      
      alert(`Payment Options:\n\n${optionText}\n\nOrder ID: ${transaction.orderId}`);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedDate) {
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
    }
  }, [selectedDate, historyData]);

  async function getHistories(page = 1) {
    try {
      const res = await axios.get(`https://api.zorotopup.com/api/v1/wallet/history?page=${page}&limit=10`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        const transactions = res.data.data.transactions || [];
        setHistories(transactions.reverse());
        setHistoryData(transactions);
        setPagination(res.data.data.pagination);
        setCurrentPage(page);
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

  // Pagination helper functions
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pages) {
      getHistories(page);
    }
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;

    // Show first page
    if (currentPage > 3) {
      pages.push(
        <button 
          key={1} 
          className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
          onClick={() => handlePageChange(1)}
        >
          1
        </button>
      );
      if (currentPage > 4) {
        pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(
        <button 
          key={i} 
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) {
        pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button 
          key={totalPages} 
          className={`pagination-btn ${currentPage === totalPages ? 'active' : ''}`}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return (
      <div className="pagination-container">
        <div className="pagination-info">
          <small>
            Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} entries
          </small>
        </div>
        <div className="pagination-controls">
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
          {pages}
          <button 
            className="pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

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
            <div className="checkhistory" onClick={() => {
              setTab(1);
              getHistories(1);
            }}>
              <span>Check History</span>
              <HistoryIcon className="icon" />
            </div>
          </>
        )}

        {/* history */}
        {tab === 1 && (
          <div className="wallethistories">
            <h4>Your Payment History</h4>
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
                    setSelectedDate("");
                  }}
                >
                  Clear Filter
                </button>
              </div>
            </div>
            
            {/* DESKTOP */}
            <div className="d-none d-md-none d-lg-block">
              <table className="table table-dark table-responsive">
                <thead className="custom-thead">
                  <tr>
                    <th><small>Transaction ID</small></th>
                    <th><small>Type</small></th>
                    <th><small>Amount</small></th>
                    <th><small>Status</small></th>
                    <th><small>Description</small></th>
                    <th><small>Balance</small></th>
                    <th><small>Date</small></th>
                  </tr>
                </thead>
                <tbody>
                  {histories && histories?.length === 0 ? (
                    <tr>
                      <td align="center" colSpan={7}>
                        No record found
                      </td>
                    </tr>
                  ) : (
                    histories?.map((item, index) => {
                      return (
                        <tr key={item._id}>
                          <td>
                            <small>{item.metadata?.orderId || item._id}</small>
                          </td>
                          <td>
                            <small>
                              <span className={`badge ${item.transactionType === 'credit' ? 'bg-success' : 'bg-danger'}`}>
                                {item.transactionType.toUpperCase()}
                              </span>
                            </small>
                          </td>
                          <td>
                            <b>
                              <small>₹{parseFloat(item.amount).toFixed(2)}</small>
                            </b>
                          </td>
                          <td>
                            <small>
                              <span className={`badge ${item.status === 'completed' ? 'bg-success' : item.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>
                                {item.status.toUpperCase()}
                              </span>
                            </small>
                          </td>
                          <td className="description-cell">
                            <small>{item.description}</small>
                          </td>
                          <td className="balance-cell">
                            <small>
                              <div>Before: ₹{item.balanceBefore}</div>
                              <div>After: ₹{item.balanceAfter}</div>
                            </small>
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
            <div className="d-block d-lg-none wallet-history-mobile">
              {histories && histories?.length === 0 ? (
                <div className="whistory m-0">No record found</div>
              ) : (
                histories?.map((item, index) => {
                  return (
                    <div className="whistory" key={item._id}>
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
                          <span>Transaction ID</span>
                        </div>
                        <div className="item-details text-primary">
                          <span>{item?.metadata?.orderId || item?._id}</span>
                        </div>
                      </div>
                      <div className="items">
                        <div className="item-name">
                          <span>Type</span>
                        </div>
                        <div className="item-details">
                          <span className={`${item.transactionType === 'credit' ? 'text-success' : 'text-danger'}`}>
                            {item?.transactionType?.toUpperCase()}
                          </span>
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
                          <span className={`${item.status === 'completed' ? 'text-success' : item.status === 'pending' ? 'text-warning' : 'text-danger'}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="items">
                        <div className="item-name">
                          <span>Description</span>
                        </div>
                        <div className="item-details">
                          <span>{item?.description}</span>
                        </div>
                      </div>
                      <div className="items">
                        <div className="item-name">
                          <span>Balance Before</span>
                        </div>
                        <div className="item-details">
                          <span>₹{item?.balanceBefore}</span>
                        </div>
                      </div>
                      <div className="items">
                        <div className="item-name">
                          <span>Balance After</span>
                        </div>
                        <div className="item-details">
                          <span>₹{item?.balanceAfter}</span>
                        </div>
                      </div>
                      {item?.metadata?.utr && (
                        <div className="items">
                          <div className="item-name">
                            <span>UTR Number</span>
                          </div>
                          <div className="item-details">
                            <span>{item?.metadata?.utr}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Pagination */}
            {!selectedDate && renderPagination()}

            <button onClick={() => setTab(0)}>Back</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Wallet;