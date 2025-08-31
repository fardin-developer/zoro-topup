import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import SideMenu from "./SideMenu";
import Backdrop from "./Backdrop";
import MenuIcon from "@mui/icons-material/Menu";
import getUserData from "../../utils/userDataService.js";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LoginIcon from "@mui/icons-material/Login";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import IMAGES from "../../img/image.js";
import website from "../../website/data.js";
import "./Header.css";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sideMenu, setSideMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [balance, setBalance] = useState("");
  const [black, setBlack] = useState("");
  const [profilemenu, setProfilemenu] = useState("");

  useEffect(() => {
    getUserData(dispatch, setUser, setBalance);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 40) {
        setBlack(true);
      } else {
        setBlack(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header className="header d-none d-lg-flex">
        <div className="header-main">
          <div
            className="burger-icon d-block d-lg-none"
            onClick={() => setSideMenu(!sideMenu)}
          >
            <MenuIcon className="icon" />
          </div>
          <SideMenu sideMenu={sideMenu} setSideMenu={setSideMenu} />
          <Backdrop sideMenu={sideMenu} setSideMenu={setSideMenu} />
          <div className="logo" onClick={() => navigate("/")}>
            <img src={IMAGES.logo} alt="" />
            <span>Zoro's Domain</span>
          </div>
          <div className="menus d-none d-md-none d-lg-block">
            <ul className="p-0">
              <li>
                <Link to="/">Home</Link>
              </li>
              {user && (
                <li>
                  <Link to="/user-dashboard">Dashboard</Link>
                </li>
              )}
              <li>
                <Link to="/query">Query</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              {!user && (
                <li>
                  <Link to="/login">Login</Link>
                </li>
              )}
              {user && (
                <li>
                  <Link to="/referandearn">Refer & Earn</Link>
                </li>
              )}
              <li>
                <Link to="/support">Support</Link>
              </li>
            </ul>
          </div>
          <div className="action-btns">
            {user && (
              <div onClick={() => navigate("/wallet")} className="wallet-cont">
                <span className="me-2">
                  <img width="25px" src={IMAGES.ycoin} alt="" />
                </span>
                <span>{balance}</span>
              </div>
            )}

            <div className="logouticon">
              {user?.userimg ? (
                <img
                  src={`${website.link}/${user?.userimg}`}
                  alt="userimg"
                  onClick={() => setProfilemenu(!profilemenu)}
                />
              ) : (
                <AccountCircleIcon
                  onClick={() => navigate("/my-account")}
                  className="icon"
                />
              )}
              {profilemenu && (
                <div className="profiletabs">
                  <div
                    className="items"
                    onClick={() => navigate("/user-dashboard")}
                  >
                    <DashboardIcon className="icon" />
                    Dashboard
                  </div>
                  <div
                    className="items"
                    onClick={() => navigate("/my-account")}
                  >
                    <SettingsOutlinedIcon className="icon" />
                    Settings
                  </div>
                  <div
                    className="items"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                      dispatch(setUser(null));
                    }}
                  >
                    <LogoutIcon className="icon" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className={`mobile-header ${black && "active"} d-flex d-lg-none`}>
        <div className="user-name" onClick={() => navigate("/")}>
          <img src={IMAGES.logo} alt="" />
        </div>
        <div className="headericon">
          {user ? (
            <div className="sideheader">
              <div className="wallet" onClick={() => navigate("/wallet")}>
                <img width="25px" src={IMAGES.ycoin} alt="" />
                {balance}
              </div>
              <div className="logouticon">
                {user?.userimg ? (
                  <img
                    src={`${website.link}/${user?.userimg}`}
                    alt="userimg"
                    onClick={() => setProfilemenu(!profilemenu)}
                  />
                ) : (
                  <AccountCircleIcon
                    onClick={() => navigate("/my-account")}
                    className="icon"
                  />
                )}
                {profilemenu && (
                  <div className="profiletabs">
                    <div
                      className="items"
                      onClick={() => navigate("/user-dashboard")}
                    >
                      <DashboardIcon className="icon" />
                      Dashboard
                    </div>
                    <div
                      className="items"
                      onClick={() => navigate("/my-account")}
                    >
                      <SettingsOutlinedIcon className="icon" />
                      Settings
                    </div>
                    <div
                      className="items"
                      onClick={() => {
                        localStorage.removeItem("token");
                        dispatch(setUser(null));
                      }}
                    >
                      <LogoutIcon className="icon" />
                      Logout
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <LoginIcon onClick={() => navigate("/login")} className="icon" />
          )}
        </div>
      </div>
      {/* <SearchContainer search={search} setSearch={setSearch} /> */}
    </>
  );
};

export default Header;
