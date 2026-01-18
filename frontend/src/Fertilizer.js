// src/Fertilizer.js

import { useState } from "react";
import axios from "axios";
import "./App.css";

function Fertilizer() {
  const [form, setForm] = useState({
    crop: "",
    N: "",
    P: "",
    K: "",
    ph: "",
  });

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult([]);

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/fertilizer-recommend/",
        form
      );

      setResult(res.data.suggestions || []);
    } catch (err) {
      alert("Failed to get fertilizer recommendation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-section">
      <h2 style={{ textAlign: "center" }}>🌱 Fertilizer Recommendation</h2>

      <form className="crop-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <input name="crop" placeholder="Crop Name" onChange={handleChange} required />
          <input name="N" placeholder="Nitrogen (N)" onChange={handleChange} required />
          <input name="P" placeholder="Phosphorus (P)" onChange={handleChange} required />
          <input name="K" placeholder="Potassium (K)" onChange={handleChange} required />
          <input name="ph" placeholder="Soil pH" onChange={handleChange} required />
        </div>

        <button className="cta-button" disabled={loading}>
          {loading ? "Analyzing..." : "Get Fertilizer Suggestion"}
        </button>
      </form>

      {result.length > 0 && (
        <div className="result-card">
          <h3>Recommended Fertilizers:</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {result.map((r, i) => (
              <li key={i}>🌱 {r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Fertilizer;
