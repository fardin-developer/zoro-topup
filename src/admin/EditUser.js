import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import AdminLayout from "./components/AdminLayout";
import axios from "axios";
import "./EditUser.css";

const EditUser = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user?.addBalance && (!user?.type || user?.type === "")) {
      return message.error("Please select type");
    }
    try {
      const res = await axios.post("/api/admin/admin-edit-user", user, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        message.success(res.data.message);
        navigate("/admin-users");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // get user
  const getUser = async () => {
    try {
      const res = await axios.post(
        "/api/admin/get-user",
        { _id: params.id },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setUser(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <form>
          <div className="page-title">
            <h3 className="m-0">Edit User</h3>
            <button onClick={handleSubmit}>Update</button>
          </div>
          <hr />
          <div className="admin-edit-container">
            <div className="row">
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    className="form-control"
                    value={user?.email}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    name="fname"
                    placeholder="Enter Name"
                    className="form-control"
                    onChange={handleChange}
                    value={user?.fname}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Mobile
                  </label>
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Enter mobile"
                    className="form-control"
                    onChange={handleChange}
                    value={user?.mobile}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Block
                  </label>
                  <select
                    className="form-select"
                    onChange={handleChange}
                    value={user?.block}
                    name="block"
                    id=""
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Reseller
                  </label>
                  <select
                    className="form-select"
                    onChange={handleChange}
                    value={user?.reseller}
                    name="reseller"
                    id=""
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Balance
                  </label>
                  <input
                    type="text"
                    name="balance"
                    placeholder="Enter balance"
                    className="form-control"
                    onChange={handleChange}
                    value={user?.balance}
                    readOnly
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Update Balance
                  </label>
                  <input
                    type="text"
                    name="addBalance"
                    placeholder="Enter Balance to Add"
                    className="form-control"
                    onChange={handleChange}
                    value={user?.addBalance}
                  />
                  <span className="text-danger">
                    <small>For Addition use "+" || For deduction use "-"</small>
                  </span>
                </div>
              </div>
              <div className="col-12">
                <div className="form-fields mb-3">
                  <label htmlFor="" className="form-label">
                    Select Type
                  </label>
                  <select
                    className="form-select"
                    onChange={handleChange}
                    value={user?.type}
                    name="type"
                  >
                    <option value="">Select</option>
                    <option value="addmoney">Add Money</option>
                    <option value="withdraw">Withdraw Money</option>
                    <option value="refund">Refund</option>
                    <option value="reward">Reward</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="form-fields mb-3">
                <label htmlFor="" className="form-label">
                  Password
                </label>
                <input
                  type="text"
                  name="password"
                  placeholder="Enter Password (Optional)"
                  className="form-control"
                  onChange={handleChange}
                  value={user?.password}
                />
              </div>
            </div>
            <button onClick={handleSubmit} className="register-btn">
              Update User
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditUser;
