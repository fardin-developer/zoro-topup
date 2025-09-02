import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import GroupAddOutlinedIcon from "@mui/icons-material/GroupAddOutlined";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import axios from "axios";
import website from "../website/data";
import "./ReferAndEarn.css";

const ReferAndEarn = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState(null);
  const [loader, setLoader] = useState(false);
  const [invitedUsers, setInvitedUsers] = useState([]);

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
        // The new API returns user data directly
        if (res.data) {
          setForm(res.data);
          dispatch(setUser(res.data));
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  async function handleGenerateInviteCode() {
    try {
      const res = await axios.post(
        "/api/user/generatecode",
        {
          email: form?.email,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getUserData();
      } else {
        message.error(res.data.messagex);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getInvitedUsers() {
    try {
      const res = await axios.get("/api/refer/getinvitedusers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setInvitedUsers(res.data.data);
      } else {
        message.error(res.data.messagex);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    getInvitedUsers();
  }, [tab === 1]);

  function copy(value) {
    if (value) {
      navigator.clipboard
        .writeText(value)
        .then(() => {
          message.success("Invite code copied");
        })
        .catch((err) => {
          console.error("Failed to copy:", err);
        });
    }
  }

  return (
    <Layout>
      <div className="refernearncontainer">
        {tab === 0 && (
          <div className="addmoneyform">
            <h4>Refer & Earn</h4>
            <div className="section">
              <label>Your Referral Code</label>
              <div className="refercode">
                <h2>{user && user?.inviteCode}</h2>
                <button onClick={() => copy(user?.inviteCode)}>Copy</button>
              </div>
            </div>
            <div className="section">
              <label>Your Invite Link</label>
              <div className="refercode">
                <input
                  type="text"
                  value={`${website.link}/register/${user?.inviteCode}`}
                />
                <button
                  onClick={() =>
                    copy(`${website.link}/register/${user?.inviteCode}`)
                  }
                >
                  Copy
                </button>
              </div>
            </div>
            {!form?.inviteCode && (
              <button
                className="invitecodebtn m-0"
                onClick={handleGenerateInviteCode}
              >
                Generate Invite Code
                {loader ? (
                  <div class="spinner-grow spinner-grow-sm ms-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <GroupAddOutlinedIcon className="icon ms-2" />
                )}
              </button>
            )}
          </div>
        )}
        {tab === 0 && (
          <div className="checkhistory" onClick={() => setTab(1)}>
            <span>Check Invited Users</span>
            <DoubleArrowIcon className="icon" />
          </div>
        )}
        {tab === 1 && (
          <div className="inviteduser addmoneyform">
            <table className="table table-dark">
              <thead className="custom-thead">
                <tr>
                  <th>
                    <small>#</small>
                  </th>
                  <th>
                    <small>Username</small>
                  </th>
                  <th>
                    <small>Date</small>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invitedUsers && invitedUsers?.length === 0 ? (
                  <tr>
                    <td align="center" colSpan={9}>
                      No record found
                    </td>
                  </tr>
                ) : (
                  invitedUsers?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <small>{index + 1}</small>
                        </td>
                        <td>
                          <small>{item.fname}</small>
                        </td>
                        <td>
                          <small>
                            {new Date(item?.createdAt).toLocaleString(
                              "default",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </small>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <button onClick={() => setTab(0)}>Back</button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReferAndEarn;
