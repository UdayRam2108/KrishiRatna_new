import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./context/LanguageContext";
import axios from "axios";
import "./App.css";

function MarketTicker() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const [prices, setPrices] = useState([]);
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    fetchPrices();
  }, [language]);

  const fetchPrices = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/mandi/prices/?state=Gujarat"
      );

      setPrices(res.data.prices || []);
      setUpdatedAt(res.data.updated_at);
    } catch (err) {
      console.error("Failed to fetch mandi prices");
    }
  };

  const renderTrend = (trend) => {
    if (trend === "up") return <span className="trend-up">▲</span>;
    if (trend === "down") return <span className="trend-down">▼</span>;
    return <span className="trend-same">—</span>;
  };

  return (
    <div className="market-strip" title={`Updated at: ${updatedAt}`}>
      {/* LEFT FIXED */}
      <div className="market-strip-left">
        <span className="live-dot"></span>
        <span className="rates-text">{t("rates")}</span>
      </div>

      {/* MOVING CONTENT */}
      <div className="market-strip-track">
        <div className="market-strip-content">
          {prices.length === 0 && t("market_loading")}

          {prices.map((item, index) => (
            <span key={index}>
              🌾 {t(`crop_${item.crop_key}`)} ({item.market}) ₹{item.price}{" "}
              {renderTrend(item.trend)}
              &nbsp;&nbsp;|&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* RIGHT BUTTON */}
      <button
        className="market-strip-btn"
        onClick={() => navigate("/market-prices")}
      >
        {t("view_all_prices")} →
      </button>
    </div>
  );
}

export default MarketTicker;
