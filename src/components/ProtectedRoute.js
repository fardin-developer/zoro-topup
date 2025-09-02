import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../redux/features/userSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  //get user
  const getUser = async () => {
    try {
      const res = await axios.get(
        "https://api.zorotopup.com/api/v1/user/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      // The new API returns user data directly
      const userData = res.data;
      dispatch(setUser(userData));
      
      // Check if user is admin based on role field
      if (userData.role !== 'admin') {
        navigate("/user-dashboard");
      }
    } catch (error) {
      // If there's an error (like invalid token), redirect to login
      navigate("/login");
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    navigate("/login");
  }
}
