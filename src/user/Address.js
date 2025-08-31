import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import DashboardLayout from "./components/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import { setUser } from "../redux/features/userSlice";

const Address = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [addressSelected, setAddressSelected] = useState(0);
  const [addNewAddress, setAddNewAddress] = useState(false);

  const handleChange = (e) => {
    setLocation({ ...location, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/user/update-user", {
        email: user?.email,
        address: location,
      });
      if (res.data.success) {
        message.success(res.data.message);
        dispatch(setUser(res.data.data));
        setAddNewAddress(!addNewAddress);
        getUserData();
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserData = async () => {
    axios
      .post(
        "/api/user/getUserData",
        {},
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
        } else {
          localStorage.removeItem("token");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (user) {
      setLocation(user?.address[addressSelected]);
      console.log(location);
    }
  }, [addressSelected]);

  return (
    <Layout>
      <DashboardLayout>
        <div className="user-address-container">
          {user && user?.address?.length > 0 && <h5>Your Saved Address</h5>}
          <hr />
          {user &&
            user?.address?.map((add, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setAddressSelected(index)}
                  className={`sv-address ${
                    addressSelected === index && "active"
                  }`}
                >
                  {add.fname} {add.lname}, {add.saddress}, {add.baddress},{" "}
                  {add.mobile}, {add.city}, {add.state}, {add.pincode}
                  <div
                    className={`selected ${addressSelected === index && "ac"}`}
                  >
                    selected
                  </div>
                </div>
              );
            })}
          {user && (
            <button
              onClick={() => setAddNewAddress(!addNewAddress)}
              className="add-to-cart-btn mb-3"
            >
              Add New Address
            </button>
          )}
          {addNewAddress && (
            <>
              <div className="row">
                <div className="col-6">
                  <div className="form-fields mb-2">
                    <input
                      onChange={handleChange}
                      style={{ padding: "8px" }}
                      className="form-control"
                      type="text"
                      placeholder="First Name"
                      name="fname"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <div className="form-fields mb-2">
                    <input
                      onChange={handleChange}
                      style={{ padding: "8px" }}
                      className="form-control"
                      type="text"
                      placeholder="Last Name"
                      name="lname"
                    />
                  </div>
                </div>
              </div>
              <div className="form-fields mb-2">
                <input
                  onChange={handleChange}
                  style={{ padding: "8px" }}
                  className="form-control"
                  placeholder="Enter email"
                  type="text"
                  name="email"
                />
              </div>
              <div className="form-fields mb-2">
                <input
                  onChange={handleChange}
                  style={{ padding: "8px" }}
                  className="form-control"
                  placeholder="Enter mobile number"
                  name="mobile"
                  type="text"
                />
              </div>
              <h4 className="my-3">Delivery</h4>
              <div className="form-fields mb-2">
                <input
                  onChange={handleChange}
                  style={{ padding: "8px" }}
                  className="form-control"
                  placeholder="street address"
                  name="saddress"
                  type="text"
                />
              </div>
              <div className="form-fields mb-2">
                <input
                  onChange={handleChange}
                  style={{ padding: "8px" }}
                  className="form-control"
                  placeholder="Appartment, suite, unit, etc"
                  name="baddress"
                  type="text"
                />
              </div>
              <div className="row">
                <div className="col-4">
                  <div className="form-fields mb-2">
                    <input
                      onChange={handleChange}
                      style={{ padding: "8px" }}
                      className="form-control"
                      placeholder="City"
                      name="city"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-fields mb-2">
                    <input
                      onChange={handleChange}
                      style={{ padding: "8px" }}
                      className="form-control"
                      placeholder="State"
                      name="state"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-fields mb-2">
                    <input
                      onChange={handleChange}
                      style={{ padding: "8px" }}
                      className="form-control"
                      placeholder="Pin code"
                      name="pincode"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleSaveAddress}
                className="w-50 add-to-cart-btn"
              >
                Save this Address
              </button>
              <button
                onClick={() => setAddNewAddress(!addNewAddress)}
                className="w-50 add-to-cart-btn bg-dark text-white"
              >
                cancel
              </button>
            </>
          )}
        </div>
      </DashboardLayout>
    </Layout>
  );
};

export default Address;
