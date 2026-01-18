import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState("tools");
  const [cattleType, setCattleType] = useState("cow");
  const [toolType, setToolType] = useState("vehicles");

  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetchOldData();
  }, []);

  const fetchOldData = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/farmer-market/${id}/`
      );

      const item = res.data;

      setCategory(item.category);
      setCattleType(item.cattle_type || "cow");
      setToolType(item.tool_type || "vehicles");
      setPrice(item.price);
      setPhone(item.phone);
      setDescription(item.description);
      setLocation(item.location);
    } catch (err) {
      alert("Failed to load product");
    }
  };

  const submit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      navigate("/login");
      return;
    }

    const form = new FormData();

    form.append("category", category);

    if (category === "cattle") {
      form.append("title", cattleType);
      form.append("cattle_type", cattleType);
      form.append("tool_type", "");
    } else {
      form.append("title", toolType);
      form.append("tool_type", toolType);
      form.append("cattle_type", "");
    }

    form.append("price", price);
    form.append("phone", phone);
    form.append("description", description);
    form.append("location", location);

    if (photo) {
      form.append("photo", photo);
    }

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/farmer-market/edit/${id}/`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product updated successfully!");
      navigate("/my-listings");
    } catch (err) {
      console.error("UPDATE ERROR:", err.response?.data);
      alert("Update failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>✏️ Edit Product</h2>

      <button onClick={() => navigate("/my-listings")}>⬅ Back</button>

      <br /><br />

      {/* CATEGORY */}
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="tools">Tools</option>
        <option value="cattle">Cattle</option>
      </select>

      <br /><br />

      {/* SUB CATEGORY */}
      {category === "cattle" ? (
        <>
          <label>Cattle Type:</label><br />
          <select value={cattleType} onChange={(e) => setCattleType(e.target.value)}>
            <option value="cow">Cow</option>
            <option value="buffalo">Buffalo</option>
            <option value="ox">Ox</option>
            <option value="other">Other</option>
          </select>
        </>
      ) : (
        <>
          <label>Tool Type:</label><br />
          <select value={toolType} onChange={(e) => setToolType(e.target.value)}>
            <option value="vehicles">Vehicles</option>
            <option value="machinery">Machinery</option>
            <option value="instruments">Instruments</option>
            <option value="other">Other</option>
          </select>
        </>
      )}

      <br /><br />

      <input value={price} type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
      <br /><br />

      <input value={phone} placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <br /><br />

      <input value={location} placeholder="Location" onChange={(e) => setLocation(e.target.value)} />
      <br /><br />

      <textarea value={description} placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
      <br /><br />

      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
      <br /><br />

      <button onClick={submit}>💾 Update</button>
    </div>
  );
}

export default EditListing;
