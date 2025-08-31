import { useEffect, useState } from "react";
import AdminLayout from "./components/AdminLayout";
import { message } from "antd";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./AdminViewOrder.css";

const AdminViewOrder = () => {
  const params = useParams();
  const [singleOrder, setSingleOrder] = useState(null);
  const [status, setStatus] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "/api/admin/update-order",
        {
          status,
          orderId: singleOrder?.orderId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getOrderById();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOrderById = async () => {
    try {
      const res = await axios.post(
        "/api/order/get-order-by-id",
        {
          orderId: params?.orderId,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setSingleOrder(res.data.data);
        setStatus(res.data.data.status);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrderById();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Order Details</h3>
        </div>
        <hr />
        <div className="admin-view-order-container">
          <table className="table table-dark">
            <thead>
              <tr>
                <th>Product</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ID</td>
                <td>{singleOrder?.orderId}</td>
              </tr>
              {singleOrder?.couponDiscount && (
                <tr>
                  <td>Coupon Discount</td>
                  <td>Rs. {singleOrder?.couponDiscount}</td>
                </tr>
              )}
              <tr>
                <td>Price</td>
                <td>Rs. {singleOrder?.price}</td>
              </tr>

              <tr>
                <td>Product Name </td>
                <td>{singleOrder?.p_info}</td>
              </tr>

              <tr>
                <td>Order Details </td>
                <td>{singleOrder?.amount}</td>
              </tr>

              <tr>
                <td>PlayerId/User ID</td>
                <td>{singleOrder?.playerId || singleOrder?.userId}</td>
              </tr>
              {singleOrder?.zoneId !== "" && singleOrder?.zoneId !== null && (
                <tr>
                  <td>Zone ID</td>
                  <td>{singleOrder?.zoneId}</td>
                </tr>
              )}
              <tr>
                <td>Date</td>
                <td>
                  {singleOrder?.createdAt
                    ? new Date(singleOrder.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )
                    : ""}
                </td>
              </tr>
              <tr>
                <td>Payment Mode</td>
                <td>{singleOrder?.mode === "cashpe" ? "UPI" : "WALLET"}</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>{singleOrder?.status}</td>
              </tr>
            </tbody>
          </table>
          <div className="tools">
            <select
              onChange={(e) => setStatus(e.target.value)}
              value={status}
              name="status"
              className="form-select"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="success">Successful</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
            <button onClick={handleUpdate}>Update</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminViewOrder;
