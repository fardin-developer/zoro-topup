import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // COUNT
  const [users, setUsers] = useState(null);

  const getUserData = async () => {
    axios
      .get(
        "https://api.zorotopup.com/api/v1/user/me",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        // Handle response if needed
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  return <Layout></Layout>;
};

export default Settings;
