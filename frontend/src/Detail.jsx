import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { useLanguage } from "./context/LanguageContext";

function Detail() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // 🌾 FORM DATA
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  });

  // 🌾 STATES
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);

  /* 🟢 HANDLE INPUT */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* 📍 GET CURRENT LOCATION WEATHER */
  const handleGetWeather = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    setWeatherLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          const res = await axios.get(
            `http://127.0.0.1:8000/api/weather/?lat=${lat}&lon=${lon}`
          );

          setFormData((prev) => ({
            ...prev,
            temperature: String(res.data.temperature),
            humidity: String(res.data.humidity)
          }));
        } catch {
          alert("Weather fetch failed");
        } finally {
          setWeatherLoading(false);
        }
      },
      () => {
        alert("Location permission denied");
        setWeatherLoading(false);
      }
    );
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
      setError(t("error"));
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
          {t("back_home")}
        </button>

        <button className="nav-button" onClick={handleLogout}>
          {t("logout")}
        </button>
      </div>

      {/* 🌱 FORM SECTION */}
      <section className="form-section">
        <h2>{t("form_title")}</h2>

        {/* 📍 WEATHER BUTTON */}
        <div style={{ textAlign: "center", marginBottom: "18px" }}>
          <button
            type="button"
            className="weather-button"
            onClick={handleGetWeather}
            disabled={weatherLoading}
          >
            {weatherLoading
              ? "⏳ Fetching weather..."
              : ` ${t("use_weather")}`}
          </button>
        </div>

        <form className="crop-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <input name="N" placeholder="Nitrogen (N)" onChange={handleChange} required />
            <input name="P" placeholder="Phosphorus (P)" onChange={handleChange} required />
            <input name="K" placeholder="Potassium (K)" onChange={handleChange} required />
            <input
              name="temperature"
              value={formData.temperature}
              placeholder="Temperature (°C)"
              onChange={handleChange}
              required
            />
            <input
              name="humidity"
              value={formData.humidity}
              placeholder="Humidity (%)"
              onChange={handleChange}
              required
            />
            <input name="ph" placeholder="Soil pH" onChange={handleChange} required />
            <input name="rainfall" placeholder="Rainfall (mm)" onChange={handleChange} required />
          </div>

          {/* ✅ BOTH BUTTONS */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "20px" }}>
            <button className="cta-button" disabled={loading}>
              {loading ? t("loading") : t("submit")}
            </button>

            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/fertilizer")}
            >
              🌱 Fertilizer Suggestion
            </button>
          </div>
        </form>

        {/* 🔄 LOADER */}
        {loading && <div className="loader"></div>}

        {/* 🌾 RESULT */}
        {result && (
          <div className="result-card">
            <h3>{t("best_crop")}</h3>
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
