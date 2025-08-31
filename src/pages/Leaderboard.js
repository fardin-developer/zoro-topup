import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import IMAGES from "../img/image";
import "./Leaderboard.css";

const Leaderboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sideMenu, setSideMenu] = useState(false);
  const [data, setData] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [tab, setTab] = useState(0);
  const [list, setList] = useState([]);
  const [rewardList, setRewardList] = useState(null);
  const [reward, setReward] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [user, setUser] = useState(null);
  const [position, setPosition] = useState(null);
  //
  const [loading, setLoading] = useState(true);

  const getCurrentDateRange = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    const startDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-01`;
    const endDate = `${currentYear}-${String(currentMonth).padStart(
      2,
      "0"
    )}-${new Date(currentYear, currentMonth, 0).getDate()}`;

    return { startDate, endDate };
  };

  const getNextMonthStartDate = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const nextMonth = today.getMonth() + 1; // Next month
    const nextMonthStart = new Date(currentYear, nextMonth, 1);
    // Set the time to midnight (start of the month)
    nextMonthStart.setHours(0, 0, 0, 0);
    return nextMonthStart;
  };

  const calculateCountdown = () => {
    const nextMonthStart = getNextMonthStartDate();
    const now = new Date();
    const timeDiff = nextMonthStart - now;
    // Calculate the remaining days, hours, minutes, and seconds
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const getLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/leaderboard/leaderboard`);
      if (res.data.success) {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
        const emails = res.data.data;
        const updatedEmails = emails.map((item) => {
          if (item?.fname?.includes("@gmail.com")) {
            return {
              ...item,
              fname: item.fname.replace("@gmail.com", ""),
            };
          }
          return item;
        });
        setData(updatedEmails);
      } else {
        setLoading(false);
        console.log(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const getLeaderboardRewardList = async () => {
    try {
      const res = await axios.get(`/api/leaderboard/get-leaderboard-rewards`);
      if (res.data.success) {
        setList(res.data.data[res.data.data.length - 1]);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  async function getRewardList() {
    try {
      const res = await axios.get("/api/leaderboard/get-rewards", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setRewardList(res.data.data);
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleCheckReward(index) {
    if (!rewardList) {
      return message.error("Reward is not set by Admin");
    }
    const position = rewardList.filter(
      (item) => item?.position == index + 1
    )[0];
    // If no position is found, set the last item in the list
    const rewardToSet = position ? position : rewardList[rewardList.length - 1];
    setReward(rewardToSet);
    setShowReward(!showReward);
  }

  useEffect(() => {
    getRewardList();
  }, []);

  useEffect(() => {
    getLeaderboard(); // Fetch leaderboard data for the current month
    const countdownInterval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(countdownInterval); // Clear the interval on component unmount
  }, []);

  useEffect(() => {
    getLeaderboardRewardList();
  }, []);

  return (
    <Layout>
      {/* DESKTOP  */}
      {/* DESKTOP  */}
      {/* DESKTOP  */}
      {showReward && (
        <div className="showreward" onClick={() => setShowReward(!showReward)}>
          <div className="user-reward">
            <h5>{user?.fname}</h5>
            <h6>Total Spent: ₹{user?.totalSpent}</h6>
            <h6>Position: {position}</h6>
            <h6>Reward: ₹{reward?.reward}</h6>
            <p>
              <b>Note:</b> The reward will be given after the specified time
              ends, and the reward's position and price may change before the
              time runs out.
            </p>
          </div>
        </div>
      )}
      <div className="leaderboard-container">
        <div className="leadboard">
          <h4>Top Customers Leaderboard</h4>
          {/* <h4 className="heading">Challenge ends in: {countdown}</h4> */}
          <div className="leaderboardbuttons">
            <button
              onClick={() => setTab(0)}
              className={`${tab === 0 && "active"}`}
            >
              Active Month
            </button>
            <button
              onClick={() => setTab(1)}
              className={`${tab === 1 && "active"}`}
            >
              Past Month
            </button>
          </div>
          {data && data?.length === 0 ? (
            <div className="norecord">
              <h5 className="m-0">NO RECORD</h5>
            </div>
          ) : tab === 0 ? (
            <div className="leaderboard-list">
              <table className="table table-dark">
                <thead className="custom-thead">
                  <tr>
                    <th>Rank</th>
                    <th>Customer Name</th>
                    <th>Total Spent</th>
                    <th>Orders Placed</th>
                  </tr>
                </thead>
                <tbody className="custom-body">
                  {data?.map((item, index) => {
                    return (
                      <tr
                        onClick={() => {
                          handleCheckReward(index);
                          setUser(item);
                          setPosition(index + 1);
                        }}
                      >
                        <td>{index + 1}</td>
                        <td>{item?.fname}</td>
                        <td>₹{item?.totalSpent}</td>
                        <td>{item?.totalOrders}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="leaderboard-rewards">
              {list?.winners?.length === 0 ? (
                <div className="norecord">
                  <h5 className="m-0">NO RECORD</h5>
                </div>
              ) : (
                list?.winners?.map((item, index) => {
                  return (
                    <div className="winners">
                      <div className="index-and-username">
                        <span className="index me-2">{index + 1}</span>
                        <span>{item.fname}</span>
                      </div>
                      <span className="d-flex align-items-center">
                        <small>₹{item?.prize}</small>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Leaderboard;
