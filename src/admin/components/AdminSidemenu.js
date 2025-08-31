import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import CollectionsIcon from "@mui/icons-material/Collections";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptIcon from "@mui/icons-material/Receipt";
import HelpIcon from "@mui/icons-material/Help";
import MobileScreenShareIcon from "@mui/icons-material/MobileScreenShare";
import InventoryIcon from "@mui/icons-material/Inventory";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import DiscountIcon from "@mui/icons-material/Discount";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import SmsIcon from "@mui/icons-material/Sms";
import { Link, useNavigate } from "react-router-dom";

const AdminSidemenu = ({ menu, setMenu }) => {
  const navigate = useNavigate();
  return (
    <div className={`admin-sidemenu-container ${menu && "active"}`}>
      <div className="w-100 d-flex justify-content-end p-3">
        <CancelIcon
          onClick={() => setMenu(!menu)}
          className="text-dark cancel-icon"
        />
      </div>
      <ul>
        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-dashboard");
          }}
        >
          <HomeIcon className="me-2" />
          Dashboard
        </li>
        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-orders");
          }}
        >
          <ReceiptIcon className="me-2" />
          Orders
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-pack-category");
          }}
        >
          <CategoryOutlinedIcon className="me-2" />
          Pack Category
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-products");
          }}
        >
          <InventoryIcon className="me-2" />
          Products
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-users");
          }}
        >
          <GroupIcon className="me-2" />
          Customers
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-payments");
          }}
        >
          <MobileScreenShareIcon className="me-2" />
          Payment
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-queries");
          }}
        >
          <HelpIcon className="me-2" />
          Queries
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-gallery");
          }}
        >
          <CollectionsIcon className="me-2" />
          Gallery
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-reward");
          }}
        >
          <EmojiEventsIcon className="me-2" />
          Add Reward
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-rewards");
          }}
        >
          <EmojiEventsIcon className="me-2" />
          Winner List
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-banners");
          }}
        >
          <ViewCarouselIcon className="me-2" />
          Banners
        </li>

        {/* <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-notification");
          }}
        >
          <NotificationsActiveIcon className="me-2" />
          Notification
        </li> */}

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-event");
          }}
        >
          <HourglassBottomIcon className="me-2 icon" />
          Event
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-refer");
          }}
        >
          <GroupAddIcon className="me-2 icon" />
          Refer & Earn
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-add-coupon");
          }}
        >
          <DiscountIcon className="me-2" />
          Coupon
        </li>

        <li
          onClick={() => {
            setMenu(!menu);
            navigate("/admin-whatsapp-plan");
          }}
        >
          <SmsIcon className="me-2" />
          Whatsapp Otp
        </li>
      </ul>
    </div>
  );
};

export default AdminSidemenu;
