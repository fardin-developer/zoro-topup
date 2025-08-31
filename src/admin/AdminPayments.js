import React, { useEffect, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { message, Pagination } from "antd";
import "./AdminQueries.css";

const AdminPayments = () => {
  const [payments, setPayments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const getAllPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/payment/get-all-payments", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setPayments(res.data.data.reverse());
        setLoading(false);
      } else {
        setLoading(false);
        message.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPayments();
  }, []);

  // Function to handle pagination change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
  };

  // Function to handle page size change
  const handlePageSizeChange = (current, size) => {
    setPageSize(size);
  };

  // Filter payments by email
  const filteredPayments = payments
    ? payments.filter((item) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Calculate start and end indexes for pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  function getStatus(val) {
    switch (val) {
      case "pending":
        return "bg-warning";

      case "processing":
        return "bg-light";

      case "partial":
        return "bg-info";

      case "refunded":
        return "bg-primary";

      case "success":
        return "bg-success";

      case "failed":
        return "bg-danger";

      case "cancelled":
        return "bg-secondary";

      default:
        return "bg-warning";
    }
  }

  return (
    <AdminLayout>
      <div className="page-title">
        <h3 className="m-0">Payments</h3>
        <h6>Total Payments - {payments?.length}</h6>
      </div>
      <hr />
      <div className="admin-queries">
        <div className="tools">
          <input
            type="search"
            name="search"
            placeholder="Search by email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <table className="table query-table table-dark">
          <thead>
            <tr>
              <th>Order Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          {loading ? (
            <div className="loader-container text-center">
              <span class="loader"></span>
            </div>
          ) : (
            <tbody>
              {filteredPayments
                .slice(startIndex, endIndex)
                .map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.orderId}</td>
                      <td>{item?.name}</td>
                      <td>{item?.email}</td>
                      <td>{item?.amount}</td>
                      <td>
                        {new Date(item?.createdAt).toLocaleString("default", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                        })}
                      </td>
                      <span className={`${getStatus(item?.status)} statusspan`}>
                        <small>{item?.status}</small>
                      </span>
                    </tr>
                  );
                })}
            </tbody>
          )}
        </table>
        <div className="adminpagiation">
          <Pagination
            className="my-3"
            current={currentPage}
            total={filteredPayments.length}
            pageSize={pageSize}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
