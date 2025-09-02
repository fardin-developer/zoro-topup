import axios from "axios";
import CryptoJS from "crypto-js";
import { useDispatch } from "react-redux";

const getUserData = async (dispatch, setUser, setbalance) => {
  try {
    const res = await axios.get(
      "https://api.zorotopup.com/api/v1/user/me",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    // The new API returns user data directly
    const userData = res.data;
    
    // Note: The new API structure might not include encrypted balance data
    // You may need to adjust this based on what the new API actually returns
    if (userData) {
      dispatch(setUser(userData));
      // If balance is still encrypted, you'll need to handle it accordingly
      // For now, setting balance to walletBalance if available
      if (userData.walletBalance !== undefined) {
        setbalance(userData.walletBalance);
      }
    } else {
      localStorage.removeItem("token");
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem("token");
  }
};

export default getUserData;
