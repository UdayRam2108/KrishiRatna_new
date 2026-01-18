import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOne();
  }, []);

  const fetchOne = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/farmer-market/${id}/`
      );
      setItem(res.data);
    } catch (err) {
      console.error("DETAIL FETCH ERROR:", err);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: "30px" }}>Loading...</p>;

  if (!item)
    return (
      <div style={{ padding: "30px" }}>
        <p>❌ Product not found</p>
        <button onClick={() => navigate("/marketplace")}>⬅ Back</button>
      </div>
    );

  // Decide sub category text
  let subCategoryText = "";

  if (item.category === "cattle") {
    subCategoryText = item.cattle_type
      ? item.cattle_type.toUpperCase()
      : "Cattle";
  } else if (item.category === "tools") {
    subCategoryText = item.tool_type
      ? item.tool_type.toUpperCase()
      : "Tool";
  }

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <button onClick={() => navigate("/marketplace")}>⬅ Back</button>

      <h2 style={{ marginTop: "20px" }}>
        {item.category.toUpperCase()} → {subCategoryText}
      </h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* IMAGE */}
        <div>
          <img
            src={item.photo}
            alt="product"
            style={{
              width: "320px",
              height: "320px",
              objectFit: "cover",
              borderRadius: "12px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* DETAILS */}
        <div style={{ flex: 1, minWidth: "250px" }}>
          <h3>₹ {item.price}</h3>

          <p>
            <b>📍 Location:</b> {item.location}
          </p>

          <p>
            <b>🧑 Seller:</b> {item.seller}
          </p>

          <p>
            <b>📞 Contact:</b> {item.phone}
          </p>

          <p style={{ marginTop: "15px" }}>
            <b>📝 Description:</b>
            <br />
            {item.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
