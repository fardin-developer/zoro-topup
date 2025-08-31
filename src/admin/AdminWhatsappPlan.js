import { useEffect, useState } from "react";
import { message } from "antd";
import AdminLayout from "./components/AdminLayout";
import axios from "axios";
import "./AdminWhatsappPlan.css";

const AdminWhatsappPlan = () => {
  const [tab, setTab] = useState(0);
  const [amount, setAmount] = useState(null);
  const [data, setData] = useState([]);
  const [credithistory, setCredithistory] = useState([]);

  const generateOrderId = () => {
    const numbers = "01234567"; // 8 numbers
    const randomNumbers = Array.from({ length: 7 }, () =>
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    );
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed
    const year = String(now.getFullYear()).slice(2); // last two digits of the year
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const orderId = `${year}${month}${day}${seconds}${randomNumbers.join("")}`;
    return orderId;
  };

  async function addCredits() {
    try {
      const res = await axios.post(
        "/api/whatsapp/add",
        { amount: amount, orderId: generateOrderId() },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        window.location.href = res.data.data.result.payment_url;
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getCredits() {
    try {
      const res = await axios.get("/api/whatsapp/get", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setData(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getcredithistory() {
    try {
      const res = await axios.get("/api/whatsapp/credithistory", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setCredithistory(res.data.data.reverse());
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (tab === 0) {
      getCredits();
    }
    if (tab === 1) {
      getcredithistory();
    }
  }, [tab]);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Credits</h3>
          <div className="btns">
            <button onClick={() => setTab(0)}>My Credits</button>
            <button onClick={() => setTab(1)}>Credit Usage Hitory</button>
          </div>
        </div>
      </div>
      <hr />
      <div className="admin-whatsapp-plans">
        {tab === 0 && (
          <>
            <div className="tools">
              <input
                type="text"
                placeholder="Enter credits"
                onChange={(e) => setAmount(e.target.value)}
              />
              <button onClick={addCredits}>Pay & Add Credits</button>
            </div>
            <div
              className={`availablecredits ${data?.credits < 20 && "warning"}`}
            >
              Available Credits: <b>{parseFloat(data?.credits).toFixed(2)}</b>
            </div>
          </>
        )}
        {tab === 1 && (
          <div className="credithistory">
            <table className="table table-dark">
              <thead>
                <tr>
                  <th>Order Id</th>
                  <th>Mobile</th>
                  <th>Charge</th>
                  <th>Balance Before</th>
                  <th>Balance After</th>
                </tr>
              </thead>
              <tbody>
                {credithistory?.map((item, index) => {
                  return (
                    <tr>
                      <td>{item?.orderId}</td>
                      <td>{item?.mobile}</td>
                      <td>{item?.amount}</td>
                      <td>{parseFloat(item?.balanceBefore).toFixed(2)}</td>
                      <td>{parseFloat(item?.balanceAfter).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminWhatsappPlan;
