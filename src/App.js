import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPass from "./pages/ForgotPass";
// import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./user/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUsers from "./admin/AdminUsers";
import EditUser from "./admin/EditUser";
import AdminPayments from "./admin/AdminPayments";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import AdminLogin from "./admin/AdminLogin";
import GamePage from "./pages/GamePage";
import Search from "./pages/Search";
import AdminProduct from "./admin/AdminProduct";
import AdminAddProduct from "./admin/AdminAddProduct";
import AdminEditProduct from "./admin/AdminEditProduct";
import AdminOrder from "./admin/AdminOrder";
import ProductInfo from "./pages/ProductInfo";
import Loader from "./pages/Loader";
import Support from "./pages/Support.js";
import PromoEvents from "./pages/PromoEvents.js";
import SinglePromoEvent from "./pages/SinglePromoEvent.js";
import Leaderboard from "./pages/Leaderboard.js";
import ReferAndEarn from "./pages/ReferAndEarn.js";
import Success from "./pages/Success.js";
import Failure from "./pages/Failure.js";
import Orders from "./user/Orders";
import Address from "./user/Address";
import Account from "./user/Account";
import ViewOrder from "./user/ViewOrder";
import AdminViewOrder from "./admin/AdminViewOrder";
import AdminAddCoupon from "./admin/AdminAddCoupon.js";
import AdminQueries from "./admin/AdminQueries";
import Wallet from "./user/Wallet";
import PaymentHistory from "./admin/PaymentHistory.js";
import Query from "./user/Query";
import Maintenance from "./user/Maintenance";
import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import AdminGallery from "./admin/AdminGallery";
import AdminNotification from "./admin/AdminNotification";
import AdminBanners from "./admin/AdminBanners.js";
import AdminPromoEvents from "./admin/AdminPromoEvents.js";
import AdminMaintenance from "./admin/AdminMaintenance.js";
import AdminAddReward from "./admin/AdminAddReward.js";
import AdminRewards from "./admin/AdminRewards.js";
import AdminEvent from "./admin/AdminEvent.js";
import AdminPackCategory from "./admin/AdminPackCategory.js";
import AdminReferAndEarn from "./admin/AdminReferAndEarn.js";
import AdminSettings from "./admin/AdminSettings.js";
import AdminWhatsappPlan from "./admin/AdminWhatsappPlan.js";

// for google login
// for google login
// for google login
import { gapi } from "gapi-script";
import AccountStore from "./pages/AccountStore.js";
import AccountDetails from "./pages/AccountDetails.js";


function App() {
  const [website, setWebsite] = useState(true);
  const [loading, setLoading] = useState(false);

  const clientId = process.env.REACT_APP_CLIENTID;

  useEffect(() => {
    function start() {
      gapi.client.init({ clientId: clientId, scope: "" });
    }
    gapi.load("client:auth2", start);
  });

  async function getWebsite() {
    try {
      setLoading(true);
      const res = await axios.get("/api/admin/get-website");
      if (res.data.success) {
        setWebsite(res.data.data.website);
        setLoading(false);
      } else {
        message.error(res.data.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getWebsite();
  }, []);

  return (
    <BrowserRouter>
      {loading ? (
        <Loader />
      ) : website ? (
        <Routes>
          {/* pages */}
          <Route path="/:token?" element={<Home />} />
          <Route
            path="/register/:code?"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/search" element={<Search />} />
          <Route path="/support" element={<Contact />} />
          <Route path="/product/:gameId" element={<ProductInfo />} />
          <Route path="/walletsuccess/:orderId?" element={<Success />} />
          <Route path="/success/:orderId?" element={<Success />} />
          <Route path="/failure/:error?" element={<Failure />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/games" element={<GamePage />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/account-store" element={<AccountStore />} />
          <Route path="/account-details/:accountId" element={<AccountDetails />} />
          {/* <Route path="/referandearn" element={<ReferAndEarn />} /> */}
          {/* <Route path="/service" element={<Service />} /> */}
          {/* <Route path="/promo" element={<PromoEvents />} /> */}
          {/* <Route path="/promo/:id?" element={<SinglePromoEvent />} /> */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/query"
            element={
              <ProtectedRoute>
                <Query />
              </ProtectedRoute>
            }
          />
          <Route
            path="/address"
            element={
              <ProtectedRoute>
                <Address />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-order/:orderId?"
            element={
              <ProtectedRoute>
                <ViewOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard/:token?"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <PaymentHistory />
              </ProtectedRoute>
            }
          />
          {/* ======================== USER PAGES =============================== */}
          {/* ======================== ADMIN PAGES =============================== */}
          <Route
            path="/admin-login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-orders"
            element={
              <ProtectedRoute>
                <AdminOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-view-order/:orderId?"
            element={
              <ProtectedRoute>
                <AdminViewOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-products"
            element={
              <ProtectedRoute>
                <AdminProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-product"
            element={
              <ProtectedRoute>
                <AdminAddProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-edit-product/:id?"
            element={
              <ProtectedRoute>
                <AdminEditProduct />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-users"
            element={
              <ProtectedRoute>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-edit-user/:id?"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-payments"
            element={
              <ProtectedRoute>
                <AdminPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-queries"
            element={
              <ProtectedRoute>
                <AdminQueries />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-gallery"
            element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-notification"
            element={
              <ProtectedRoute>
                <AdminNotification />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-banners"
            element={
              <ProtectedRoute>
                <AdminBanners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-promo"
            element={
              <ProtectedRoute>
                <AdminPromoEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-add-coupon"
            element={
              <ProtectedRoute>
                <AdminAddCoupon />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-reward"
            element={
              <ProtectedRoute>
                <AdminAddReward />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-rewards"
            element={
              <ProtectedRoute>
                <AdminRewards />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-event"
            element={
              <ProtectedRoute>
                <AdminEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-pack-category"
            element={
              <ProtectedRoute>
                <AdminPackCategory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-refer"
            element={
              <ProtectedRoute>
                <AdminReferAndEarn />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-settings"
            element={
              <ProtectedRoute>
                <AdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-whatsapp-plan"
            element={
              <ProtectedRoute>
                <AdminWhatsappPlan />
              </ProtectedRoute>
            }
          />
          {/* ======================== ADMIN PAGES =============================== */}
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Maintenance />} />
          <Route path="*" element={<Maintenance />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-login" element={<Login />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
