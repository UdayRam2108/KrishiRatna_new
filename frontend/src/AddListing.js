import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddListing() {
  const [category, setCategory] = useState("tools");

  const [cattleType, setCattleType] = useState("cow");
  const [toolType, setToolType] = useState("vehicles");

  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    if (!photo) {
      alert("Please select image");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
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

    form.append("price", parseInt(price));
    form.append("phone", phone);
    form.append("photo", photo);
    form.append("description", description);
    form.append("location", location);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/farmer-market/add/",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Product posted successfully!");
      navigate("/marketplace");
    } catch (err) {
      console.error("POST ERROR:", err.response?.data);
      alert("❌ Failed to post product. Check console.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>➕ Sell Product</h2>

      {/* CATEGORY */}
      <label>Category:</label>
      <br />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="tools">Tools</option>
        <option value="cattle">Cattle</option>
      </select>
      <br />
      <br />

      {/* SUB CATEGORY */}
      {category === "cattle" ? (
        <>
          <label>Select Cattle Type:</label>
          <br />
          <select
            value={cattleType}
            onChange={(e) => setCattleType(e.target.value)}
          >
            <option value="cow">Cow</option>
            <option value="buffalo">Buffalo</option>
            <option value="ox">Ox</option>
            <option value="other">Other</option>
          </select>
          <br />
          <br />
        </>
      ) : (
        <>
          <label>Select Tool Type:</label>
          <br />
          <select
            value={toolType}
            onChange={(e) => setToolType(e.target.value)}
          >
            <option value="vehicles">Vehicles</option>
            <option value="machinery">Machinery</option>
            <option value="instruments">Instruments</option>
            <option value="other">Other</option>
          </select>
          <br />
          <br />
        </>
      )}

      <input
        placeholder="Price"
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br />
      <br />

      <input
        placeholder="Location (Village/City)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <br />
      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <br />

      <input type="file" onChange={(e) => setPhoto(e.target.files[0])} />
      <br />
      <br />

      <button onClick={submit}>Post</button>
    </div>
  );
}

export default AddListing;
