import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import AdminLayout from "./components/AdminLayout";
import axios from "axios";
import "./AdminNotification.css";

const AdminReferAndEarn = () => {
  const [form, setForm] = useState({ minamount: "", amount: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form?.minamount === "" || form?.amount === "") {
      return message.error("Some fields are empty");
    }
    try {
      const res = await axios.post("/api/refer/add", form, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        getReferAmount();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getReferAmount() {
    try {
      const res = await axios.get("/api/refer/get", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setForm(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getReferAmount();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users">
        <div className="page-title">
          <h3 className="m-0">Refer & Earn</h3>
        </div>
        <hr />
        <div className="table-container">
          <div className="tools">
            <input
              type="number"
              name="minamount"
              onChange={(e) => setForm({ ...form, minamount: e.target.value })}
              placeholder="Enter Min Wallet Recharge Amount"
              value={form?.minamount}
            />
            <input
              type="number"
              name="amount"
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="Enter amount for credit in wallet"
              value={form?.amount}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>

          <span className="text-danger">
            <ul>
              <li>
                - First Field is the amount which user B will add into his
                wallet
              </li>
              <li>- Second Field amount will get credited in user wallet</li>
            </ul>
          </span>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReferAndEarn;
