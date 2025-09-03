import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/features/userSlice";
import { message } from "antd";
import Layout from "../components/Layout/Layout";
import axios from "axios";
import LogoutIcon from "@mui/icons-material/Logout";
import EditIcon from "@mui/icons-material/Edit";
import "./Account.css";

const Account = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUserData] = useState(null);

  // Editable fields
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);

  const getUserData = async () => {
    try {
      const res = await axios.get("https://api.zorotopup.com/api/v1/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data && res.data._id) {
        setUserData(res.data);
        setName(res.data.name);
      } else {
        message.error("Failed to fetch user data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Update profile (name, password)
  const handleUpdateProfile = async () => {
    try {
      const res = await axios.put(
        "https://api.zorotopup.com/api/v1/user/profile",
        { name, currentPassword, newPassword },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data) {
        message.success("Profile updated successfully");
        getUserData();
        setCurrentPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Upload profile picture
// Upload profile picture
const handleProfilePictureUpload = async () => {
  if (!profilePicFile) {
    message.warning("Please select an image");
    return;
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(profilePicFile.type)) {
    message.error("Please select a valid image file (JPEG, PNG, or GIF)");
    return;
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (profilePicFile.size > maxSize) {
    message.error("Image size should be less than 5MB");
    return;
  }

  try {
    const formData = new FormData();
    // Use the field names that work in Postman
    formData.append("image", profilePicFile);
    // OR try imageFile if image doesn't work:
    // formData.append("imageFile", profilePicFile);

    console.log("Uploading file:", profilePicFile.name, profilePicFile.type, profilePicFile.size);

    const res = await axios.post(
      "https://api.zorotopup.com/api/v1/user/profile-picture",
      formData,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          // Don't manually set Content-Type - let browser handle it with boundary
        },
      }
    );

    if (res.data) {
      message.success("Profile picture updated successfully");
      getUserData();
      setProfilePicFile(null);
      // Clear the file input
      document.getElementById('profile-pic-input').value = '';
    }
  } catch (error) {
    console.error("Profile picture upload error:", error);
    
    // Better error handling
    if (error.response) {
      console.log("Error response:", error.response.data);
      console.log("Error status:", error.response.status);
      const errorMessage = error.response.data?.message || error.response.data?.error || "Failed to upload profile picture";
      message.error(errorMessage);
    } else if (error.request) {
      console.log("Network error:", error.request);
      message.error("Network error. Please check your connection and try again.");
    } else {
      console.log("Error:", error.message);
      message.error("Failed to upload profile picture");
    }
  }
};
  return (
    <Layout>
      <div className="user-accout-details" style={{ minHeight: "300px" }}>
        <div className="row accountform">
          <h4>Your Profile</h4>

          {/* Profile Picture */}
          <div className="col-12 p-0 mb-3 text-center">
            <div className="profile-picture-container" style={{ position: "relative", display: "inline-block" }}>
              <img
                src={
                  user?.profilePicture
                    ? user.profilePicture
                    : `https://ui-avatars.com/api/?name=${user?.email}&background=random`
                }
                alt="Profile"
                className="rounded-circle"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <div 
                className="edit-overlay"
                style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  background: "#007bff",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                }}
                onClick={() => document.getElementById('profile-pic-input').click()}
              >
                <EditIcon style={{ color: "white", fontSize: "16px" }} />
              </div>
              <input
                id="profile-pic-input"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePicFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </div>
            {profilePicFile && (
              <div className="mt-2">
                <p className="text-muted small mb-1">Selected: {profilePicFile.name}</p>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={handleProfilePictureUpload}
                >
                  Update Picture
                </button>
              </div>
            )}
          </div>

          {/* Editable Name */}
          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Email (readonly) */}
          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Email</label>
              <input
                type="text"
                className="form-control"
                value={user?.email || ""}
                readOnly
              />
            </div>
          </div>

          {/* Wallet (readonly) */}
          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Wallet Balance</label>
              <input
                type="text"
                className="form-control"
                value={user?.walletBalance !== undefined ? user.walletBalance : ""}
                readOnly
              />
            </div>
          </div>

          {/* Password Change */}
          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="col-12 p-0">
            <div className="form-fields mb-2">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Update Button */}
          <div className="col-12 p-0 mb-3">
            <button className="btn btn-success w-100" onClick={handleUpdateProfile}>
              Update Profile
            </button>
          </div>

          {/* Logout */}
          <div
            className="logout-container"
            onClick={() => {
              localStorage.removeItem("token");
              dispatch(setUser(null));
              navigate("/login");
            }}
          >
            <h5 className="m-0">Logout</h5>
            <LogoutIcon className="icon" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Account;
