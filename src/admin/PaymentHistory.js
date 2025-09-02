import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../user/components/DashboardLayout";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import "./PaymentHistory.css";

const PaymentHistory = () => {
  const { user } = useSelector((state) => state.user);
  const [sideMenu, setSideMenu] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    dateFrom: "",
    dateTo: "",
    status: "",
    orderType: ""
  });

  async function getUserPayments() {
    if (!user) return;
    
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', filters.page.toString());
      queryParams.append('limit', filters.limit.toString());
      
      if (filters.dateFrom) {
        queryParams.append('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        queryParams.append('dateTo', filters.dateTo);
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.orderType) {
        queryParams.append('orderType', filters.orderType);
      }

      const res = await axios.get(
        `https://api.zorotopup.com/api/v1/transaction/history?${queryParams.toString()}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      
      if (res.data.success) {
        setPayments(res.data.transactions);
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.log(error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUserPayments();
  }, [user, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset to page 1 when other filters change
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      dateFrom: "",
      dateTo: "",
      status: "",
      orderType: ""
    });
  };

  const handlePageChange = (newPage) => {
    handleFilterChange('page', newPage);
  };

  function getStatus(status) {
    switch (status) {
      case "pending":
        return "text-warning";
      case "processing":
        return "text-primary";
      case "failed":
        return "text-danger";
      case "completed":
        return "text-success";
      case "cancelled":
      case "refunded":
        return "text-primary";
      default:
        return "text-dark";
    }
  }

  return (
    <Layout>
      <div className="paymentscontainer">
        <div className="wallethistories">
          <h4>Your Payment History</h4>

          {/* Filter Tools */}
          <div className="tools mb-3">
            <div className="row">
              <div className="col-md-3">
                <div className="form-fields">
                  <label className="form-label text-white">From Date</label>
                  <input
                    type="date"
                    className="py-2 form-control"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-fields">
                  <label className="form-label text-white">To Date</label>
                  <input
                    type="date"
                    className="py-2 form-control"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="form-fields">
                  <label className="form-label text-white">Status</label>
                  <select
                    className="py-2 form-control"
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              {/* <div className="col-md-2">
                <div className="form-fields">
                  <label className="form-label text-white">Per Page</label>
                  <select
                    className="py-2 form-control"
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                
              </div> */}
              <div className="col-md-2">
                <div className="form-fields">
                  <label className="form-label text-white">&nbsp;</label>
                  <button
                    className="btn btn-danger w-100"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {/* DESKTOP TABLE */}
          <div className="d-none d-md-none d-lg-block">
            <table className="table table-dark">
              <thead className="custom-thead">
                <tr>
                  <th>Sr No</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date</th>
                  <th>Payment Note</th>
                  <th>Customer Name</th>
                  <th>UTR Number</th>
                  <th>Payer UPI</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {!loading && payments?.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <p className="text-center m-0">No Record Found</p>
                    </td>
                  </tr>
                ) : (
                  payments?.map((item, index) => {
                    const globalIndex = (pagination.currentPage - 1) * filters.limit + index + 1;
                    return (
                      <tr key={item._id}>
                        <td>
                          <small>{globalIndex}</small>
                        </td>
                        <td>
                          <small>{item?.orderId}</small>
                        </td>
                        <td>
                          <b>
                            <small>
                              ₹{parseFloat(item?.amount).toFixed(2)}
                            </small>
                          </b>
                        </td>
                        <td>
                          <small>{item?.paymentMethod?.toUpperCase() || "N/A"}</small>
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
                        <td>
                          <small className="fw-bold text-info">
                            {item?.paymentNote || "N/A"}
                          </small>
                        </td>
                        <td>
                          <small>{item?.customerName || "N/A"}</small>
                        </td>
                        <td>
                          <small>{item?.utr || "N/A"}</small>
                        </td>
                        <td>
                          <small>{item?.payerUpi || "N/A"}</small>
                        </td>
                        <td className={`${getStatus(item?.status)}`}>
                          <small>{item?.status?.toUpperCase()}</small>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className={`account-modal-container d-lg-none d-md-none`}>
            <div className="account-modal-container-content">
              <div
                className="top-right-content box-2 center"
                onClick={() => setSideMenu(!sideMenu)}
              ></div>
            </div>
            <div className="payment-containers d-block d-md-block d-lg-none">
              <p>Payment History</p>
              <hr />
              {!loading && payments?.length === 0 ? (
                <p className="text-center m-0">No Record Found</p>
              ) : (
                payments?.map((item, index) => {
                  return (
                    <div className="payments w-100" key={item._id}>
                      <div className="item">
                        <h5>Transaction ID: {item?.orderId}</h5>
                        <span>₹{item?.amount}</span>
                      </div>
                      <div className="item">
                        <span className="">
                          <small>
                            {new Date(item?.createdAt).toLocaleString(
                              "default",
                              {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                second: "numeric",
                              }
                            )}
                          </small>
                        </span>
                        <span className={`fw-bold ${getStatus(item?.status)}`}>
                          <small>
                            {item?.status?.toUpperCase()}
                          </small>
                        </span>
                      </div>
                      <div className="item">
                        <small className="text-muted">
                          {item?.paymentNote || "N/A"}
                        </small>
                        <small className="text-info">
                          {item?.paymentMethod?.toUpperCase() || "N/A"}
                        </small>
                      </div>
                      <div className="item">
                        <small className="text-muted">
                          Customer: {item?.customerName || "N/A"}
                        </small>
                        {item?.utr && (
                          <small className="text-info">
                            UTR: {item?.utr}
                          </small>
                        )}
                      </div>
                      {index !== payments.length - 1 && <hr />}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pagination */}
          {!loading && pagination.totalOrders > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="text-white">
                <small>
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalOrders)} of{' '}
                  {pagination.totalOrders} entries
                </small>
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${!pagination.hasPrevPage ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark text-white border-secondary"
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {/* Page numbers */}
                  {[...Array(Math.min(5, pagination.totalPages))].map((_, idx) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = idx + 1;
                    } else {
                      const start = Math.max(1, pagination.currentPage - 2);
                      const end = Math.min(pagination.totalPages, start + 4);
                      pageNum = start + idx;
                      if (pageNum > end) return null;
                    }
                    
                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''}`}
                      >
                        <button
                          className="page-link bg-dark text-white border-secondary"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark text-white border-secondary"
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PaymentHistory;
