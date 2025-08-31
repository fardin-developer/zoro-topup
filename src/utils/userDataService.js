import axios from "axios";
import { useDispatch } from "react-redux";

const getUserData = async (dispatch, setUser, setBalance) => {
  try {
    const res = await axios.get(
      "https://api.zorotopup.com/api/v1/user/me",
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (res.data && res.status === 200) {
      const userData = res.data;
      
      // Set the balance directly from the response
      if (setBalance) {
        setBalance(userData.walletBalance || 0);
      }
      
      // Set user data
      if (setUser === null) {
        dispatch(setUser(null));
      } else {
        // Create user object with the available fields
        const userObject = {
          _id: userData._id,
          name: userData.name,
          fname: userData.name, // Map name to fname for backward compatibility
          email: userData.email,
          apiKey: userData.apiKey,
          walletBalance: userData.walletBalance,
        };
        
        dispatch(setUser(userObject));
      }
    } else {
      // If response is not successful, remove token
      localStorage.removeItem("token");
      if (setUser) {
        dispatch(setUser(null));
      }
      if (setBalance) {
        setBalance(0);
      }
    }
  } catch (error) {
    console.log("Error fetching user data:", error);
    
    // Handle different error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - remove token
      localStorage.removeItem("token");
      if (setUser) {
        dispatch(setUser(null));
      }
      if (setBalance) {
        setBalance(0);
      }
    } else {
      // Other errors - log but don't clear token
      console.error("Network or server error:", error.message);
    }
  }
};

export default getUserData;