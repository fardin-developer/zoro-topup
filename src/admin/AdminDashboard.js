import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import AdminLayout from "./components/AdminLayout";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import StayCurrentPortraitIcon from "@mui/icons-material/StayCurrentPortrait";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HelpIcon from "@mui/icons-material/Help";
import axios from "axios";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState(null);
  const [queries, setQueries] = useState(null);
  const [total, setTotal] = useState(0);
  const [topUsers, setTopUsers] = useState(null);
  const [toggle, setToggle] = useState(true);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalSales, setTotalSales] = useState(null);
  const [totaluserbalance, setTotaluserbalance] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [fromDate, setFromDate] = useState(getTodayDate());
  const [toDate, setToDate] = useState(getTodayDate());

  const [monthlyOrdersData, setMonthlyOrdersData] = useState({
    labels: [],
    data: [],
  });
  const [monthlySalesData, setMonthlySalesData] = useState({
    labels: [],
    data: [],
  });

  // Balance
  const [smileBalance, setSmilebalance] = useState("");
  const [yokcashBalance, setYokcashBalance] = useState("");

  async function handleMaintenance() {
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/admin/update-website",
        { email: "admin@gmail.com" },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        setToggle(true);
        setLoading(false);
        getWebsite();
      } else {
        setLoading(false);
        setToggle(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setToggle(false);
    }
  }

  async function getWebsite() {
    try {
      const res = await axios.get("/api/admin/get-website");
      if (res.data.success) {
        setToggle(res.data.data.website);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getDashboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/get-dashboard", {
        params: { fromDate, toDate },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setData(res.data.data);
        setOrders(res.data.orders);
        setProducts(res.data.products);
        setQueries(res.data.queries);
        setTotal(res.data.total);
        setTopUsers(res.data.topUsers);
        setTotalOrders(res.data.totalOrders);
        setTotalSales(res.data.totalSales);
        setTotaluserbalance(res.data.totalUserBalance);
        setTotalProfit(res.data.setTotalProfit);

        const { monthlyOrders, monthlySales } = res.data;

        setMonthlyOrdersData({
          labels: monthlyOrders.labels,
          data: monthlyOrders.data,
        });

        setMonthlySalesData({
          labels: monthlySales.salesLabels,
          data: monthlySales.salesData,
        });

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleSearch = () => {
    if (!fromDate || !toDate) {
      message.error("Please select both from and to dates");
      return;
    }
    getDashboard();
  };

  const getSmilebalance = async () => {
    try {
      const res = await axios.get("/api/admin/smile-balance", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setSmilebalance(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getYokcashBalance = async () => {
    try {
      const res = await axios.get("/api/admin/yokcash-balance", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setYokcashBalance(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboard();
    getWebsite();
    getSmilebalance();
    getYokcashBalance();
  }, []);

  return (
    <AdminLayout>
      <div className="page-title">
        <h3 className="m-0">Admin Dashboard</h3>
        <div className={`toggle-icon`} onClick={handleMaintenance}>
          <div className={`circle ${toggle && "active"}`}>
            {loading && (
              <div class="spinner-grow spinner-grow-sm" role="status">
                <span class="sr-only"></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <hr />

      <div className="tools mt-4">
        <input
          onChange={(e) => setFromDate(e.target.value)}
          className="form-control"
          type="date"
          name="fromDate"
        />
        <input
          onChange={(e) => setToDate(e.target.value)}
          className="form-control"
          type="date"
          name="fromDate"
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        {loading ? (
          <div class="spinner-grow spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* DASHBAORD  */}
      {/* DASHBAORD  */}
      {/* DASHBAORD  */}
      <div className="admin-dashboard-container p-0">
        {/* TOTL ORDER  */}
        {/* TOTL ORDER  */}
        {/* TOTL ORDER  */}
        <div className="dash-card" onClick={() => navigate("/admin-orders")}>
          <div className="count">
            <p className="text-center w-100">Total Orders</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>{totalOrders || 0}</b>
              )}
            </h1>
          </div>
        </div>

        {/* SMILE  */}
        {/* SMILE  */}
        {/* SMILE  */}
        <div className="dash-card">
          <div className="count">
            <p className="text-center w-100">Smile Coin</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>{smileBalance || 0}</b>
              )}
            </h1>
          </div>
        </div>

        {/* Yokcash  */}
        {/* Yokcash  */}
        {/* Yokcash  */}
        <div className="dash-card">
          <div className="count">
            <p className="text-center w-100">Yokcash</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>{yokcashBalance || 0}</b>
              )}
            </h1>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/admin-queries")}>
          <div className="count">
            <p className="text-center w-100">Queries</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>
                  {queries?.filter((item) => {
                    return item.status === "pending";
                  }).length || 0}
                </b>
              )}
            </h1>
          </div>
        </div>

        {/* total user balance  */}
        {/* total user balance  */}
        {/* total user balance  */}

        <div className="dash-card" onClick={() => navigate("/admin-queries")}>
          <div className="count">
            <p className="text-center w-100">Total User Balance</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>{totaluserbalance || 0}</b>
              )}
            </h1>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/admin-products")}>
          <div className="count">
            <p className="text-center w-100">Total Products</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>{products?.length || 0}</b>
              )}
            </h1>
          </div>
        </div>

        <div className="dash-card" onClick={() => navigate("/admin-payments")}>
          <div className="count">
            <p className="text-center w-100">Total Sales</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>₹{totalSales || 0}</b>
              )}
            </h1>
          </div>
        </div>

        {/* total profit */}
        {/* total profit */}
        {/* total profit */}
        <div className="dash-card" onClick={() => navigate("/admin-payments")}>
          <div className="count">
            <p className="text-center w-100">Total Profit</p>
            <h1 className="m-0">
              {loading ? (
                <div class="spinner-border spinner-border-sm" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ) : (
                <b>₹{totalProfit || 0}</b>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* RECENT */}
      {/* RECENT */}
      {/* RECENT */}
      <div className="admin-quick-things"></div>
    </AdminLayout>
  );
};

export default AdminDashboard;
