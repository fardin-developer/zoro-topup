import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import FollowUs from "../Home/FollowUs.js";
import "./Layout.css";

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
      // eslint-disable-next-line
    }, [pathname]);

    return null;
  };
  ScrollToTop();
  return (
    <React.Fragment>
      <Header />
      <div className="body">{children}</div>
      <FollowUs />
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
