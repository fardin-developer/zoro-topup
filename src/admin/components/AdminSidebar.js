import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HelpIcon from "@mui/icons-material/Help";
import InventoryIcon from "@mui/icons-material/Inventory";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CollectionsIcon from "@mui/icons-material/Collections";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import DiscountIcon from "@mui/icons-material/Discount";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SmsIcon from "@mui/icons-material/Sms";
import { Link } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar-container">
      <span>
        <small>MAIN</small>
      </span>
      <ul>
        <li>
          <Link to="/admin-dashboard">
            <HomeIcon className="me-2" />
            Dashboard
          </Link>
        </li>
      </ul>
      <span>
        <small>LISTS</small>
      </span>
      <ul>
        <li>
          <Link to="/admin-orders">
            <ReceiptIcon className="me-2" />
            Orders
          </Link>
        </li>
        <li>
          <Link to="/admin-pack-category">
            <CategoryOutlinedIcon className="me-2 icon" />
            Pack Category
          </Link>
        </li>
        <li>
          <Link to="/admin-products">
            <InventoryIcon className="me-2" />
            Products
          </Link>
        </li>
        <li>
          <Link to="/admin-users">
            <GroupIcon className="me-2" />
            Users
          </Link>
        </li>
        <li>
          <Link to="/admin-payments">
            <PaymentIcon className="me-2" />
            Payments
          </Link>
        </li>
        <li>
          <Link to="/admin-queries">
            <HelpIcon className="me-2" />
            Queries
          </Link>
        </li>
        <li>
          <Link to="/admin-gallery">
            <CollectionsIcon className="me-2" />
            Gallery
          </Link>
        </li>

        <li>
          <Link to="/admin-reward">
            <EmojiEventsIcon className="me-2 icon" />
            Add Reward
          </Link>
        </li>

        <li>
          <Link to="/admin-rewards">
            <EmojiEventsIcon className="me-2 icon" />
            Winner List
          </Link>
        </li>

        <li>
          <Link to="/admin-banners">
            <ViewCarouselIcon className="me-2" />
            Banners
          </Link>
        </li>

        {/* <li>
          <Link to="/admin-notification">
            <NotificationsActiveIcon className="me-2" />
            Notification
          </Link>
        </li> */}

        <li>
          <Link to="/admin-event">
            <HourglassBottomIcon className="me-2 icon" />
            Event Timer
          </Link>
        </li>

        <li>
          <Link to="/admin-refer">
            <GroupAddIcon className="me-2 icon" />
            Refer & Earn
          </Link>
        </li>

        <li>
          <Link to="/admin-add-coupon">
            <DiscountIcon className="me-2" />
            Coupons
          </Link>
        </li>

        <li>
          <Link to="/admin-whatsapp-plan">
            <SmsIcon className="me-2" />
            Whatsapp Otp
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
