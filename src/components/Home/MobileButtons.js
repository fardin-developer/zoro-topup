import React from "react";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import WalletIcon from "@mui/icons-material/Wallet";
import HistoryIcon from "@mui/icons-material/History";
import HelpIcon from "@mui/icons-material/Help";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import "./MobileButtons.css";

const MobileButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="mobile-buttons-container">
      <div className="buttons" onClick={() => navigate("/wallet")}>
        <div className="iconcontainer">
          <AddCircleIcon className="icon" />
        </div>
        <span className="orb">Add Money</span>
      </div>
      <div className="buttons" onClick={() => navigate("/payments")}>
        <div className="iconcontainer">
          <WalletIcon className="icon" />
        </div>
        <span className="orb">Purchase</span>
      </div>
      <div className="buttons" onClick={() => navigate("/leaderboard")}>
        <div className="iconcontainer">
          <EmojiEventsIcon className="icon" />
        </div>
        <span className="orb">Leaderboard</span>
      </div>
      <div className="buttons" onClick={() => navigate("/account-store")}>
        <div className="iconcontainer">
          <CurrencyExchangeIcon className="icon" />
        </div>
        <span className="orb">ID Store</span>
      </div>
    </div>
  );
};

export default MobileButtons;
