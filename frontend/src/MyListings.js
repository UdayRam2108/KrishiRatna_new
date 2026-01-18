import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/farmer-market/my/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setListings(res.data || []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Failed to load your products");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/farmer-market/delete/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Deleted successfully");
      fetchMyListings();
    } catch (err) {
      console.error("DELETE ERROR:", err.response?.data);
      alert("Failed to delete");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📦 My Listings</h2>

      <button onClick={() => navigate("/marketplace")}>⬅ Back to Market</button>

      {listings.length === 0 && <p>No products posted by you.</p>}

      <div style={gridStyle}>
        {listings.map((item) => (
          <div key={item.id} style={cardStyle}>
            <img src={item.photo} alt="" style={imgStyle} />
            <h4>{item.title}</h4>
            <p>₹ {item.price}</p>
            <small>{item.location}</small>

            <div style={{ marginTop: "10px" }}>
              <button onClick={() => navigate(`/marketplace/edit/${item.id}`)}>
                ✏️ Edit
              </button>{" "}
              <button onClick={() => deleteItem(item.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  borderRadius: "12px",
};

const imgStyle = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "8px",
};

export default MyListings;
