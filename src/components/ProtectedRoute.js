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
  const getUser = async (req, res) => {
    try {
      const res = await axios.post(
        "/api/user/getUserData",
        {
          token: localStorage.getItem("token"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        const { isAdmin } = res.data.data.user;
        dispatch(setUser(res.data.data.user));
        if (!isAdmin) {
          navigate("/user-dashboard");
        }
      } else {
        navigate("/login");
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  if (localStorage.getItem("token")) {
    return children;
  } else {
    navigate("/login");
  }
}
