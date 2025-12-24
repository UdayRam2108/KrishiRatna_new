import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Detail() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* 🟢 HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* 📍 USE CURRENT LOCATION WEATHER */
  const handleGetWeather = () => {
  if (!navigator.geolocation) {
    alert("Location not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/weather/?lat=${lat}&lon=${lon}`
      );

      setFormData({
        ...formData,
        temperature: String(res.data.temperature),
        humidity: String(res.data.humidity),
      });

    } catch (err) {
      alert("Weather fetch failed");
    }
  });
};


  /* 🌾 SUBMIT FORM */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");

    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/recommend/",
        formData
      );
      setResult(res.data.recommended_crop);
    } catch {
      setError("Failed to get recommendation");
    } finally {
      setLoading(false);
    }
  };

  /* 🔓 LOGOUT */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* 🔝 TOP ACTIONS */}
      <div style={{ display: "flex", gap: "10px", padding: "20px" }}>
        <button className="back-button" onClick={() => navigate("/")}>
          ← Home
        </button>

        <button className="nav-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* 🌱 FORM SECTION */}
      <section className="form-section">
        <h2>🌱 Apni Fasal Jaane</h2>

        {/* 📍 WEATHER BUTTON */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <button
            type="button"
            className="weather-button"
            onClick={handleGetWeather}
          >
            📍 Use Current Location’s Weather
          </button>
        </div>

        <form className="crop-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="N" placeholder="Nitrogen (N)" onChange={handleChange} required />
            <input name="P" placeholder="Phosphorus (P)" onChange={handleChange} required />
            <input name="K" placeholder="Potassium (K)" onChange={handleChange} required />
            <input name="temperature" value={formData.temperature} placeholder="Temperature (°C)" onChange={handleChange} required />
            <input name="humidity" value={formData.humidity} placeholder="Humidity (%)" onChange={handleChange} required />
            <input name="ph" placeholder="Soil pH" onChange={handleChange} required />
            <input name="rainfall" placeholder="Rainfall (mm)" onChange={handleChange} required />
          </div>

          <button className="cta-button" disabled={loading}>
            {loading ? "Analyzing..." : "Get Recommendation 🚜"}
          </button>
        </form>

        {/* 🔄 LOADER */}
        {loading && <div className="loader"></div>}

        {/* 🌾 RESULT */}
        {result && (
          <div className="result-card">
            <h3>🌾 Aapke Khet ke liye Best Fasal</h3>
            <p className="crop-name">{result}</p>
          </div>
        )}

        {/* ❌ ERROR */}
        {error && <p className="error">{error}</p>}
      </section>
    </>
  );
}

export default Detail;
