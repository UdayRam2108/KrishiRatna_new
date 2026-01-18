import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MarketHome() {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [cattleFilter, setCattleFilter] = useState("all");
  const [toolFilter, setToolFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    const res = await axios.get("http://127.0.0.1:8000/api/farmer-market/");
    setListings(res.data || []);
  };

  // 🔐 CHECK LOGIN
  const handleSellClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first to sell your product");
      navigate("/login");
    } else {
      navigate("/marketplace/add");
    }
  };

  let filtered = [];

  if (selectedCategory) {
    filtered = listings.filter((item) => item.category === selectedCategory);

    if (selectedCategory === "cattle" && cattleFilter !== "all") {
      filtered = filtered.filter((item) => item.cattle_type === cattleFilter);
    }

    if (selectedCategory === "tools" && toolFilter !== "all") {
      filtered = filtered.filter((item) => item.tool_type === toolFilter);
    }
  }

  // CATEGORY SELECTION SCREEN
  if (!selectedCategory) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>🛒 Choose Category</h2>
        <button onClick={() => navigate("/my-listings")}>📦 My Listings</button>


        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginTop: "40px",
          }}
        >
          <div onClick={() => setSelectedCategory("tools")} style={cardStyle}>
            🛠 <div>Tools</div>
          </div>

          <div onClick={() => setSelectedCategory("cattle")} style={cardStyle}>
            🐄 <div>Cattle</div>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <button onClick={handleSellClick}>➕ Sell Your Product</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>
          {selectedCategory === "tools" ? "🛠 Tools" : "🐄 Cattle"} Marketplace
        </h2>

        <div>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCattleFilter("all");
              setToolFilter("all");
            }}
          >
            ⬅ Change Category
          </button>{" "}
          <button onClick={handleSellClick}>➕ Add Product</button>
        </div>
      </div>

      {/* SUB FILTERS */}
      {selectedCategory === "cattle" && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setCattleFilter("all")}>All</button>{" "}
          <button onClick={() => setCattleFilter("cow")}>Cow</button>{" "}
          <button onClick={() => setCattleFilter("buffalo")}>Buffalo</button>{" "}
          <button onClick={() => setCattleFilter("ox")}>Ox</button>{" "}
          <button onClick={() => setCattleFilter("other")}>Other</button>
        </div>
      )}

      {selectedCategory === "tools" && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setToolFilter("all")}>All</button>{" "}
          <button onClick={() => setToolFilter("vehicles")}>Vehicles</button>{" "}
          <button onClick={() => setToolFilter("machinery")}>Machinery</button>{" "}
          <button onClick={() => setToolFilter("instruments")}>
            Instruments
          </button>{" "}
          <button onClick={() => setToolFilter("other")}>Other</button>
        </div>
      )}

      {filtered.length === 0 && (
        <p style={{ marginTop: "30px" }}>❌ No products found.</p>
      )}

      <div style={gridStyle}>
        {filtered.map((item) => (
          <div
            key={item.id}
            style={itemStyle}
            onClick={() => navigate(`/marketplace/${item.id}`)}
          >
            <img src={item.photo} alt="" style={imgStyle} />
            <h4>{item.title}</h4>
            <p>₹ {item.price}</p>
            <small>{item.location}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

const cardStyle = {
  width: "260px",
  height: "180px",
  border: "2px solid #1e7f43",
  borderRadius: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: "1.5rem",
  boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))",
  gap: "20px",
  marginTop: "20px",
};

const itemStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  cursor: "pointer",
  borderRadius: "12px",
};

const imgStyle = {
  width: "100%",
  height: "160px",
  objectFit: "cover",
  borderRadius: "8px",
};

export default MarketHome;
