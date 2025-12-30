import { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "./context/LanguageContext";
import "./App.css";

function MarketPrices() {
  const { t } = useLanguage();
  const [prices, setPrices] = useState([]);
  const [state, setState] = useState("Gujarat");

  useEffect(() => {
    fetchPrices();
  }, [state]);

  const fetchPrices = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/mandi/prices/?state=${state}&limit=50`
    );
    setPrices(res.data.prices || []);
  };

  return (
    <div className="market-page">
      <h2>🌾 {t("rates")} – Market Prices</h2>

      {/* FILTER */}
      <div style={{ marginBottom: "20px" }}>
        <label>State: </label>
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="Gujarat">Gujarat</option>
          <option value="Maharashtra">Maharashtra</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
        </select>
      </div>

      {/* TABLE */}
      <table className="market-table">
        <thead>
          <tr>
            <th>Crop</th>
            <th>Market</th>
            <th>Price (₹)</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p, i) => (
            <tr key={i}>
              <td>{t(`crop_${p.crop_key}`)}</td>
              <td>{p.market}</td>
              <td>₹{p.price}</td>
              <td>
                {p.trend === "up" && "▲"}
                {p.trend === "down" && "▼"}
                {p.trend === "same" && "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MarketPrices;
