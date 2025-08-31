import React, { useEffect, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message, Pagination } from "antd";
import SearchIcon from "@mui/icons-material/Search";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AdminUsers.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [allUser, setAllUser] = useState(null);
  const [originalUserData, setOriginalUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  function handleClearFilter() {
    setSearchEmail("");
    setSelectedType("");
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    getAllOrders();
  }

  const getAllOrders = async (dateParam) => {
    try {
      setLoading(true);

      const dateToUse =
        dateParam || selectedDate || new Date().toISOString().split("T")[0];
      const isoDate = new Date(dateToUse).toISOString().split("T")[0];

      const res = await axios.get(
        `/api/admin/admin-get-all-orders?date=${isoDate}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      if (res.data.success) {
        setAllUser(res.data.data);
        setOriginalUserData(res.data.data);
        setTotalCount(res.data.data.length);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    getAllOrders(today);
  }, []);

  const handleSearch = () => {
    if (originalUserData) {
      const filteredUsers = originalUserData.filter((order) => {
        const emailMatch =
          order.customer_email &&
          order.customer_email
            .toLowerCase()
            .includes(searchEmail.toLowerCase());

        const typeMatch =
          selectedType === ""
            ? true
            : order.api &&
              order.api === (selectedType === "yes" ? "yes" : "no");

        const dateMatch =
          order.createdAt &&
          (!selectedDate ||
            new Date(order.createdAt).toISOString().split("T")[0] ===
              new Date(selectedDate).toISOString().split("T")[0]);

        return emailMatch && typeMatch && dateMatch;
      });
      setAllUser(filteredUsers);
      setTotalCount(filteredUsers.length); // Update total count for pagination
    }
  };

  useEffect(() => {
    getAllOrders();
  }, [selectedDate]);

  useEffect(() => {
    handleSearch();
  }, [searchEmail, selectedType, selectedDate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (current, size) => {
    setCurrentPage(1); // Reset to first page when changing page size
    setPageSize(size);
  };

  const displayedUsers = allUser?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Orders</h3>
          <h6>Total Orders - {totalCount}</h6>
        </div>
        <hr />
        <div className="table-container">
          <div className="tools">
            <input
              type="search"
              name="email"
              placeholder="Search by Email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <select
              name="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select</option>
              <option value="yes">Api Orders</option>
              <option value="no">Manual Orders</option>
            </select>
            <input
              type="date"
              name="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <button
              className="bg-danger px-3"
              onClick={() => handleClearFilter()}
            >
              Clear Filter
            </button>
          </div>
          {loading ? (
            <div class="loadingcontainer">
              <div className="loadingtext">Loading..</div>
            </div>
          ) : (
            <>
              <table className="table user-table table-dark">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Order Type</th>
                    <th>Email</th>
                    <th>Product</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers &&
                    displayedUsers.map((user, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            <small>{user?.orderId}</small>
                          </td>
                          <td>
                            <small>
                              {user?.api === "no"
                                ? "Manual Order"
                                : "Api Orders"}
                            </small>
                          </td>
                          <td>
                            <small>{user?.customer_email}</small>
                          </td>
                          <td>
                            <small>{user?.p_info}</small>
                          </td>
                          <td>
                            <small>{user?.price}</small>
                          </td>
                          <td>
                            <span
                              className={`${getStatus(
                                user?.status
                              )} statusspan`}
                            >
                              <small>{user?.status}</small>
                            </span>
                          </td>
                          <td>
                            <small>
                              {new Date(user?.createdAt).toLocaleString(
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
                          <td align="center">
                            <small>
                              <RemoveRedEyeIcon
                                onClick={() =>
                                  navigate(`/admin-view-order/${user?.orderId}`)
                                }
                              />
                            </small>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              <div className="adminpagiation">
                <Pagination
                  className="my-3"
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalCount}
                  onChange={handlePageChange}
                  showSizeChanger
                  onShowSizeChange={handlePageSizeChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
