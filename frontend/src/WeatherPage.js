import { useState } from "react";
import axios from "axios";
import "./App.css";
import { useLanguage } from "./context/LanguageContext";

function WeatherPage() {
  const { t } = useLanguage();

  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch city suggestions
  const fetchSuggestions = async (text) => {
    setCity(text);

    if (text.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${text}&limit=5&appid=388657e81d4d0bbd127bd3ee2ddf486d`
      );
      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Suggestion error", err);
    }
  };

  // 🌦️ Fetch weather from OUR BACKEND (NEW API)
  const fetchWeather = async (selectedCity = city) => {
    if (!selectedCity) {
      alert(t("enter_city"));
      return;
    }

    setLoading(true);
    setData(null);
    setSuggestions([]);

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/weather-by-city/?city=${selectedCity}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Weather fetch error", err);
      alert(t("city_not_found"));
    } finally {
      setLoading(false);
    }
  };

  // 📍 Use live location
  const useLiveLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          // 1️⃣ get city name from reverse geo
          const res2 = await axios.get(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=388657e81d4d0bbd127bd3ee2ddf486d`
          );

          const cityName = res2.data[0]?.name;

          if (!cityName) {
            alert("Could not detect city");
            setLoading(false);
            return;
          }

          setCity(cityName);

          // 2️⃣ get forecast from our backend
          const res3 = await axios.get(
            `http://127.0.0.1:8000/api/weather-by-city/?city=${cityName}`
          );

          setData(res3.data);
        } catch (err) {
          console.error("Location weather error", err);
          alert("Location weather failed");
        } finally {
          setLoading(false);
        }
      },
      () => {
        alert("Location permission denied");
        setLoading(false);
      }
    );
  };

  return (
    <div className="form-section">
      <h2 style={{ textAlign: "center" }}>🌦️ {t("weather_title")}</h2>

      <div style={{ textAlign: "center", marginBottom: "20px", position: "relative" }}>
        <input
          placeholder={t("enter_city")}
          value={city}
          onChange={(e) => fetchSuggestions(e.target.value)}
          style={{ maxWidth: "320px" }}
        />

        {/* 🔽 Suggestions */}
        {suggestions.length > 0 && (
          <div
            style={{
              maxWidth: "320px",
              margin: "auto",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              textAlign: "left",
            }}
          >
            {suggestions.map((s, i) => (
              <div
                key={i}
                style={{ padding: "8px", cursor: "pointer" }}
                onClick={() => {
                  setCity(s.name);
                  setSuggestions([]);
                  fetchWeather(s.name);
                }}
              >
                📍 {s.name}, {s.country}
              </div>
            ))}
          </div>
        )}

        <br />
        <button className="cta-button" onClick={() => fetchWeather()}>
          {loading ? t("loading") : t("get_weather")}
        </button>

        <br /><br />

        <button className="weather-button" onClick={useLiveLocation}>
          📍 {t("use_location")}
        </button>
      </div>

      {/* RESULT */}
      {data && (
        <>
          <div className="result-card">
            <h3>📍 {data.city}</h3>
            <p>🌡️ {t("temp")}: {data.current.temp} °C</p>
            <p>💧 {t("humidity")}: {data.current.humidity} %</p>
            <p>🌤️ {t("condition")}: {data.current.desc}</p>
          </div>

          <div className="result-card">
            <h3>📅 {t("forecast")}</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {data.forecast.map((f, i) => (
                <li key={i}>
                  📆 {f.date} → 🌡️ {f.temp}°C → 🌤️ {f.desc}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default WeatherPage;
