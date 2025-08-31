import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const getAllUserOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/order/get-user-orders",
        { email: user?.email },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setOrders(res.data.data.reverse());
        setData(res.data.data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (user !== null) {
      getAllUserOrders();
    }
  }, [user]);

  useEffect(() => {
    const filteredOrders = data?.filter((item) => {
      const itemDate = new Date(item.createdAt);
      const selected = new Date(selectedDate);
      return (
        itemDate.getDate() === selected.getDate() &&
        itemDate.getMonth() === selected.getMonth() &&
        itemDate.getFullYear() === selected.getFullYear()
      );
    });
    setOrders(filteredOrders);
  }, [selectedDate]);

  function getStatus(status) {
    switch (status) {
      case "pending":
        return "text-warning";
      case "processing":
        return "text-primary";
      case "failed":
        return "text-danger";
      case "success":
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
      <div className="user-order-container">
        <div className="wallethistories">
          <h4>Your Orders</h4>
          <div className="tools mb-3">
            <div className="form-fields">
              <input
                type="date"
                className="py-2 form-control"
                placeholder="Search Order ID"
                name="addition"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="form-fields">
              <button
                className="btn btn-danger"
                onClick={() => {
                  setOrders(data);
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
                    <small>Product</small>
                  </th>
                  <th>
                    <small>Order Details</small>
                  </th>
                  <th>
                    <small>Price</small>
                  </th>
                  <th>
                    <small>User Id</small>
                  </th>
                  <th>
                    <small>Date</small>
                  </th>
                  <th>
                    <small>Status</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders && orders.length === 0 ? (
                  <tr>
                    <td align="center" colSpan={10}>
                      No order found
                    </td>
                  </tr>
                ) : (
                  orders?.map((item, index) => {
                    return (
                      <tr>
                        <td>
                          <small>{item.orderId}</small>
                        </td>
                        <td>
                          <small>{item.p_info}</small>
                        </td>
                        <td>
                          <small>{item.amount}</small>
                        </td>
                        <td>
                          <small>{parseFloat(item.price).toFixed(2)}</small>
                        </td>
                        <td>
                          <small>{item.userId}</small>
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
                          <small>{item?.status}</small>
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
            {orders && orders?.length === 0 ? (
              <div className="whistory m-0">No order found</div>
            ) : (
              orders?.map((item, index) => {
                return (
                  <div className="whistory">
                    <div className="items">
                      <span className="fw-bold">Date</span>
                      <span className="fw-bold text-success">
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
                        <span>Product</span>
                      </div>
                      <div className="item-details">
                        <span>{item?.p_info}</span>
                      </div>
                    </div>

                    <div className="items">
                      <div className="item-name">
                        <span>Order Details</span>
                      </div>
                      <div className="item-details">
                        <span>{item?.amount}</span>
                      </div>
                    </div>
                    <div className="items">
                      <div className="item-name">
                        <span>Price</span>
                      </div>
                      <div className="item-details">
                        <span>₹{item?.price}</span>
                      </div>
                    </div>
                    <div className="items">
                      <div className="item-name">
                        <span>User Id</span>
                      </div>
                      <div className="item-details">
                        <span>{item?.userId}</span>
                      </div>
                    </div>
                    {item?.zoneId && (
                      <div className="items">
                        <div className="item-name">
                          <span>Zone Id</span>
                        </div>
                        <div className="item-details">
                          <span>{item?.zoneId}</span>
                        </div>
                      </div>
                    )}
                    <div className="items">
                      <div className="item-name">
                        <span>Status</span>
                      </div>
                      <div className="item-details">
                        <span className={getStatus(item?.status)}>
                          {item?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <button onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
