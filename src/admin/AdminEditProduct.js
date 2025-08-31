import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message } from "antd";
import AdminLayout from "./components/AdminLayout";
import axios from "axios";
import "./AdminUsers.css";
import "./AdminAddProduct.css";

const AdminEditProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [yokcash, setYokcash] = useState(null);
  const [moogold, setMoogold] = useState(null);
  const [servers, setServers] = useState(null);
  const [prodCategory, setprodCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    desc: "",
    descTwo: "",
    api: "",
    category: "",
    apiName: "",
    gameName: "",
    region: "",
    stock: "Yes",
    image: [],
    bannerImage: null, // Added
    instructionImage: null, // Added
    userIdImage: null, // Added
    fields: "",
    tagOne: "",
    tagTwo: "",
    playerCheckBtn: "",
  });

  const generateRandomProdId = () => {
    let prodId = "";
    while (prodId.length < 12) {
      prodId += Math.random().toString(36).substr(2);
    }
    return prodId.substr(0, 12);
  };

  const [cost, setCost] = useState([
    {
      packId: generateRandomProdId(),
      id: "",
      amount: "",
      pack: "",
      buyingPrice: "",
      price: "",
      fakePrice: "",
      pimg: "",
      resPrice: "",
      prodCategory: "",
    },
  ]);

  const handleAddCostField = (index) => {
    const updatedCost = [...cost];
    updatedCost.splice(index + 1, 0, {
      packId: generateRandomProdId(),
      id: "",
      amount: "",
      pack: "",
      buyingPrice: "",
      price: "",
      fakePrice: "",
      pimg: "",
      resPrice: "",
      prodCategory: "",
    });
    setCost(updatedCost);
  };
  const handleRemoveCostField = (index) => {
    const updatedCost = [...cost];
    updatedCost.splice(index, 1);
    setCost(updatedCost);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "image") {
      setForm({ ...form, [name]: e.target.files });
    } else if (
      name === "bannerImage" ||
      name === "instructionImage" ||
      name === "userIdImage"
    ) {
      setForm({ ...form, [name]: e.target.files[0] });
    } else if (
      name.startsWith("id") ||
      name.startsWith("amount") ||
      name.startsWith("pack") ||
      name.startsWith("buyingPrice") ||
      name.startsWith("price") ||
      name.startsWith("fakePrice") ||
      name.startsWith("pimg") ||
      name.startsWith("resPrice") ||
      name.startsWith("prodCategory") ||
      name.startsWith("profit")
    ) {
      const index = parseInt(name.split("-")[1]);
      const updatedCost = [...cost];
      const property = name.startsWith("amount")
        ? "amount"
        : name.startsWith("buyingPrice")
        ? "buyingPrice"
        : name.startsWith("price")
        ? "price"
        : name.startsWith("pimg")
        ? "pimg"
        : name.startsWith("resPrice")
        ? "resPrice"
        : name.startsWith("profit")
        ? "profit"
        : name.startsWith("pack")
        ? "pack"
        : name.startsWith("fakePrice")
        ? "fakePrice"
        : name.startsWith("prodCategory")
        ? "prodCategory"
        : "id";
      updatedCost[index][property] = value;
      setCost(updatedCost);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("id", form?._id);
    formData.append("name", form?.name);
    formData.append("company", form?.company);
    formData.append("api", form?.api);
    formData.append("apiName", form?.apiName);
    formData.append("gameName", form?.gameName);
    formData.append("region", form?.region);
    formData.append("tag", form?.tag);
    formData.append("stock", form?.stock);
    formData.append("desc", form?.desc);
    formData.append("descTwo", form?.descTwo);
    formData.append("category", form?.category);
    formData.append("image", selectedFile);
    formData.append("fields", form?.fields);
    formData.append("tagOne", form?.tagOne);
    formData.append("tagTwo", form?.tagTwo);
    formData.append("playerCheckBtn", form?.playerCheckBtn);

    // Append cost array elements individually
    cost.forEach((costItem, index) => {
      formData.append(`cost[${index}][id]`, costItem.id);
      formData.append(`cost[${index}][packId]`, costItem.packId);
      formData.append(`cost[${index}][amount]`, costItem.amount);
      formData.append(`cost[${index}][pack]`, costItem.pack);
      formData.append(`cost[${index}][price]`, costItem.price);
      formData.append(`cost[${index}][fakePrice]`, costItem.fakePrice);
      formData.append(`cost[${index}][pimg]`, costItem.pimg);
      formData.append(`cost[${index}][resPrice]`, costItem.resPrice);
      formData.append(`cost[${index}][prodCategory]`, costItem.prodCategory);
    });

    if (form.bannerImage) {
      formData.append("bannerImage", form.bannerImage);
    }
    if (form.instructionImage) {
      formData.append("instructionImage", form.instructionImage);
    }
    if (form.userIdImage) {
      formData.append("userIdImage", form.userIdImage);
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/product/update-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        message.success(res.data.message);
        setLoading(false);
        navigate("/admin-products");
      } else {
        setLoading(false);
        message.error(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading files:", error);
    }
  };

  const getProduct = async () => {
    try {
      const res = await axios.post("/api/product/get-product", {
        id: params.id,
      });
      if (res.data.success) {
        const updatedCost = res.data.data.cost.map((item) => ({
          ...item,
          packId: item.packId || generateRandomProdId(),
        }));
        setForm(res.data.data);
        setCost(updatedCost);
        setSelectedFile(res.data.data.image);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  const getMobileLegendGame = async () => {
    try {
      const res = await axios.post(
        "/api/product/get-mobile-legend",
        { region: form?.region },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res.data.success) {
        setData(res.data.data.product);
      } else {
        message.error("Api Error, Try after sometime");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (form?.region !== "") {
      getMobileLegendGame();
    }
  }, [form?.region]);

  const fetchYokcashServices = async () => {
    try {
      const res = await axios.post(
        "/api/yokcash/get-yokcash",
        {
          gameName: form?.gameName,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setYokcash(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchMoogoldServices = async () => {
    try {
      const res = await axios.post("/api/moogold/moogold-product", {
        product_id: form?.gameName,
      });
      if (res.data.success) {
        setMoogold(res.data.data.Variation);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchMoogoldServers = async () => {
    try {
      const res = await axios.post("/api/moogold/moogold-servers", {
        product_id: form?.gameName,
      });
      if (res.data.success) {
        setServers(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    if (form?.apiName === "yokcash" && form?.gameName !== "") {
      fetchYokcashServices();
    } else if (form?.apiName === "moogold" && form?.gameName !== "") {
      fetchMoogoldServices();
      fetchMoogoldServers();
    }
  }, [form?.gameName]);

  const getAllCategory = async () => {
    try {
      const res = await axios.get("/api/packCategory/get-pack-category", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setprodCategory(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <AdminLayout>
      <div className="admin-users-container">
        <div className="page-title">
          <h3 className="m-0">Edit Product</h3>
        </div>
        <hr />
        <div className="add-product-container">
          <div className="form-fields mb-3">
            <input
              className="w-100"
              aria-label="Select Image"
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              name="image"
              required
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
          <span className="text-dark">
            <small>Banner Image</small>
          </span>
          <div className="form-fields mb-3">
            <input
              className="w-100"
              aria-label="Select Banner Image"
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              name="bannerImage"
              required
              ref={fileInputRef}
              onChange={handleChange}
            />
          </div>
          <span className="text-dark">
            <small>Instruction Image</small>
          </span>
          <div className="form-fields mb-3">
            <input
              className="w-100"
              aria-label="Select Instruction Image"
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              name="instructionImage"
              required
              ref={fileInputRef}
              onChange={handleChange}
            />
          </div>
          <span className="text-dark">
            <small>User Id Image</small>
          </span>
          <div className="form-fields mb-3">
            <input
              className="w-100"
              aria-label="Select Instruction Image"
              type="file"
              accept=".jpg, .jpeg, .png, .webp"
              name="userIdImage"
              required
              ref={fileInputRef}
              onChange={handleChange}
            />
          </div>
          <div className="form-fields mb-3">
            <input
              className="w-100"
              name="name"
              onChange={handleChange}
              value={form?.name}
              type="text"
              placeholder="Enter name"
            />
          </div>
          <div className="form-fields mb-3">
            <input
              className="w-100"
              name="company"
              onChange={handleChange}
              value={form?.company}
              type="text"
              placeholder="Enter company name"
            />
          </div>
          <div className="form-fields mb-3">
            <input
              className="w-100"
              name="descTwo"
              onChange={handleChange}
              value={form?.descTwo}
              type="text"
              placeholder="Enter tagline"
            />
          </div>
          <div className="form-fields mb-3">
            <textarea
              style={{ border: "1px solid #000" }}
              name="desc"
              id=""
              cols="30"
              rows="3"
              placeholder="Description"
              className="form-control"
              onChange={handleChange}
              value={form?.desc}
            ></textarea>
          </div>
          <div className="form-fields mb-3">
            <select
              onChange={handleChange}
              value={form?.category}
              name="category"
              className="w-100"
            >
              <option value="">Category</option>
              <option value="Popular Games">Popular Games</option>
              <option value="Social Media Services">
                Social Media Services
              </option>
              <option value="Mobile Games">Mobile Games</option>
              <option value="PC Games">PC Games</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-fields mb-3">
            <select
              onChange={handleChange}
              value={form?.api}
              name="api"
              className="w-100"
            >
              <option value="">API BASED?</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {form?.api === "yes" && (
            <div className="form-fields mb-3">
              <select
                onChange={handleChange}
                value={form?.apiName}
                name="apiName"
                className="w-100"
              >
                <option value="">Select API</option>
                <option value="smileOne">Smile One Api</option>
                <option value="yokcash">Yokcash Api</option>
                {/* <option value="moogold">Moogold</option> */}
              </select>
            </div>
          )}
          {form?.api === "yes" && form?.apiName === "moogold" && (
            <div className="form-fields mb-3">
              <select
                onChange={handleChange}
                value={form?.gameName}
                name="gameName"
                className="w-100"
              >
                <option value="">Select Game</option>
                <option value="15145">Mobile Legends</option>
                <option value="428075">Genshin Impact</option>
                <option value="4233885">Honkai: Star Rail</option>
                <option value="2314135">Super Sus</option>
                <option value="5177311">Honor of Kings</option>
                <option value="8810922">Love Nikki</option>
                <option value="8811493">Shining Nikki</option>
                <option value="4427071">Clash of Clans</option>
                <option value="182295">Dragon Raja</option>
                <option value="6963">Pubg Global</option>
                <option value="9477186">Zenless Zone Zero</option>
              </select>
            </div>
          )}

          {form?.api === "yes" && form?.apiName === "smileOne" && (
            <div className="form-fields mb-3">
              <select
                onChange={handleChange}
                value={form?.region}
                name="region"
                className="w-100"
              >
                <option value="">Select Region</option>
                <option value="brazil">Brazil</option>
                <option value="philippines">Philippines</option>
              </select>
            </div>
          )}

          {form?.api === "yes" && form?.apiName === "yokcash" && (
            <div className="form-fields mb-3">
              <select
                onChange={handleChange}
                value={form?.gameName}
                name="gameName"
                className="w-100"
              >
                <option value="">Select Game</option>
                <option value="MLBB">MLBB</option>
                <option value="Mobile Legends">Mobile Legends</option>
                <option value="Genshin Impact">Genshin Impact</option>
                <option value="Honkai Star Rail">Honkai Star Rail</option>
                <option value="Honor Of Kings">Honor Of Kings</option>
                <option value="Magic Chess : Go Go">Magic Chess : Go Go</option>
                <option value="Zenless Zone Zero">Zenless Zone Zero</option>
                <option value="PUBG Mobile">PUBG Mobile</option>
                <option value="Arena Breakout">Arena Breakout</option>
                <option value="Valorant">Valorant</option>
                <option value="Call Of Duty Mobile">Call Of Duty Mobile</option>
                <option value="Super Sus">Super Sus</option>
                <option value="Wuthering Waves">Wuthering Waves</option>
                <option value="Farlight 84">Farlight 84</option>
                <option value="Marvel Rivals">Marvel Rivals</option>
              </select>
            </div>
          )}

          <div className="form-fields mb-3">
            <label htmlFor="" className="text-dark">
              <small>Stock</small>
            </label>
            <select
              onChange={handleChange}
              value={form?.stock}
              name="stock"
              className="w-100"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          {cost &&
            cost?.map((item, index) => (
              <div className="d-flex form-fields mb-3" key={index}>
                <input
                  className="w-100"
                  name={`packId-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.packId || ""}
                  type="text"
                  readOnly
                />
                <input
                  className="w-100"
                  name={`id-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.id || ""}
                  type="text"
                  placeholder="Enter id"
                />
                <input
                  className="w-100"
                  name={`amount-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.amount || ""}
                  type="text"
                  placeholder="Enter Amount"
                />
                <input
                  className="w-100"
                  name={`pack-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.pack || ""}
                  type="text"
                  placeholder="Enter Pack in details"
                />
                <input
                  className="w-100"
                  name={`buyingPrice-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.buyingPrice || ""}
                  type="text"
                  placeholder="Enter Buying Price"
                />
                <input
                  className="w-100"
                  name={`price-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.price || ""}
                  type="text"
                  placeholder="Enter Price"
                />
                <input
                  className="w-100"
                  name={`fakePrice-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.fakePrice || ""}
                  type="text"
                  placeholder="Enter Fake Price"
                />
                <input
                  className="w-100"
                  name={`resPrice-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.resPrice || ""}
                  type="text"
                  placeholder="Enter Reseller Price"
                />
                <input
                  className="w-100"
                  name={`pimg-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.pimg || ""}
                  type="text"
                  placeholder="Enter image link"
                />
                <select
                  className="w-100"
                  name={`prodCategory-${index}`}
                  onChange={handleChange}
                  value={cost[index]?.prodCategory || ""}
                >
                  <option value="">Select</option>
                  {prodCategory?.map((item) => {
                    return (
                      <option value={item?.category}>{item?.category}</option>
                    );
                  })}
                </select>
                <button onClick={() => handleAddCostField(index)}>+</button>
                {index > 0 && (
                  <button onClick={() => handleRemoveCostField(index)}>
                    -
                  </button>
                )}
              </div>
            ))}

          <div className="form-fields mb-3">
            <select
              onChange={handleChange}
              value={form?.fields}
              name="fields"
              className="w-100"
            >
              <option value="">Fields</option>
              <option value="1">1 (USER ID/PlayerId/Link)</option>
              <option value="2">2 (USERID ZONEID)</option>
              <option value="3">3 (USERID AND SELECT SERVER)</option>
            </select>
          </div>

          {(form?.fields === "1" ||
            form?.fields === "2" ||
            form?.fields === "3") && (
            <div className="form-fields mb-3">
              <input
                className="w-100"
                name="tagOne"
                onChange={handleChange}
                value={form?.tagOne}
                type="text"
                placeholder="Enter Tag One"
              />
            </div>
          )}
          {(form?.fields === "2" || form?.fields === "3") && (
            <div className="form-fields mb-3">
              <input
                className="w-100"
                name="tagTwo"
                onChange={handleChange}
                value={form?.tagTwo}
                type="text"
                placeholder="Enter Tag Two"
              />
            </div>
          )}

          <div className="form-fields mb-3">
            <select
              onChange={handleChange}
              value={form?.playerCheckBtn}
              name="playerCheckBtn"
              className="w-100"
            >
              <option value="">Player Check Btn</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <button className="w-100 py-3" onClick={handleUpdateProduct}>
            Update
          </button>
        </div>
      </div>
      {/* API PRO LIST  */}
      {form.apiName === "smileOne" && data && (
        <table className="table mt-5 bg-white text-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>SPU</th>
              <th>PRICE</th>
              <th>COST PRICE</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <tr>
                  <td>{item?.id}</td>
                  <td>{item.spu}</td>
                  <td>{item.price}</td>
                  <td>{item.cost_price}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {form?.apiName === "moogold" && moogold && (
        <table className="table mt-5 bg-white text-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
            </tr>
          </thead>
          <tbody>
            {moogold &&
              moogold?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.variation_id}</td>
                    <td>{item?.variation_name}</td>
                    <td>{item.variation_price}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {form.apiName === "yokcash" && yokcash && (
        <table className="table mt-5 bg-white text-dark">
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {yokcash?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item?.id}</td>
                  <td>{item?.nama_layanan}</td>
                  <td>{item?.kategori}</td>
                  <td>{item?.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default AdminEditProduct;
